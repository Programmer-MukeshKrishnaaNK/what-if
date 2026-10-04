// Renders the WHAT IF? ambient loop ("Observatory") to a WAV file.
//
//   node tools/compose-ambience.mjs out.wav
//
// Seamless looping by construction: every component is exactly periodic with
// period L. Oscillator frequencies are quantised to multiples of 1/L Hz, noise is
// generated for one period and repeated, and filters/reverb run for several
// periods so their output is the periodic steady state. The file is written as
// [last PAD s][one period][first PAD s], so a player that loops from PAD to
// PAD + L is seamless even if a decoder shifts the audio by a few samples.

import { writeFileSync } from 'node:fs';

const SR = 48000;
const L = 64; // loop length, seconds (integer → whole samples at 44.1k and 48k)
const PAD = 2;
const N = SR * L;
const TAU = Math.PI * 2;

const q = (f) => Math.round(f * L) / L; // quantise to the loop's frequency grid

let seed = 7;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const left = new Float64Array(N);
const right = new Float64Array(N);
const wetL = new Float64Array(N);
const wetR = new Float64Array(N);

/** Slow, periodic swell between `lo` and 1. */
const swell = (t, cycles, phase, lo) => lo + (1 - lo) * (0.5 - 0.5 * Math.cos((TAU * cycles * t) / L + phase));

// ---- 1. Pad: an open D chord (D, A, E — no third, so it stays neutral) ----
const voices = [
  { f: 73.42, amp: 0.1, pan: 0.0, cycles: 1, phase: 0.0 },
  { f: 110.0, amp: 0.1, pan: -0.35, cycles: 2, phase: 1.1 },
  { f: 146.83, amp: 0.1, pan: 0.35, cycles: 1, phase: 2.3 },
  { f: 220.0, amp: 0.07, pan: 0.25, cycles: 2, phase: 3.4 },
  { f: 293.66, amp: 0.05, pan: -0.3, cycles: 3, phase: 0.6 },
  { f: 329.63, amp: 0.04, pan: -0.45, cycles: 4, phase: 1.9 },
  { f: 440.0, amp: 0.022, pan: 0.4, cycles: 3, phase: 2.7 },
];
const harmonics = [1, 0.4, 0.16, 0.07];
for (const v of voices) {
  // A detuned twin a fraction of a hertz away makes the chord breathe slowly.
  const pair = [
    { f: q(v.f), pan: v.pan - 0.15 },
    { f: q(v.f) + 6 / L, pan: v.pan + 0.15 },
  ];
  for (const osc of pair) {
    const gl = Math.cos(((osc.pan + 1) * Math.PI) / 4);
    const gr = Math.sin(((osc.pan + 1) * Math.PI) / 4);
    for (let i = 0; i < N; i++) {
      const t = i / SR;
      let s = 0;
      for (let h = 0; h < harmonics.length; h++) s += harmonics[h] * Math.sin(TAU * osc.f * (h + 1) * t + h * 0.7);
      s *= v.amp * 0.5 * swell(t, v.cycles, v.phase, 0.35);
      left[i] += s * gl;
      right[i] += s * gr;
      wetL[i] += s * gl * 0.25;
      wetR[i] += s * gr * 0.25;
    }
  }
}

// Sub-bass breath, felt more than heard.
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const s = 0.03 * Math.sin(TAU * q(36.71) * t) * swell(t, 1, 4.0, 0.2);
  left[i] += s;
  right[i] += s;
}

// ---- 2. Air: band-limited noise, like a ventilated room at night ----
function biquadBandpass(f0, Qv) {
  const w = (TAU * f0) / SR;
  const alpha = Math.sin(w) / (2 * Qv);
  const a0 = 1 + alpha;
  return { b0: alpha / a0, b1: 0, b2: -alpha / a0, a1: (-2 * Math.cos(w)) / a0, a2: (1 - alpha) / a0 };
}
function periodicFilteredNoise(f0, Qv, s0) {
  seed = s0;
  const base = new Float64Array(N);
  for (let i = 0; i < N; i++) base[i] = rand() * 2 - 1;
  const c = biquadBandpass(f0, Qv);
  const out = new Float64Array(N);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < N; i++) {
      const x = base[i];
      const y = c.b0 * x + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
      if (pass === 1) out[i] = y;
    }
  }
  return out;
}
const airL = periodicFilteredNoise(1800, 0.6, 11);
const airR = periodicFilteredNoise(1800, 0.6, 29);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = 0.034 * swell(t, 2, 0.8, 0.4);
  left[i] += airL[i] * g;
  right[i] += airR[i] * g;
  wetL[i] += airL[i] * g * 0.6;
  wetR[i] += airR[i] * g * 0.6;
}

// ---- 3. Instrument tones: sparse, soft bell-like pings ----
const pings = [
  { at: 6.0, f: 880.0, pan: -0.4 },
  { at: 17.5, f: 659.26, pan: 0.3 },
  { at: 29.0, f: 1174.66, pan: -0.15 },
  { at: 41.5, f: 987.77, pan: 0.45 },
  { at: 52.0, f: 739.99, pan: -0.3 },
  { at: 58.5, f: 1318.51, pan: 0.15 },
];
const bellPartials = [
  [1, 1],
  [2.0, 0.28],
  [2.76, 0.12],
  [5.4, 0.04],
];
const ATTACK = 0.06;
const DECAY = 3.2;
for (const p of pings) {
  const gl = Math.cos(((p.pan + 1) * Math.PI) / 4);
  const gr = Math.sin(((p.pan + 1) * Math.PI) / 4);
  const len = Math.floor(SR * DECAY * 7);
  const start = Math.floor(p.at * SR);
  for (let k = 0; k < len; k++) {
    const t = k / SR;
    const env = (t < ATTACK ? 0.5 - 0.5 * Math.cos((Math.PI * t) / ATTACK) : 1) * Math.exp(-t / DECAY);
    let s = 0;
    for (const [ratio, a] of bellPartials) s += a * Math.sin(TAU * q(p.f * ratio) * ((start + k) / SR)) * Math.exp(-t * (ratio - 1) * 0.25);
    s *= 0.04 * env;
    const i = (start + k) % N; // tails wrap around the loop
    left[i] += s * gl;
    right[i] += s * gr;
    wetL[i] += s * gl * 1.4;
    wetR[i] += s * gr * 1.4;
  }
}

// ---- 4. Room: a small Schroeder reverb, run to steady state ----
function reverb(input, stereoOffset) {
  const scale = SR / 44100;
  const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((d) => Math.round((d + stereoOffset) * scale * 1.6));
  const allpasses = [556, 441, 341].map((d) => Math.round((d + stereoOffset) * scale));
  const out = new Float64Array(N);
  const cb = combs.map((d) => ({ buf: new Float64Array(d), i: 0, lp: 0 }));
  const ab = allpasses.map((d) => ({ buf: new Float64Array(d), i: 0 }));
  const feedback = 0.88;
  const damp = 0.35;
  for (let pass = 0; pass < 3; pass++) {
    for (let n = 0; n < N; n++) {
      const x = input[n] * 0.12;
      let y = 0;
      for (const c of cb) {
        const o = c.buf[c.i];
        c.lp = o * (1 - damp) + c.lp * damp;
        c.buf[c.i] = x + c.lp * feedback;
        c.i = (c.i + 1) % c.buf.length;
        y += o;
      }
      for (const a of ab) {
        const o = a.buf[a.i];
        const v = y + o * 0.5;
        a.buf[a.i] = v;
        a.i = (a.i + 1) % a.buf.length;
        y = o - v * 0.5;
      }
      if (pass === 2) out[n] = y;
    }
  }
  return out;
}
const revL = reverb(wetL, 0);
const revR = reverb(wetR, 23);
for (let i = 0; i < N; i++) {
  left[i] += revL[i] * 0.55;
  right[i] += revR[i] * 0.55;
}

// ---- 5. Master: normalise to -6 dBFS peak ----
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
const gain = 0.5 / peak;

// ---- 6. Write [tail][period][head] as 16-bit stereo WAV ----
const total = N + 2 * PAD * SR;
const at = (arr, j) => arr[((j % N) + N) % N];
const data = Buffer.alloc(total * 4);
for (let j = 0; j < total; j++) {
  const src = j - PAD * SR;
  const l = Math.max(-1, Math.min(1, at(left, src) * gain));
  const r = Math.max(-1, Math.min(1, at(right, src) * gain));
  data.writeInt16LE(Math.round(l * 32767), j * 4);
  data.writeInt16LE(Math.round(r * 32767), j * 4 + 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);
writeFileSync(process.argv[2] ?? 'ambience.wav', Buffer.concat([header, data]));
console.log(`wrote ${total / SR}s, loop ${PAD}s → ${PAD + L}s, peak gain ${gain.toFixed(2)}`);
