import type { VizFactory } from './types';
import { circle, easeInOut, fmt, glow, ink, label, span, unit, withAlpha } from './kit';

/** Tidal stretching ∝ M / d³. Computed, not assumed. */
const SUN_TO_MOON_TIDE = 1.989e30 / 1.496e11 ** 3 / (7.342e22 / 3.844e8 ** 3); // ≈ 0.46
const M2_HOURS = 12.42; // lunar semi-diurnal tide
const S2_HOURS = 12; // solar semi-diurnal tide

/** Remaining fraction of the Moon's tidal pull. */
const moonAt = (p: number) => 1 - easeInOut(span(p, 0.05, 0.95));

const factory: VizFactory = ({ accent }) => {
  let earthSpin = 0;
  let moonOrbit = -0.6;

  const seaLevel = (hours: number, m: number) =>
    m * Math.cos((2 * Math.PI * hours) / M2_HOURS) + SUN_TO_MOON_TIDE * Math.cos((2 * Math.PI * hours) / S2_HOURS);

  return {
    ambient: true,
    aspect: { wide: 16 / 9, narrow: 3 / 4 },

    valueText: (p) => `Moon's tidal pull at ${Math.round(moonAt(p) * 100)}%`,

    readouts: (p) => {
      const m = moonAt(p);
      return [
        { label: "Moon's tidal pull", value: `${Math.round(m * 100)}%` },
        { label: "Sun's tidal pull (vs. the Moon's)", value: `${Math.round(SUN_TO_MOON_TIDE * 100)}%`, calculated: true },
        {
          label: 'Biggest tides vs. today',
          value: `${Math.round(((m + SUN_TO_MOON_TIDE) / (1 + SUN_TO_MOON_TIDE)) * 100)}%`,
          calculated: true,
        },
        { label: 'Time between high tides', value: m >= SUN_TO_MOON_TIDE ? '12 h 25 min' : '12 h 00 min' },
      ];
    },

    draw({ ctx, w, h, p, dt }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const fs = Math.max(10, u * 1.3);
      const m = moonAt(p);
      earthSpin += dt * 0.5;
      moonOrbit += dt * 0.07;

      const R = narrow ? Math.min(w * 0.13, h * 0.09) : Math.min(h * 0.12, w * 0.07);
      const cx = narrow ? w * 0.5 : w * 0.27;
      const cy = narrow ? h * 0.3 : h * 0.5;
      const moonDist = R * (narrow ? 3 : 2.7);

      // Sun, far to the left.
      glow(ctx, -w * 0.06, cy, w * 0.18, '#ffc56b', 0.7);
      label(ctx, '← Sun, very far away', u * 3, narrow ? h * 0.05 : h * 0.1, { size: fs * 0.85, color: ink.dim });

      // Moon orbit.
      ctx.strokeStyle = withAlpha('#c9d3e6', 0.1 * m + 0.03);
      ctx.setLineDash([2, 5]);
      ctx.lineWidth = 1;
      circle(ctx, cx, cy, moonDist);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ocean envelope: two bulges toward/away from the Moon, a smaller pair from the Sun.
      const k = R * 0.32;
      const sunDir = Math.PI;
      const envelope = (a: number) =>
        R * 1.08 + k * (m * Math.cos(2 * (a - moonOrbit)) + SUN_TO_MOON_TIDE * Math.cos(2 * (a - sunDir))) * 0.6;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const a = (i / 120) * Math.PI * 2;
        const r = envelope(a);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = withAlpha('#3a8fd6', 0.45);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#8fc2ff', 0.5);
      ctx.stroke();

      // Earth from above the North Pole, spinning.
      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      body.addColorStop(0, '#2f5f8f');
      body.addColorStop(1, '#0f1d2e');
      ctx.fillStyle = body;
      circle(ctx, cx, cy, R);
      ctx.fill();
      ctx.strokeStyle = withAlpha('#ffffff', 0.08);
      for (let i = 0; i < 6; i++) {
        const a = earthSpin + (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.stroke();
      }
      // A coastline riding the spin through the bulges.
      const coastA = earthSpin;
      const coastR = envelope(coastA);
      ctx.fillStyle = accent;
      circle(ctx, cx + Math.cos(coastA) * R, cy + Math.sin(coastA) * R, Math.max(3, u * 0.7));
      ctx.fill();
      ctx.strokeStyle = withAlpha(accent, 0.7);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(coastA) * R, cy + Math.sin(coastA) * R);
      ctx.lineTo(cx + Math.cos(coastA) * coastR, cy + Math.sin(coastA) * coastR);
      ctx.stroke();

      // Moon.
      if (m > 0.01) {
        const mx = cx + Math.cos(moonOrbit) * moonDist;
        const my = cy + Math.sin(moonOrbit) * moonDist;
        const mr = Math.max(5, R * 0.27) * (0.4 + 0.6 * m);
        ctx.fillStyle = withAlpha('#d9dee8', m);
        circle(ctx, mx, my, mr);
        ctx.fill();
        label(ctx, 'Moon', mx, my + mr + fs * 1.1, { align: 'center', size: fs * 0.9, color: withAlpha('#d9dee8', 0.8 * m) });
      } else {
        const mx = cx + Math.cos(moonOrbit) * moonDist;
        const my = cy + Math.sin(moonOrbit) * moonDist;
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = ink.faint;
        circle(ctx, mx, my, Math.max(5, R * 0.27));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Tide chart: sea level at one coastline over 15 days (today = faint reference).
      const gx = narrow ? w * 0.08 : w * 0.56;
      const gw = narrow ? w * 0.84 : w * 0.38;
      const gy = narrow ? h * 0.66 : h * 0.3;
      const gh = narrow ? h * 0.22 : h * 0.4;
      const mid = gy + gh / 2;
      const amp = gh / 2 / (1 + SUN_TO_MOON_TIDE);
      const days = 15;

      label(ctx, 'SEA LEVEL AT ONE COASTLINE · 15 DAYS', gx, gy - fs * 1.6, { size: fs * 0.85, color: ink.faint });
      ctx.strokeStyle = ink.ghost;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, mid);
      ctx.lineTo(gx + gw, mid);
      ctx.stroke();

      const plot = (moon: number, style: string, width: number) => {
        ctx.strokeStyle = style;
        ctx.lineWidth = width;
        ctx.beginPath();
        const n = Math.round(gw * 1.2);
        for (let i = 0; i <= n; i++) {
          const hours = (i / n) * days * 24;
          const x = gx + (i / n) * gw;
          const y = mid - seaLevel(hours, moon) * amp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      if (m < 0.98) plot(1, withAlpha('#ffffff', 0.16), 1);
      plot(m, withAlpha(accent, 0.95), 1.5);

      for (let d = 0; d <= days; d += 5) {
        const x = gx + (d / days) * gw;
        label(ctx, `day ${d}`, x, gy + gh + fs * 1.2, { size: fs * 0.8, color: ink.faint, align: d === 0 ? 'left' : d === days ? 'right' : 'center' });
      }
      label(ctx, 'high', gx - u, gy + fs * 0.2, { size: fs * 0.8, color: ink.faint, align: 'right' });
      label(ctx, 'low', gx - u, gy + gh - fs * 0.2, { size: fs * 0.8, color: ink.faint, align: 'right' });
      if (m > 0.6) {
        label(ctx, 'spring tides', gx + gw * 0.04, gy - fs * 0.3, { size: fs * 0.8, color: ink.dim });
        label(ctx, 'neap tides', gx + gw * 0.5, mid - amp * 0.75 - fs * 0.6, { size: fs * 0.8, color: ink.dim, align: 'center' });
      }
      if (m < 0.98) {
        label(ctx, `— today   — now (${fmt(m * 100)}% Moon)`, gx, gy + gh + fs * 2.8, { size: fs * 0.8, color: ink.dim });
      }
    },
  };
};

export default factory;
