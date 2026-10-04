import type { VizFactory } from './types';
import { arrowHead, circle, easeInOut, fmt, glow, ink, label, mix, rng, smooth, span, unit, withAlpha } from './kit';

const EQUATOR_KMH = 1670; // 40,075 km ÷ 23.93 h
const SIDEREAL_H = 23.93;
const YEAR_H = 8766;

/** Fraction of normal rotation remaining. */
const spinAt = (p: number) => 1 - easeInOut(span(p, 0.04, 0.34));
/** Air keeps its eastward motion after the ground stops, then friction bleeds it off. */
const airAt = (p: number) => (p < 0.34 ? 1 : 1 - smooth(span(p, 0.34, 0.6)));
/** 0 = oceans bulge at the equator, 1 = oceans pooled at the poles. */
const oceanShiftAt = (p: number) => smooth(span(p, 0.6, 0.93));

function dayLength(spin: number): string {
  if (spin < 0.004) return '≈ 1 year';
  const solarH = 1 / (spin / SIDEREAL_H - 1 / YEAR_H);
  if (solarH < 48) return `${fmt(solarH, 1)} hours`;
  return `${fmt(solarH / 24)} days`;
}

const factory: VizFactory = ({ accent }) => {
  const rand = rng(11);
  const streaks = Array.from({ length: 70 }, () => ({
    lat: (rand() * 2 - 1) * 1.25,
    lon: rand() * Math.PI * 2,
    len: 0.12 + rand() * 0.18,
  }));
  let groundAngle = 0;
  let airAngle = 0;

  return {
    ambient: true,
    aspect: { wide: 16 / 9, narrow: 4 / 5 },

    valueText: (p) => {
      const s = spinAt(p);
      if (p < 0.34) return `Rotation at ${Math.round(s * 100)}% of normal`;
      if (p < 0.6) return 'Ground stopped; atmosphere still moving east';
      return `Oceans ${Math.round(oceanShiftAt(p) * 100)}% of the way to the poles`;
    },

    readouts: (p) => {
      const s = spinAt(p);
      const wind = Math.max(0, airAt(p) - s);
      const o = oceanShiftAt(p);
      return [
        { label: 'Ground speed at the equator', value: `${fmt(EQUATOR_KMH * s)} km/h`, calculated: true },
        { label: 'Wind relative to the ground', value: `${fmt(EQUATOR_KMH * wind)} km/h`, calculated: true },
        { label: 'Length of one day', value: dayLength(s), calculated: true },
        {
          label: 'Oceans',
          value: o === 0 ? 'Bulging at the equator' : o < 1 ? 'Draining toward the poles' : 'Pooled at the poles',
        },
      ];
    },

    draw({ ctx, w, h, p, dt }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const R = Math.min(w * (narrow ? 0.3 : 0.22), h * (narrow ? 0.26 : 0.32));
      const cx = narrow ? w / 2 : w * 0.42;
      const cy = h * (narrow ? 0.4 : 0.52);
      const s = spinAt(p);
      const air = airAt(p);
      const o = oceanShiftAt(p);
      const omega = 0.45;
      groundAngle += dt * omega * s;
      airAngle += dt * omega * air;

      // Atmosphere halo.
      glow(ctx, cx, cy, R * 1.35, '#7fb2ff', 0.35);

      // Exaggerated ocean shell around the limb: thick at the equator before, at the poles after.
      const base = R * 0.09;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const th = (i / 120) * Math.PI * 2;
        const lat = Math.asin(Math.sin(th)); // limb angle ≈ latitude
        const c2 = Math.cos(lat) ** 2;
        const s2 = 1 - c2;
        const thick = base * ((1 - o) * (0.35 + 1.0 * c2) + o * (0.05 * c2 + 1.7 * s2 ** 1.5));
        const r = R + thick;
        const x = cx + Math.cos(th) * r;
        const y = cy - Math.sin(th) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = withAlpha('#3a8fd6', 0.5);
      ctx.fill();

      // Globe body. As water leaves the equator, an equatorial land belt is exposed.
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
      body.addColorStop(0, '#24496f');
      body.addColorStop(1, '#0c1726');
      ctx.fillStyle = body;
      circle(ctx, cx, cy, R);
      ctx.fill();

      ctx.save();
      circle(ctx, cx, cy, R);
      ctx.clip();
      if (o > 0) {
        const band = R * Math.sin(0.62) * o;
        const g = ctx.createLinearGradient(0, cy - band, 0, cy + band);
        const land = withAlpha('#8a7a55', 0.55 * o);
        g.addColorStop(0, withAlpha('#8a7a55', 0));
        g.addColorStop(0.18, land);
        g.addColorStop(0.82, land);
        g.addColorStop(1, withAlpha('#8a7a55', 0));
        ctx.fillStyle = g;
        ctx.fillRect(cx - R, cy - band, R * 2, band * 2);
      }

      // Latitude lines.
      ctx.lineWidth = 1;
      for (const latDeg of [-60, -30, 0, 30, 60]) {
        const lat = (latDeg * Math.PI) / 180;
        const y = cy - R * Math.sin(lat);
        const hw = R * Math.cos(lat);
        ctx.strokeStyle = latDeg === 0 ? withAlpha(accent, 0.45) : ink.ghost;
        ctx.beginPath();
        ctx.moveTo(cx - hw, y);
        ctx.lineTo(cx + hw, y);
        ctx.stroke();
      }

      // Meridians — these carry the visible spin.
      for (let k = 0; k < 12; k++) {
        const lon = (k / 12) * Math.PI * 2 + groundAngle;
        const front = Math.cos(lon);
        if (front <= 0) continue;
        ctx.strokeStyle = withAlpha('#c9dcff', 0.08 + 0.22 * front);
        ctx.beginPath();
        for (let j = 0; j <= 24; j++) {
          const lat = -Math.PI / 2 + (j / 24) * Math.PI;
          const x = cx + R * Math.cos(lat) * Math.sin(lon);
          const y = cy - R * Math.sin(lat);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Air streaks: ride with the ground until the ground stops, then race past it.
      const wind = Math.max(0, air - s);
      const streakColor = mix('#cfe2ff', ink.warn, Math.min(1, wind * 1.6));
      ctx.lineCap = 'round';
      for (const st of streaks) {
        const lon = st.lon + airAngle;
        if (Math.cos(lon) <= 0.05) continue;
        const len = st.len * (0.5 + wind * 1.6);
        ctx.strokeStyle = withAlpha(streakColor, (0.22 + 0.6 * wind) * Math.cos(lon) * Math.max(0.3, air));
        ctx.lineWidth = Math.max(1, u * 0.22);
        ctx.beginPath();
        for (let j = 0; j <= 6; j++) {
          const l = lon - len + (len * j) / 6;
          const x = cx + R * Math.cos(st.lat) * Math.sin(l);
          const y = cy - R * Math.sin(st.lat);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // A fixed point on the surface, so the stop is unmistakable.
      const homeLon = groundAngle + 0.6;
      const home = Math.cos(homeLon) > 0
        ? { x: cx + R * Math.cos(0.7) * Math.sin(homeLon), y: cy - R * Math.sin(0.7) }
        : null;
      ctx.restore();
      if (home) {
        ctx.fillStyle = accent;
        circle(ctx, home.x, home.y, Math.max(2.5, u * 0.7));
        ctx.fill();
        label(ctx, 'you', home.x + u * 1.4, home.y, { size: Math.max(10, u * 1.4), color: ink.text });
      }

      // Rim light.
      ctx.strokeStyle = withAlpha('#9cc4ff', 0.35);
      ctx.lineWidth = 1.2;
      circle(ctx, cx, cy, R);
      ctx.stroke();

      // Velocity arrows at the equator: the core idea, readable even without motion.
      // Wide: to the right of the globe. Narrow: underneath it.
      const ax = narrow ? w * 0.18 : cx + R + R * 0.28;
      const maxLen = narrow ? w * 0.6 : Math.min(w - ax - u * 4, R * 0.95);
      const fs = Math.max(10, u * 1.35);
      const arrowY = narrow ? cy + R * 1.42 : cy;
      const rows = [
        { name: 'ground', v: s, color: '#cfe2ff', y: arrowY - fs * 1.2 },
        { name: 'air', v: air, color: wind > 0.05 ? ink.warn : '#cfe2ff', y: arrowY + fs * 1.6 },
      ];
      for (const r of rows) {
        const len = Math.max(0, maxLen * 0.8 * r.v);
        ctx.strokeStyle = r.color;
        ctx.fillStyle = r.color;
        ctx.lineWidth = 2;
        if (len > 4) {
          ctx.beginPath();
          ctx.moveTo(ax, r.y);
          ctx.lineTo(ax + len, r.y);
          ctx.stroke();
          arrowHead(ctx, ax + len + 2, r.y, 0, 8);
        } else {
          circle(ctx, ax + 2, r.y, 2.5);
          ctx.fill();
        }
        label(ctx, r.name, ax, r.y - fs * 0.9, { size: fs * 0.85, color: ink.dim });
      }

      if (o > 0.05) {
        label(ctx, 'polar ocean', cx, cy - R - base * 1.9 - fs, {
          align: 'center',
          size: fs * 0.9,
          color: withAlpha('#9cc4ff', o),
        });
        label(ctx, 'equatorial land', cx, cy, { align: 'center', size: fs * 0.9, color: withAlpha('#e4d6b0', o) });
      }
    },
  };
};

export default factory;
