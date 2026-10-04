import type { StageCaption, VisualizationSpec } from '../data/types';
import { onReducedMotionChange, prefersReducedMotion } from '../app/motion';
import { loadVisualization } from '../viz/registry';
import type { Readout, Visualization } from '../viz/types';
import { h } from './dom';
import { errorState } from './error-state';

export interface StageHandle {
  el: HTMLElement;
  destroy(): void;
}

interface StageOptions {
  spec: VisualizationSpec;
  accent: string;
  /** Called once each time the change finishes playing (or is scrubbed to the end). */
  onComplete?: () => void;
}

const captionAt = (captions: StageCaption[], p: number) =>
  captions.reduce((cur, c) => (p >= c.at ? c : cur), captions[0]);

/**
 * The interactive stage: canvas visualization + trigger / scrubber / restart
 * controls + live readouts + a caption track. Generic over every scenario.
 */
export function createStage({ spec, accent, onComplete }: StageOptions): StageHandle {
  let viz: Visualization | null = null;
  let progress = 0;
  let playing = false;
  let reduced = prefersReducedMotion();
  let visible = true;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let completed = false;
  let destroyed = false;
  let width = 0;
  let height = 0;
  let readoutCells: { value: HTMLElement }[] = [];

  const canvas = h('canvas.stage-canvas', { role: 'img', 'aria-label': spec.description });
  const ctx = canvas.getContext('2d');
  const caption = h('p.stage-caption', { 'aria-live': 'polite' }, spec.captions[0]?.text ?? '');
  const disclaimer = h('p.stage-disclaimer', {}, spec.disclaimer);
  const loading = h('div.stage-loading', { role: 'status' }, h('span.loader', { 'aria-hidden': 'true' }), 'Loading visualization…');
  const canvasWrap = h('div.stage-canvas-wrap', {}, canvas, disclaimer, loading);

  const primary = h('button.btn.btn-primary.stage-trigger', { type: 'button', disabled: true });
  const primaryIcon = h('span.btn-icon', { 'aria-hidden': 'true' });
  const primaryText = h('span', {}, spec.triggerLabel);
  primary.append(primaryIcon, primaryText);

  const sliderId = `scrub-${spec.type}`;
  const slider = h('input.scrubber', {
    id: sliderId,
    type: 'range',
    min: 0,
    max: 1000,
    step: 1,
    value: 0,
    disabled: true,
  });
  const sliderLabel = h('label.scrubber-label', { for: sliderId }, spec.scrubLabel);
  const restart = h('button.btn.btn-ghost.stage-restart', { type: 'button', disabled: true, 'aria-label': 'Restart visualization' }, '↺ Restart');

  const controls = h(
    'div.stage-controls',
    {},
    primary,
    h('div.scrubber-wrap', {}, sliderLabel, slider),
    restart,
  );
  const readouts = h('dl.readouts', { 'aria-label': 'Live readouts' });
  const el = h('figure.stage', { style: `--accent:${accent}` }, canvasWrap, caption, controls, readouts);

  // ---------- rendering ----------

  function resize() {
    const rect = canvasWrap.getBoundingClientRect();
    if (!rect.width) return;
    const narrow = rect.width < 560;
    const aspect = viz?.aspect ? (narrow ? viz.aspect.narrow : viz.aspect.wide) : 16 / 9;
    const cssH = Math.min(rect.width / aspect, window.innerHeight * (narrow ? 0.9 : 0.78));
    // On narrow screens the disclaimer sits in its own strip above the canvas (see stage.css).
    const strip = getComputedStyle(disclaimer).position === 'static' ? disclaimer.offsetHeight : 0;
    canvasWrap.style.height = `${Math.round(cssH + strip)}px`;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = cssH;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(0);
  }

  function draw(dt: number) {
    if (!viz || !ctx || !width) return;
    ctx.clearRect(0, 0, width, height);
    viz.draw({ ctx, w: width, h: height, p: progress, t: clock, dt, reduced });
  }

  function updateUI() {
    const cap = captionAt(spec.captions, progress);
    if (cap && caption.textContent !== cap.text) caption.textContent = cap.text;
    slider.value = String(Math.round(progress * 1000));
    slider.style.setProperty('--fill', `${(progress * 100).toFixed(2)}%`);
    if (viz) slider.setAttribute('aria-valuetext', viz.valueText(progress));

    let label = spec.triggerLabel;
    let icon = '▶';
    if (playing) {
      label = 'Pause';
      icon = '❚❚';
    } else if (progress >= 1) {
      label = 'Replay';
      icon = '↺';
    } else if (progress > 0) {
      label = reduced ? 'Next step' : 'Resume';
      icon = '▶';
    }
    if (primaryText.textContent !== label) primaryText.textContent = label;
    primaryIcon.textContent = icon;
    restart.disabled = !viz || progress === 0;

    if (viz?.readouts) renderReadouts(viz.readouts(progress));
    if (progress >= 1 && !completed) {
      completed = true;
      onComplete?.();
    }
  }

  function renderReadouts(items: Readout[]) {
    if (readoutCells.length !== items.length) {
      readouts.replaceChildren();
      readoutCells = items.map((item) => {
        const value = h('dd.readout-value');
        readouts.append(
          h(
            'div.readout',
            {},
            h('dt.readout-label', {}, item.label, item.calculated ? h('span.calc', { title: 'Calculated from a formula' }, 'calc') : null),
            value,
          ),
        );
        return { value };
      });
    }
    items.forEach((item, i) => {
      const cell = readoutCells[i].value;
      if (cell.textContent !== item.value) cell.textContent = item.value;
    });
  }

  // ---------- loop ----------

  const needsLoop = () => visible && !document.hidden && !!viz && (playing || (viz.ambient && !reduced));

  function tick(now: number) {
    raf = 0;
    if (destroyed) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    clock += dt;
    if (playing) {
      progress = Math.min(1, progress + dt / spec.duration);
      if (progress >= 1) playing = false;
      updateUI();
    }
    draw(dt);
    schedule();
  }

  function schedule() {
    if (raf || !needsLoop()) {
      if (!needsLoop()) last = 0;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  // ---------- controls ----------

  function setProgress(p: number) {
    progress = Math.max(0, Math.min(1, p));
    if (progress < 1) completed = false;
    updateUI();
    draw(0);
    schedule();
  }

  function onPrimary() {
    if (!viz) return;
    if (reduced) {
      // No animation: step through the captions instead.
      if (progress >= 1) return setProgress(0);
      const next = spec.captions.find((c) => c.at > progress + 0.0001);
      return setProgress(next ? next.at : 1);
    }
    if (playing) {
      playing = false;
    } else {
      if (progress >= 1) {
        progress = 0;
        completed = false;
      }
      playing = true;
    }
    updateUI();
    schedule();
  }

  primary.addEventListener('click', onPrimary);
  restart.addEventListener('click', () => {
    playing = false;
    setProgress(0);
    primary.focus();
  });
  slider.addEventListener('input', () => {
    playing = false;
    setProgress(Number(slider.value) / 1000);
  });

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(canvasWrap);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  });
  io.observe(canvasWrap);
  const onVisibility = () => schedule();
  document.addEventListener('visibilitychange', onVisibility);
  const offReduced = onReducedMotionChange((r) => {
    reduced = r;
    updateUI();
    draw(0);
    schedule();
  });

  // ---------- load ----------

  async function load() {
    loading.hidden = false;
    canvasWrap.querySelector('.stage-error')?.remove();
    try {
      const factory = await loadVisualization(spec.type);
      if (destroyed) return;
      viz = factory({ accent, params: spec.params });
      loading.hidden = true;
      primary.disabled = false;
      slider.disabled = false;
      resize();
      updateUI();
      schedule();
      // Fonts used in canvas labels may arrive after the first paint.
      document.fonts?.ready.then(() => !destroyed && draw(0));
    } catch (err) {
      console.error(err);
      if (destroyed) return;
      loading.hidden = true;
      canvasWrap.append(errorState({ compact: true, onRetry: load }));
    }
  }
  load();

  return {
    el,
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      offReduced();
    },
  };
}
