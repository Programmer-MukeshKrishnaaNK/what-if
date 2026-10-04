/**
 * Ambient sound for WHAT IF? — one application-level engine that survives route
 * changes, so the room tone never restarts between questions and branches.
 *
 * - Off by default. Playback only ever starts from a user gesture.
 * - The track is fetched lazily, the first time the reader turns sound on.
 * - Web Audio loops the decoded buffer between fixed points (the file is
 *   composed to be exactly periodic there), so the loop is seamless.
 * - All volume changes are short gain ramps: no clicks, no jumps.
 * - Any failure (missing file, decode error, blocked playback) degrades to
 *   "Sound unavailable" and never throws into the app.
 */

export type AudioStatus = 'off' | 'armed' | 'loading' | 'playing' | 'unavailable';

export interface AudioState {
  status: AudioStatus;
  muted: boolean;
  /** 0–1, as shown on the slider. */
  volume: number;
}

interface Prefs {
  enabled: boolean;
  muted: boolean;
  volume: number;
}

const STORAGE_KEY = 'what-if-audio';
const DEFAULT_VOLUME = 0.22;
/** Loop points in the file, in seconds (see tools/compose-ambience.mjs). */
const LOOP_START = 2;
const LOOP_END = 66;

const base = import.meta.env.BASE_URL;
const SOURCES = [
  { url: `${base}audio/observatory.ogg`, type: 'audio/ogg; codecs="opus"' },
  { url: `${base}audio/observatory.m4a`, type: 'audio/mp4; codecs="mp4a.40.2"' },
];

function loadPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (raw && typeof raw === 'object') {
      return {
        enabled: raw.enabled === true,
        muted: raw.muted === true,
        volume: typeof raw.volume === 'number' && raw.volume >= 0 && raw.volume <= 1 ? raw.volume : DEFAULT_VOLUME,
      };
    }
  } catch {
    /* storage unavailable or corrupted: use defaults */
  }
  return { enabled: false, muted: false, volume: DEFAULT_VOLUME };
}

function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: preference lasts for this visit only */
  }
}

type Listener = (state: AudioState) => void;

export class AudioManager {
  private prefs = loadPrefs();
  private status: AudioStatus = 'off';
  private listeners = new Set<Listener>();
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  /** Fallback for browsers without Web Audio. */
  private element: HTMLAudioElement | null = null;
  private loading: Promise<boolean> | null = null;
  private suspendTimer = 0;

  constructor() {
    // A returning reader who left sound on: resume on their first interaction
    // with the page. Never before — browsers rightly block that.
    if (this.prefs.enabled) this.arm();
  }

  /** Wait for a gesture browsers accept as user activation, then resume. */
  private arm() {
    this.status = 'armed';
    const resume = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== 'Enter' && e.key !== ' ') return;
      window.removeEventListener('pointerdown', resume, true);
      window.removeEventListener('keydown', resume, true);
      if (this.status === 'armed') void this.play();
    };
    window.addEventListener('pointerdown', resume, true);
    window.addEventListener('keydown', resume, true);
  }

  getState(): AudioState {
    return { status: this.status, muted: this.prefs.muted, volume: this.prefs.volume };
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.getState());
    return () => this.listeners.delete(fn);
  }

  /** Must be called from a user gesture (click / keypress). */
  async play(): Promise<void> {
    if (this.status === 'playing' || this.status === 'loading' || this.status === 'unavailable') return;
    const wasArmed = this.status === 'armed';
    this.setStatus('loading');
    const ok = await this.ensureLoaded();
    if (!ok) {
      this.setStatus('unavailable');
      return;
    }
    try {
      window.clearTimeout(this.suspendTimer);
      if (this.ctx) {
        if (this.ctx.state !== 'running') await this.ctx.resume();
        if (this.ctx.state !== 'running') throw new Error('Playback not allowed yet');
        this.rampTo(this.targetGain(), 1.2);
      } else if (this.element) {
        this.element.volume = this.targetGain();
        await this.element.play();
      }
      this.prefs.enabled = true;
      savePrefs(this.prefs);
      this.setStatus('playing');
    } catch {
      // Playback was refused (no qualifying gesture). Stay quiet; a returning
      // reader's preference waits for their next interaction.
      if (wasArmed) {
        this.arm();
        this.emit();
      } else {
        this.setStatus('off');
      }
    }
  }

  pause(): void {
    if (this.status === 'loading') return;
    this.prefs.enabled = false;
    savePrefs(this.prefs);
    if (this.status !== 'playing') {
      if (this.status === 'armed') this.setStatus('off');
      return;
    }
    if (this.ctx) {
      this.rampTo(0, 0.35);
      // Suspend once the fade has finished; resuming continues from the same point.
      this.suspendTimer = window.setTimeout(() => void this.ctx?.suspend().catch(() => {}), 600);
    } else {
      this.element?.pause();
    }
    this.setStatus('off');
  }

  toggle(): void {
    if (this.status === 'playing') this.pause();
    else void this.play();
  }

  setVolume(volume: number): void {
    this.prefs.volume = Math.min(1, Math.max(0, volume));
    savePrefs(this.prefs);
    this.applyGain(0.08);
    this.emit();
  }

  mute(): void {
    this.prefs.muted = true;
    savePrefs(this.prefs);
    this.applyGain(0.12);
    this.emit();
  }

  unmute(): void {
    this.prefs.muted = false;
    savePrefs(this.prefs);
    this.applyGain(0.3);
    this.emit();
  }

  toggleMute(): void {
    if (this.prefs.muted) this.unmute();
    else this.mute();
  }

  // ---------- internals ----------

  private targetGain(): number {
    return this.prefs.muted ? 0 : this.prefs.volume;
  }

  private applyGain(seconds: number) {
    if (this.status !== 'playing') return;
    if (this.ctx) this.rampTo(this.targetGain(), seconds);
    else if (this.element) this.element.volume = this.targetGain();
  }

  private rampTo(value: number, seconds: number) {
    if (!this.ctx || !this.gain) return;
    const now = this.ctx.currentTime;
    const g = this.gain.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    // Exponential-ish approach without clicks; time constant = a third of the fade.
    g.setTargetAtTime(value, now, Math.max(0.01, seconds / 3));
  }

  private ensureLoaded(): Promise<boolean> {
    if (!this.loading) {
      this.loading = this.load().catch(() => false);
      // Allow a later retry if loading failed (e.g. offline).
      void this.loading.then((ok) => {
        if (!ok) this.loading = null;
      });
    }
    return this.loading;
  }

  private async load(): Promise<boolean> {
    const probe = document.createElement('audio');
    const candidates = SOURCES.filter((s) => probe.canPlayType(s.type) !== '');
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (Ctx) {
      // Created inside the user gesture that called play().
      const ctx = new Ctx();
      for (const src of candidates) {
        try {
          const res = await fetch(src.url);
          if (!res.ok) continue;
          const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
          const gain = ctx.createGain();
          gain.gain.value = 0;
          gain.connect(ctx.destination);
          const node = ctx.createBufferSource();
          node.buffer = buffer;
          node.loop = true;
          node.loopStart = LOOP_START;
          node.loopEnd = Math.min(LOOP_END, buffer.duration);
          node.connect(gain);
          node.start(0, LOOP_START);
          this.ctx = ctx;
          this.gain = gain;
          return true;
        } catch {
          /* try the next format */
        }
      }
      void ctx.close().catch(() => {});
      return false;
    }

    // No Web Audio: a looping <audio> element is the (less seamless) fallback.
    const src = candidates[0];
    if (!src) return false;
    const el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.src = src.url;
    el.volume = 0;
    const ok = await new Promise<boolean>((resolve) => {
      el.addEventListener('canplaythrough', () => resolve(true), { once: true });
      el.addEventListener('error', () => resolve(false), { once: true });
    });
    if (ok) this.element = el;
    return ok;
  }

  private setStatus(status: AudioStatus) {
    this.status = status;
    this.emit();
  }

  private emit() {
    const state = this.getState();
    for (const fn of this.listeners) fn(state);
  }
}

export const audio = new AudioManager();
