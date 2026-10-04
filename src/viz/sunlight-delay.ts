import type { VizFactory } from './types';
import { circle, fmt, glow, ink, label, span, unit, withAlpha } from './kit';

const LIGHT_MIN_PER_AU = 8.317; // 149.6e6 km ÷ 299,792 km/s ÷ 60
const TOTAL_MIN = 10; // the scrubber spans ten minutes after the Sun vanishes
const KM_PER_MIN = 299_792 * 60;

const bodies = [
  { name: 'Mercury', au: 0.387, r: 0.55 },
  { name: 'Venus', au: 0.723, r: 0.9 },
  { name: 'Earth', au: 1, r: 1 },
];

const minutesAt = (p: number) => p * TOTAL_MIN;

function clock(min: number): string {
  const total = Math.round(min * 60);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Light travel time, rounded to the nearest 10 s (499 s → "8 min 20 s"). */
function arrival(au: number): string {
  const sec = Math.round((au * LIGHT_MIN_PER_AU * 60) / 10) * 10;
  return `${Math.floor(sec / 60)} min ${String(sec % 60).padStart(2, '0')} s`;
}

const factory: VizFactory = () => ({
  ambient: true,
  aspect: { wide: 21 / 9, narrow: 1 },

  valueText: (p) => {
    if (p === 0) return 'The Sun is shining';
    const m = minutesAt(p);
    const earthDark = m >= LIGHT_MIN_PER_AU;
    return `${clock(m)} after the Sun vanished. Earth is ${earthDark ? 'dark' : 'still in daylight'}.`;
  },

  readouts: (p) => {
    const m = minutesAt(p);
    const gone = p > 0;
    const earthDark = gone && m >= LIGHT_MIN_PER_AU;
    return [
      { label: 'Time since the Sun vanished', value: gone ? clock(m) : '—' },
      { label: 'Last sunlight has travelled', value: gone ? `${fmt((m * KM_PER_MIN) / 1e6)} million km` : '—', calculated: true },
      { label: "Earth's daytime sky", value: earthDark ? 'Dark' : 'Bright' },
      { label: 'Sun-to-Earth light travel time', value: `≈ ${arrival(1)}`, calculated: true },
    ];
  },

  draw({ ctx, w, h, p, t }) {
    const u = unit(w, h);
    const narrow = w < 560;
    const x0 = w * (narrow ? 0.1 : 0.07);
    const x1 = w * (narrow ? 0.84 : 0.9);
    const au = x1 - x0;
    const cy = h * 0.47;
    const fs = Math.max(10, u * 1.3);
    const gone = p > 0;
    const min = minutesAt(p);
    const frontX = gone ? x0 + (min / LIGHT_MIN_PER_AU) * au : -Infinity;

    // Distance axis.
    ctx.strokeStyle = ink.ghost;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, h * 0.84);
    ctx.lineTo(x1, h * 0.84);
    ctx.stroke();
    for (const tick of [0, 0.5, 1]) {
      const x = x0 + tick * au;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.84 - 4);
      ctx.lineTo(x, h * 0.84 + 4);
      ctx.stroke();
      const txt = tick === 0 ? '0' : tick === 1 ? '150 million km' : '75';
      label(ctx, txt, x, h * 0.84 + fs * 1.3, { align: tick === 1 ? 'right' : 'center', size: fs * 0.85, color: ink.faint });
    }

    // Sunlight in flight: wave crests moving outward at a scaled light speed (1 AU per 10 s).
    const speed = au / 10;
    const gap = Math.max(14, u * 2.4);
    const phase = (t * speed) % gap;
    const bandH = Math.max(36, h * 0.3);
    for (let x = x0 + phase; x < w + gap; x += gap) {
      if (x <= frontX) continue;
      const fade = 1 - span(x, x1 + u * 4, w);
      ctx.strokeStyle = withAlpha(ink.sun, 0.12 + 0.22 * fade);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, cy - bandH / 2);
      ctx.lineTo(x, cy + bandH / 2);
      ctx.stroke();
    }

    // The last light ever emitted.
    if (gone && frontX < w) {
      const g = ctx.createLinearGradient(frontX - u * 6, 0, frontX + u * 0.5, 0);
      g.addColorStop(0, withAlpha(ink.sun, 0));
      g.addColorStop(1, withAlpha(ink.sun, 0.35));
      ctx.fillStyle = g;
      ctx.fillRect(frontX - u * 6, cy - bandH / 2, u * 6.5, bandH);
      ctx.strokeStyle = ink.sun;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(frontX, cy - bandH / 2 - u * 2);
      ctx.lineTo(frontX, cy + bandH / 2 + u * 2);
      ctx.stroke();
      label(ctx, 'last light', frontX, cy - bandH / 2 - u * 3.6, { align: 'center', size: fs * 0.9, color: ink.sun });
    }

    // The Sun (or where it was).
    const sunR = Math.max(10, u * 4.2);
    const sunA = 1 - span(p, 0, 0.012);
    if (sunA > 0) {
      glow(ctx, x0, cy, sunR * 4, ink.sun, sunA);
      ctx.fillStyle = withAlpha('#ffe2a8', sunA);
      circle(ctx, x0, cy, sunR);
      ctx.fill();
    }
    if (gone) {
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = ink.faint;
      ctx.lineWidth = 1;
      circle(ctx, x0, cy, sunR);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    label(ctx, gone ? 'Sun (gone)' : 'Sun', x0, cy + sunR + fs * 1.6, { align: 'center', size: fs, color: ink.dim });

    // Planets: lit on the Sun-facing side until the last light passes them.
    for (const b of bodies) {
      const x = x0 + b.au * au;
      const r = Math.max(4, u * 1.5 * b.r);
      const lit = !gone || frontX < x;
      const isEarth = b.name === 'Earth';
      if (lit && isEarth) glow(ctx, x, cy, r * 4, '#7fb2ff', 0.7);
      ctx.fillStyle = '#141820';
      circle(ctx, x, cy, r);
      ctx.fill();
      if (lit) {
        ctx.fillStyle = isEarth ? '#8fc2ff' : '#d9cfbf';
        ctx.beginPath();
        ctx.arc(x, cy, r, Math.PI / 2, (Math.PI * 3) / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = lit ? ink.faint : withAlpha('#ffffff', 0.12);
      ctx.lineWidth = 1;
      circle(ctx, x, cy, r);
      ctx.stroke();

      const showName = !narrow || isEarth;
      if (showName) {
        label(ctx, b.name, x, cy + bandH / 2 + fs * 1.4, {
          align: 'center',
          size: fs * (isEarth ? 1.05 : 0.9),
          color: isEarth ? ink.text : ink.dim,
        });
      }
      label(ctx, arrival(b.au), x, cy - bandH / 2 - fs * 1.4, {
        align: 'center',
        size: fs * 0.8,
        color: lit ? ink.faint : ink.dim,
      });
    }

    // A big clock once the Sun is gone — the delay should feel like waiting.
    if (gone) {
      const earthDark = min >= LIGHT_MIN_PER_AU;
      label(ctx, `T + ${clock(min)}`, narrow ? w / 2 : w * 0.5, h * 0.13, {
        align: 'center',
        size: Math.max(20, u * 3.6),
        font: 'mono',
        color: earthDark ? ink.text : ink.sun,
      });
    }
  },
});

export default factory;
