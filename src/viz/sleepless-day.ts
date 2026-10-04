import type { VizFactory } from './types';
import { easeInOut, fmt, ink, label, mix, roundRect, span, unit, withAlpha } from './kit';

const SLEEP_H = 8;
const LIFE_Y = 80;
const SLEEP_COLOR = '#2b2560';
const DAY_COLOR = '#f0d9a8';

/** Fraction of the normal night that has been removed. */
const removedAt = (p: number) => easeInOut(span(p, 0.05, 0.95));

const jobs = [
  { text: 'Memory consolidation', hour: 1 },
  { text: 'Waste clearance', hour: 3 },
  { text: 'Growth hormone release', hour: 5 },
];

/** Clock angle for an hour of the day, midnight at the top. */
const angleOf = (hour: number) => -Math.PI / 2 + (hour / 24) * Math.PI * 2;

const factory: VizFactory = () => ({
  ambient: true,
  aspect: { wide: 16 / 9, narrow: 3 / 4 },

  valueText: (p) => `Sleep takes ${fmt(SLEEP_H * (1 - removedAt(p)), 1)} hours of the day`,

  readouts: (p) => {
    const q = removedAt(p);
    const gainedH = SLEEP_H * q;
    return [
      { label: 'Awake each day', value: `${fmt(24 - SLEEP_H + gainedH, 1)} h`, calculated: true },
      { label: 'Extra waking hours per year', value: fmt(gainedH * 365), calculated: true },
      { label: 'Extra waking years in an 80-year life', value: fmt((LIFE_Y * gainedH) / 24, 1), calculated: true },
    ];
  },

  draw({ ctx, w, h, p, t, reduced }) {
    const u = unit(w, h);
    const narrow = w < 560;
    const q = removedAt(p);
    const sleepH = SLEEP_H * (1 - q);
    const fs = Math.max(10, u * 1.3);

    const R = narrow ? Math.min(w * 0.3, h * 0.2) : Math.min(h * 0.3, w * 0.17);
    const cx = narrow ? w / 2 : w * 0.3;
    const cy = narrow ? h * 0.27 : h * 0.42;
    const ring = Math.max(10, R * 0.22);

    // 24-hour ring: waking hours…
    ctx.lineWidth = ring;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = withAlpha(DAY_COLOR, 0.8);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    // …and the night, shrinking toward 3 am.
    if (sleepH > 0.02) {
      const mid = 3;
      ctx.strokeStyle = SLEEP_COLOR;
      ctx.beginPath();
      ctx.arc(cx, cy, R, angleOf(mid - sleepH / 2), angleOf(mid + sleepH / 2));
      ctx.stroke();
      // Stars in the night segment.
      ctx.fillStyle = withAlpha('#d9d2ff', 0.7);
      for (let i = 0; i < 5; i++) {
        const hr = mid - sleepH / 2 + (sleepH * (i + 0.5)) / 5;
        const a = angleOf(hr);
        const rr = R + ((i % 2) - 0.5) * ring * 0.4;
        ctx.fillRect(cx + Math.cos(a) * rr - 1, cy + Math.sin(a) * rr - 1, 2, 2);
      }
    }

    // Hour ticks.
    ctx.lineWidth = 1;
    for (let hr = 0; hr < 24; hr++) {
      const a = angleOf(hr);
      const major = hr % 6 === 0;
      const r0 = R + ring / 2 + 3;
      const r1 = r0 + (major ? 7 : 3);
      ctx.strokeStyle = major ? ink.dim : ink.faint;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
      if (major) {
        const rl = r1 + fs * 1.1;
        label(ctx, String(hr).padStart(2, '0'), cx + Math.cos(a) * rl, cy + Math.sin(a) * rl, {
          align: 'center',
          size: fs * 0.85,
          color: ink.faint,
        });
      }
    }

    // A clock hand sweeping the day (one day every 12 s) — shows where time goes.
    if (!reduced) {
      const hr = ((t / 12) * 24) % 24;
      const a = angleOf(hr);
      ctx.strokeStyle = withAlpha('#ffffff', 0.85);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (R - ring), cy + Math.sin(a) * (R - ring));
      ctx.lineTo(cx + Math.cos(a) * (R + ring / 2), cy + Math.sin(a) * (R + ring / 2));
      ctx.stroke();
    }

    // Centre: hours awake.
    label(ctx, `${fmt(24 - sleepH, 0)}h`, cx, cy - fs * 0.4, {
      align: 'center',
      size: Math.max(26, R * 0.42),
      font: 'serif',
      color: ink.text,
    });
    label(ctx, 'awake', cx, cy + R * 0.28, { align: 'center', size: fs, color: ink.dim });

    // What sleep does, and what happens to those jobs when the night is gone.
    const homeless = span(q, 0.45, 0.85);
    jobs.forEach((job, i) => {
      const a = angleOf(job.hour);
      const ax = cx + Math.cos(a) * (R + ring / 2);
      const ay = cy + Math.sin(a) * (R + ring / 2);
      const tx = narrow ? w * 0.12 : cx + R + ring + u * 9;
      const ty = narrow ? cy + R + ring + fs * 3.4 + i * fs * 2 : cy - R * 0.7 + i * fs * 2.4;
      const color = mix('#d9d2ff', ink.warn, homeless);

      if (!narrow) {
        ctx.strokeStyle = withAlpha(color, 0.35);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(tx - u, ty);
        ctx.stroke();
      }
      const marker = homeless > 0.5 ? '✕' : '●';
      label(ctx, marker, tx, ty, { size: fs * 0.9, color });
      label(ctx, job.text, tx + fs * 1.4, ty, { size: fs, color: homeless > 0.5 ? ink.text : ink.dim });
      if (homeless > 0.5) {
        ctx.font = `500 ${fs}px "Schibsted Grotesk Variable", sans-serif`;
        const tw = ctx.measureText(job.text).width;
        label(ctx, 'no time slot', tx + fs * 1.4 + tw + u, ty, {
          size: fs * 0.8,
          color: withAlpha(ink.warn, homeless),
        });
      }
    });

    // Lifetime bar: 80 years, a third of it asleep → all awake.
    const bx = narrow ? w * 0.08 : w * 0.12;
    const bw = narrow ? w * 0.84 : w * 0.76;
    const by = narrow ? h * 0.82 : h * 0.84;
    const bh = Math.max(14, u * 2.4);
    const sleepYears = (LIFE_Y * sleepH) / 24;
    const awakeW = bw * (1 - sleepYears / LIFE_Y);

    label(ctx, 'AN 80-YEAR LIFE', bx, by - bh, { size: fs * 0.85, color: ink.faint });
    roundRect(ctx, bx, by, bw, bh, 3);
    ctx.fillStyle = SLEEP_COLOR;
    ctx.fill();
    roundRect(ctx, bx, by, awakeW, bh, 3);
    ctx.fillStyle = withAlpha(DAY_COLOR, 0.85);
    ctx.fill();
    // Decade ticks.
    ctx.strokeStyle = withAlpha('#000000', 0.35);
    for (let d = 1; d < 8; d++) {
      const x = bx + (bw * d) / 8;
      ctx.beginPath();
      ctx.moveTo(x, by);
      ctx.lineTo(x, by + bh);
      ctx.stroke();
    }
    label(ctx, `${fmt(LIFE_Y - sleepYears, 1)} years awake`, bx, by + bh + fs * 1.3, { size: fs, color: ink.text });
    if (sleepYears > 0.5) {
      label(ctx, `${fmt(sleepYears, 1)} years asleep`, bx + bw, by + bh + fs * 1.3, {
        size: fs,
        color: '#b9b0f0',
        align: 'right',
      });
    }
  },
});

export default factory;
