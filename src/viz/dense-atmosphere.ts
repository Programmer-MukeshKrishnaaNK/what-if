import type { VizFactory } from './types';
import { arrowHead, circle, easeInOut, fmt, ink, label, lerp, rng, roundRect, span, unit, withAlpha } from './kit';

const RHO0 = 1.2; // kg/m³ at sea level
const SKYDIVER = 55; // m/s, belly-down terminal speed today
const SOUND = 343; // m/s at 20 °C

/** Density relative to today: 1 → 2. */
const densityAt = (p: number) => 1 + easeInOut(span(p, 0.05, 0.95));

const factory: VizFactory = ({ accent }) => {
  const rand = rng(21);
  const molecules = Array.from({ length: 120 }, () => ({ x: rand(), y: rand(), a: rand() * Math.PI * 2, s: 0.5 + rand() }));
  let fallToday = 0;
  let fallNow = 0;

  return {
    ambient: true,
    aspect: { wide: 16 / 9, narrow: 4 / 5 },

    valueText: (p) => `Air density ${fmt(densityAt(p), 2)} times today's`,

    readouts: (p) => {
      const d = densityAt(p);
      return [
        { label: 'Air density', value: `${fmt(RHO0 * d, 2)} kg/m³` },
        { label: 'Sea-level pressure', value: `${fmt(d, 2)} atm`, calculated: true },
        { label: 'Skydiver top speed', value: `${fmt(SKYDIVER / Math.sqrt(d))} m/s`, calculated: true },
        { label: 'Wing lift at the same speed', value: `${fmt(d, 2)}×`, calculated: true },
        { label: 'Speed of sound', value: `${SOUND} m/s`, calculated: true },
      ];
    },

    draw({ ctx, w, h, p, t, dt, reduced }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const fs = Math.max(10, u * (narrow ? 1.5 : 1.2));
      const d = densityAt(p);
      const vNow = 1 / Math.sqrt(d);

      // Four panels: 4×1 on wide screens, 2×2 on narrow ones.
      const cols = narrow ? 2 : 4;
      const rows = narrow ? 2 : 1;
      const pad = u * 1.6;
      const pw = (w - pad * (cols + 1)) / cols;
      const ph = (h - pad * (rows + 1)) / rows;
      const panel = (i: number) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return { x: pad + c * (pw + pad), y: pad + r * (ph + pad), w: pw, h: ph };
      };
      const frame = (b: { x: number; y: number; w: number; h: number }, title: string) => {
        ctx.strokeStyle = ink.ghost;
        ctx.lineWidth = 1;
        roundRect(ctx, b.x, b.y, b.w, b.h, 8);
        ctx.stroke();
        label(ctx, title, b.x + fs, b.y + fs * 1.4, { size: fs * 0.85, color: ink.dim });
      };

      // 1 — Molecules in a box.
      const A = panel(0);
      frame(A, 'AIR · 1 LITRE');
      const n = Math.round(molecules.length * (d / 2));
      const inner = { x: A.x + fs, y: A.y + fs * 2.6, w: A.w - fs * 2, h: A.h - fs * 3.8 };
      ctx.fillStyle = withAlpha(accent, 0.85);
      for (let i = 0; i < n; i++) {
        const m = molecules[i];
        const jx = reduced ? 0 : Math.cos(t * 2 * m.s + m.a) * 3;
        const jy = reduced ? 0 : Math.sin(t * 1.7 * m.s + m.a) * 3;
        circle(ctx, inner.x + m.x * inner.w + jx, inner.y + m.y * inner.h + jy, Math.max(1.5, u * 0.35));
        ctx.fill();
      }
      label(ctx, `${fmt(d, 2)}× molecules`, A.x + A.w / 2, A.y + A.h - fs, { align: 'center', size: fs * 0.9, color: ink.text });

      // 2 — Pressure gauge, 0–3 atm.
      const B = panel(1);
      frame(B, 'PRESSURE');
      const gx = B.x + B.w / 2;
      const gy = B.y + B.h * 0.6;
      const gr = Math.min(B.w * 0.36, B.h * 0.32);
      const a0 = Math.PI * 0.8;
      const a1 = Math.PI * 2.2;
      const angle = (atm: number) => lerp(a0, a1, atm / 3);
      ctx.lineWidth = Math.max(4, gr * 0.1);
      ctx.strokeStyle = withAlpha('#ffffff', 0.08);
      ctx.beginPath();
      ctx.arc(gx, gy, gr, a0, a1);
      ctx.stroke();
      ctx.strokeStyle = withAlpha(accent, 0.8);
      ctx.beginPath();
      ctx.arc(gx, gy, gr, a0, angle(d));
      ctx.stroke();
      for (let atm = 0; atm <= 3; atm++) {
        const a = angle(atm);
        label(ctx, String(atm), gx + Math.cos(a) * (gr + fs * 1.2), gy + Math.sin(a) * (gr + fs * 1.2), {
          align: 'center',
          size: fs * 0.8,
          color: ink.faint,
        });
      }
      ctx.strokeStyle = ink.text;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + Math.cos(angle(d)) * gr * 0.8, gy + Math.sin(angle(d)) * gr * 0.8);
      ctx.stroke();
      label(ctx, `${fmt(d, 2)} atm`, gx, gy + gr * 0.55, { align: 'center', size: fs * 1.1, color: ink.text });
      label(ctx, '≈ 10 m underwater at 2 atm', gx, B.y + B.h - fs, { align: 'center', size: fs * 0.75, color: ink.faint });

      // 3 — Falling: today's air (faint) vs. thicker air.
      const C = panel(2);
      frame(C, 'FALLING AT TOP SPEED');
      label(ctx, 'bar = distance fallen in 1 s', C.x + fs, C.y + fs * 2.7, { size: fs * 0.7, color: ink.faint });
      const laneTop = C.y + fs * 4;
      const laneH = C.h - fs * 7;
      const lanes = [
        { x: C.x + C.w * 0.32, v: 1, name: 'today', alpha: 0.3 },
        { x: C.x + C.w * 0.68, v: vNow, name: 'now', alpha: 1 },
      ];
      if (dt > 0) {
        fallToday = (fallToday + dt * 0.35) % 1;
        fallNow = (fallNow + dt * 0.35 * vNow) % 1;
      }
      lanes.forEach((ln, i) => {
        ctx.strokeStyle = withAlpha('#ffffff', 0.06);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ln.x, laneTop);
        ctx.lineTo(ln.x, laneTop + laneH);
        ctx.stroke();
        // How far it falls in one (scaled) second — readable without motion.
        const ruler = laneH * 0.42 * ln.v;
        ctx.fillStyle = withAlpha(accent, 0.18 * ln.alpha + 0.05);
        roundRect(ctx, ln.x + 8, laneTop, 5, ruler, 2);
        ctx.fill();
        const f = reduced ? 0.4 : i === 0 ? fallToday : fallNow;
        const y = laneTop + f * laneH;
        ctx.fillStyle = withAlpha('#f3efe4', ln.alpha);
        circle(ctx, ln.x, y, Math.max(4, u * 0.9));
        ctx.fill();
        // Drag arrow pointing up.
        ctx.strokeStyle = withAlpha(ink.warn, ln.alpha);
        ctx.fillStyle = withAlpha(ink.warn, ln.alpha);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ln.x, y - u * 1.4);
        ctx.lineTo(ln.x, y - u * 4);
        ctx.stroke();
        arrowHead(ctx, ln.x, y - u * 4.4, -Math.PI / 2, 6);
        label(ctx, ln.name, ln.x, C.y + C.h - fs * 1.8, { align: 'center', size: fs * 0.85, color: withAlpha('#f3efe4', 0.4 + 0.5 * ln.alpha) });
        label(ctx, `${fmt(SKYDIVER * ln.v)} m/s`, ln.x, C.y + C.h - fs * 0.7, { align: 'center', size: fs * 0.8, color: ink.dim });
      });

      // 4 — Sound: same spacing and speed, stronger waves.
      const D = panel(3);
      frame(D, 'SOUND');
      const sx = D.x + D.w * 0.18;
      const sy = D.y + D.h * 0.55;
      ctx.fillStyle = ink.dim;
      roundRect(ctx, sx - u * 1.6, sy - u * 2, u * 1.6, u * 4, 2);
      ctx.fill();
      const spacing = D.w * 0.13;
      const phase = reduced ? 0 : (t * spacing * 0.8) % spacing;
      ctx.save();
      roundRect(ctx, D.x, D.y, D.w, D.h, 8);
      ctx.clip();
      for (let k = 0; k < 8; k++) {
        const r = phase + k * spacing + u;
        const fade = 1 - r / (D.w * 0.85);
        if (fade <= 0) continue;
        ctx.strokeStyle = withAlpha(accent, fade * (0.25 + 0.3 * (d - 1)));
        ctx.lineWidth = 1 + (d - 1) * 1.6;
        ctx.beginPath();
        ctx.arc(sx, sy, r, -0.7, 0.7);
        ctx.stroke();
      }
      ctx.restore();
      label(ctx, `${SOUND} m/s`, D.x + D.w / 2, D.y + D.h - fs * 1.9, { align: 'center', size: fs * 1.05, color: ink.text });
      label(ctx, 'same speed, same spacing', D.x + D.w / 2, D.y + D.h - fs * 0.7, { align: 'center', size: fs * 0.75, color: ink.faint });
    },
  };
};

export default factory;
