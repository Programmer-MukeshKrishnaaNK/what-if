import type { ScientificStatus, TimelineParams } from '../data/types';
import type { VizFactory } from './types';
import { circle, ink, label, span, unit, withAlpha } from './kit';

const statusColor: Record<ScientificStatus, string> = {
  established: '#8fd6a8',
  inferred: '#f2c46b',
  hypothetical: '#c7a6ff',
};

const MIN = 60;
const HOUR = 3600;
const DAY = 86400;
const YEAR = 365.25 * DAY;

/** "3.2 days", "about 4 months", "12 thousand years"… */
export function humanizeSeconds(s: number): string {
  const r = (v: number) => (v < 10 ? v.toFixed(1).replace(/\.0$/, '') : Math.round(v).toLocaleString('en-US'));
  if (s < 90) return `${r(s)} s`;
  if (s < 90 * MIN) return `${r(s / MIN)} min`;
  if (s < 36 * HOUR) return `${r(s / HOUR)} h`;
  if (s < 60 * DAY) return `${r(s / DAY)} days`;
  if (s < 2 * YEAR) return `${r(s / (YEAR / 12))} months`;
  if (s < 1e4 * YEAR) return `${r(s / YEAR)} years`;
  if (s < 1e6 * YEAR) return `${r(s / YEAR / 1e3)} thousand years`;
  if (s < 1e9 * YEAR) return `${r(s / YEAR / 1e6)} million years`;
  return `${r(s / YEAR / 1e9)} billion years`;
}

const NAMED_TICKS: [number, string][] = [
  [1, '1 s'],
  [MIN, '1 min'],
  [HOUR, '1 hour'],
  [DAY, '1 day'],
  [7 * DAY, '1 week'],
  [30 * DAY, '1 month'],
  [YEAR, '1 year'],
  [100 * YEAR, '100 yr'],
  [1e4 * YEAR, '10k yr'],
  [1e6 * YEAR, '1M yr'],
  [1e9 * YEAR, '1B yr'],
];

/**
 * A timeline of consequences after the change. The cursor sweeps forward and each
 * event lights up as it is reached. Log scale for "seconds to millions of years".
 */
const factory: VizFactory = ({ accent, params }) => {
  if (!params || params.kind !== 'timeline') throw new Error('timeline visual needs timeline params');
  const { events, scale, from, to } = params as TimelineParams;
  const frac = (t: number) =>
    scale === 'log' ? span(Math.log10(Math.max(t, from)), Math.log10(from), Math.log10(to)) : span(t, from, to);
  const timeAt = (p: number) => (scale === 'log' ? 10 ** (Math.log10(from) + p * (Math.log10(to) - Math.log10(from))) : from + p * (to - from));
  const sorted = [...events].sort((a, b) => a.at - b.at);
  const reached = (p: number) => sorted.filter((e) => frac(e.at) <= p + 1e-6);

  return {
    ambient: false,
    aspect: { wide: 16 / 9, narrow: 3 / 4 },

    valueText: (p) => {
      const r = reached(p);
      const last = r[r.length - 1];
      return `${humanizeSeconds(timeAt(p))} after the change.${last ? ` Latest: ${last.label} (${last.display}).` : ''}`;
    },

    readouts: (p) => {
      const r = reached(p);
      const last = r[r.length - 1];
      return [
        { label: 'Time since the change', value: p === 0 ? '—' : `≈ ${humanizeSeconds(timeAt(p))}` },
        { label: 'Latest consequence', value: last ? last.label : '—' },
      ];
    },

    draw({ ctx, w, h, p }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const fs = Math.max(11, u * (narrow ? 1.7 : 1.3));
      const ticks =
        scale === 'log'
          ? NAMED_TICKS.filter(([t]) => t >= from && t <= to)
          : Array.from({ length: 5 }, (_, i): [number, string] => {
              const t = from + ((to - from) * i) / 4;
              return [t, humanizeSeconds(t)];
            });

      if (!narrow) {
        // Horizontal axis; labels alternate above and below.
        const x0 = w * 0.06;
        const x1 = w * 0.94;
        const ay = h * 0.55;
        const X = (t: number) => x0 + frac(t) * (x1 - x0);
        ctx.strokeStyle = ink.faint;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, ay);
        ctx.lineTo(x1, ay);
        ctx.stroke();
        ctx.strokeStyle = withAlpha(accent, 0.9);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, ay);
        ctx.lineTo(x0 + p * (x1 - x0), ay);
        ctx.stroke();
        for (const [t, name] of ticks) {
          ctx.strokeStyle = ink.faint;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(X(t), ay - 4);
          ctx.lineTo(X(t), ay + 4);
          ctx.stroke();
          label(ctx, name, X(t), h * 0.93, { align: 'center', size: fs * 0.78, color: ink.faint, font: 'mono' });
        }
        sorted.forEach((e, i) => {
          const ex = X(e.at);
          const on = frac(e.at) <= p + 1e-6;
          const up = i % 2 === 0;
          const ly = up ? ay - h * (0.14 + (i % 4 === 0 ? 0.12 : 0)) : ay + h * (0.12 + (i % 4 === 1 ? 0.1 : 0));
          ctx.strokeStyle = withAlpha('#ffffff', on ? 0.35 : 0.08);
          ctx.beginPath();
          ctx.moveTo(ex, ay);
          ctx.lineTo(ex, ly + (up ? fs * 1.2 : -fs * 1.2));
          ctx.stroke();
          ctx.fillStyle = on ? accent : '#1a1d24';
          ctx.strokeStyle = on ? accent : ink.faint;
          circle(ctx, ex, ay, Math.max(4, u * 0.8));
          ctx.fill();
          ctx.stroke();
          const align: CanvasTextAlign = ex < w * 0.2 ? 'left' : ex > w * 0.8 ? 'right' : 'center';
          label(ctx, e.display, ex, ly - fs * 0.6, { align, size: fs * 0.85, color: on ? accent : ink.ghost, font: 'mono' });
          label(ctx, e.label, ex, ly + fs * 0.6, { align, size: fs, color: on ? ink.text : ink.ghost });
          if (on) {
            label(ctx, e.status.toUpperCase(), ex, ly + fs * 1.8, {
              align,
              size: fs * 0.62,
              color: withAlpha(statusColor[e.status], 0.85),
              weight: 600,
            });
          }
        });
        return;
      }

      // Narrow: vertical axis with labels to the right.
      const ax = u * 7;
      const y0 = h * 0.05;
      const y1 = h * 0.95;
      const Y = (t: number) => y0 + frac(t) * (y1 - y0);
      ctx.strokeStyle = ink.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ax, y0);
      ctx.lineTo(ax, y1);
      ctx.stroke();
      ctx.strokeStyle = withAlpha(accent, 0.9);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, y0);
      ctx.lineTo(ax, y0 + p * (y1 - y0));
      ctx.stroke();
      for (const [t] of ticks) {
        ctx.strokeStyle = ink.faint;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax - 4, Y(t));
        ctx.lineTo(ax + 4, Y(t));
        ctx.stroke();
      }
      // Spread labels so they never overlap, keeping order.
      const minGap = fs * 3.4;
      const ys: number[] = [];
      sorted.forEach((e, i) => {
        const want = Y(e.at);
        ys.push(i === 0 ? want : Math.max(want, ys[i - 1] + minGap));
      });
      const overflow = ys.length ? ys[ys.length - 1] - (y1 - fs) : 0;
      if (overflow > 0) for (let i = ys.length - 1; i >= 0; i--) ys[i] = Math.min(ys[i], (i === ys.length - 1 ? y1 - fs : ys[i + 1] - minGap));
      sorted.forEach((e, i) => {
        const on = frac(e.at) <= p + 1e-6;
        const ey = Y(e.at);
        ctx.strokeStyle = withAlpha('#ffffff', on ? 0.3 : 0.08);
        ctx.beginPath();
        ctx.moveTo(ax, ey);
        ctx.lineTo(ax + u * 4, ys[i]);
        ctx.stroke();
        ctx.fillStyle = on ? accent : '#1a1d24';
        ctx.strokeStyle = on ? accent : ink.faint;
        circle(ctx, ax, ey, Math.max(4, u * 1));
        ctx.fill();
        ctx.stroke();
        const tx = ax + u * 5;
        label(ctx, e.display, tx, ys[i] - fs * 0.7, { size: fs * 0.85, color: on ? accent : ink.ghost, font: 'mono' });
        label(ctx, e.label, tx, ys[i] + fs * 0.55, { size: fs, color: on ? ink.text : ink.ghost });
        if (on) {
          label(ctx, e.status.toUpperCase(), tx, ys[i] + fs * 1.65, {
            size: fs * 0.62,
            color: withAlpha(statusColor[e.status], 0.85),
            weight: 600,
          });
        }
      });
    },
  };
};

export default factory;
