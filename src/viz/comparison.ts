import type { ComparisonItem, ComparisonParams, ScientificStatus } from '../data/types';
import type { VizFactory } from './types';
import { easeOut, ink, label, roundRect, span, unit, withAlpha } from './kit';

const statusColor: Record<ScientificStatus, string> = {
  established: '#8fd6a8',
  inferred: '#f2c46b',
  hypothetical: '#c7a6ff',
};

const LOG_TICKS = [1e-3, 1e-2, 0.1, 1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];

function tickLabel(v: number): string {
  if (v >= 1e9) return `${v / 1e9}B`;
  if (v >= 1e6) return `${v / 1e6}M`;
  if (v >= 1e3) return `${v / 1e3}k`;
  return String(v);
}

/** How far each changed item has grown in at progress p (changed items reveal one after another). */
function growth(items: ComparisonItem[], p: number): number[] {
  const changed = items.filter((i) => i.changed);
  const slot = 0.8 / Math.max(1, changed.length);
  return items.map((item) => {
    if (!item.changed) return 1;
    const k = changed.indexOf(item);
    return easeOut(span(p, 0.08 + k * slot, 0.08 + (k + 1) * slot));
  });
}

/**
 * A bar chart of real quantities: reality first, then the changed values grow in.
 * Linear or log scale; an item with `min` draws as a range.
 */
const factory: VizFactory = ({ accent, params }) => {
  if (!params || params.kind !== 'comparison') throw new Error('comparison visual needs comparison params');
  const { items, scale, unit: unitLabel } = params as ComparisonParams;
  const values = items.flatMap((i) => (i.min !== undefined ? [i.min, i.value] : [i.value])).filter((v) => v > 0);
  const hi = Math.max(...values);
  const lo = scale === 'log' ? Math.min(...values) : 0;
  const logLo = Math.floor(Math.log10(lo)) - 0.15;
  const logHi = Math.log10(hi) + 0.25;
  const pos = (v: number) =>
    scale === 'log' ? span(Math.log10(Math.max(v, 1e-12)), logLo, logHi) : Math.max(0, v) / (hi * 1.08);

  return {
    ambient: false,
    aspect: { wide: 16 / 9, narrow: 4 / 5 },

    valueText: (p) => {
      const g = growth(items, p);
      return items
        .filter((_, i) => g[i] > 0.98)
        .map((i) => `${i.label}: ${i.display}`)
        .join('. ');
    },

    readouts: (p) => {
      const g = growth(items, p);
      return items
        .map((item, i) => ({ item, shown: g[i] > 0.98 }))
        .filter(({ item }) => item.changed)
        .map(({ item, shown }) => ({ label: item.label, value: shown ? item.display : '—', calculated: item.calculated }));
    },

    draw({ ctx, w, h, p }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const fs = Math.max(11, u * (narrow ? 1.7 : 1.3));
      const g = growth(items, p);

      const left = narrow ? u * 4 : w * 0.3;
      const right = w - (narrow ? u * 4 : w * 0.06);
      const top = h * 0.12;
      const bottom = h * 0.86;
      const rowH = (bottom - top) / items.length;
      const barH = Math.max(8, Math.min(rowH * (narrow ? 0.26 : 0.38), u * 4));
      const x = (v: number) => left + pos(v) * (right - left);

      // Scale ticks.
      ctx.lineWidth = 1;
      const ticks =
        scale === 'log'
          ? LOG_TICKS.filter((t) => Math.log10(t) >= logLo && Math.log10(t) <= logHi)
          : linearTicks(hi * 1.08);
      for (const t of ticks) {
        const tx = x(t);
        ctx.strokeStyle = ink.ghost;
        ctx.beginPath();
        ctx.moveTo(tx, top - fs * 0.6);
        ctx.lineTo(tx, bottom);
        ctx.stroke();
        label(ctx, tickLabel(t), tx, bottom + fs * 1.2, {
          align: 'center',
          size: fs * 0.8,
          color: ink.faint,
          font: 'mono',
        });
      }
      label(ctx, unitLabel.toUpperCase() + (scale === 'log' ? ' · LOG SCALE' : ''), right, bottom + fs * 2.6, {
        align: 'right',
        size: fs * 0.75,
        color: ink.faint,
        weight: 600,
      });

      items.forEach((item, i) => {
        const cy = top + rowH * i + rowH * (narrow ? 0.62 : 0.5);
        const labelY = narrow ? cy - barH / 2 - fs * 1.5 : cy - fs * 0.45;
        const labelX = narrow ? left : left - u * 2;
        const align = narrow ? 'left' : 'right';
        const color = item.changed ? accent : '#e9e2d4';
        const visible = g[i];

        label(ctx, item.label, labelX, labelY, { align, size: fs, color: item.changed ? ink.text : ink.dim });
        if (!narrow) {
          label(ctx, item.status.toUpperCase(), labelX, cy + fs * 0.75, {
            align,
            size: fs * 0.66,
            color: withAlpha(statusColor[item.status], 0.85),
            weight: 600,
          });
        }

        // Track.
        ctx.fillStyle = withAlpha('#ffffff', 0.04);
        roundRect(ctx, left, cy - barH / 2, right - left, barH, barH / 2);
        ctx.fill();

        if (visible <= 0) {
          label(ctx, 'press play to reveal', left + u, cy, { size: fs * 0.75, color: ink.faint });
          return;
        }
        const x0 = item.min !== undefined ? x(item.min) : left;
        const x1 = x0 + (x(item.value) - x0) * visible;
        ctx.fillStyle = withAlpha(color, item.changed ? 0.85 : 0.55);
        roundRect(ctx, x0, cy - barH / 2, Math.max(barH * 0.6, x1 - x0), barH, barH / 2);
        ctx.fill();
        if (item.status === 'hypothetical') {
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = withAlpha(color, 0.9);
          roundRect(ctx, x0, cy - barH / 2, Math.max(barH * 0.6, x1 - x0), barH, barH / 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (visible > 0.98) {
          const valueInside = x1 + fs * 8 > right;
          label(ctx, item.display, valueInside ? x1 - u : x1 + u * 1.2, narrow ? labelY : cy, {
            align: valueInside || narrow ? 'right' : 'left',
            size: fs * 0.95,
            color: ink.text,
            font: 'mono',
          });
          if (narrow) {
            label(ctx, item.status.toUpperCase(), left, cy + barH / 2 + fs * 0.9, {
              size: fs * 0.62,
              color: withAlpha(statusColor[item.status], 0.85),
              weight: 600,
            });
          }
        }
      });
    },
  };
};

/** Evenly spaced round ticks (1, 2 or 5 × 10ⁿ apart) from 0 up to max. */
function linearTicks(max: number): number[] {
  const rough = max / 4;
  const mag = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= rough) ?? 10 * mag;
  const out: number[] = [];
  for (let t = 0; t <= max + 1e-9; t += step) out.push(t);
  return out;
}

export default factory;
