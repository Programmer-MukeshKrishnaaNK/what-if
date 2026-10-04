import type { VizFactory } from './types';
import { circle, fmt, glow, ink, label, lerp, rng, unit, withAlpha } from './kit';

const GM = 4 * Math.PI ** 2; // Sun's gravity in AU³/yr²
const KICK = 1.5; // speed multiplier — escape needs > √2 ≈ 1.414
const MAX_YEARS = 40;
const SAMPLE_DT = 0.01;
const AU_PER_YR_TO_KMS = 4.74;

/** Years since ejection for scrubber position p (quadratic, so the departure gets screen time). */
const yearsAt = (p: number) => MAX_YEARS * p * p;

interface Sample {
  x: number;
  y: number;
  v: number;
}

/** Integrate the escape trajectory once (leapfrog), starting at 1 AU with a prograde kick. */
function integrate(): Sample[] {
  const dt = 0.0005;
  const every = Math.round(SAMPLE_DT / dt);
  let x = 1;
  let y = 0;
  let vx = 0;
  let vy = 2 * Math.PI * KICK;
  const out: Sample[] = [];
  const steps = Math.round(MAX_YEARS / dt);
  for (let i = 0; i <= steps; i++) {
    if (i % every === 0) out.push({ x, y, v: Math.hypot(vx, vy) });
    let r3 = Math.hypot(x, y) ** 3;
    vx -= ((GM * x) / r3) * (dt / 2);
    vy -= ((GM * y) / r3) * (dt / 2);
    x += vx * dt;
    y += vy * dt;
    r3 = Math.hypot(x, y) ** 3;
    vx -= ((GM * x) / r3) * (dt / 2);
    vy -= ((GM * y) / r3) * (dt / 2);
  }
  return out;
}

const orbits = [
  { name: 'Mars', au: 1.52 },
  { name: 'Jupiter', au: 5.2 },
  { name: 'Saturn', au: 9.54 },
  { name: 'Uranus', au: 19.2 },
  { name: 'Neptune', au: 30.1 },
  { name: 'Heliopause', au: 120 },
];

const factory: VizFactory = () => {
  const path = integrate();
  const sampleAt = (p: number) => {
    const i = Math.min(path.length - 1, yearsAt(p) / SAMPLE_DT);
    const a = path[Math.floor(i)];
    const b = path[Math.min(path.length - 1, Math.floor(i) + 1)];
    const f = i - Math.floor(i);
    return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), v: lerp(a.v, b.v, f) };
  };
  const distanceAt = (p: number) => {
    const s = sampleAt(p);
    return Math.hypot(s.x, s.y);
  };

  const rand = rng(77);
  const stars = Array.from({ length: 140 }, () => ({ x: rand(), y: rand(), b: 0.3 + rand() * 0.7 }));
  let orbitAngle = 0;
  let capturedAngle = 0;
  let wasIdle = true;
  let view = 1.6;

  return {
    ambient: true,
    aspect: { wide: 16 / 9, narrow: 4 / 5 },

    valueText: (p) => `${fmt(yearsAt(p), 1)} years after ejection, ${fmt(distanceAt(p), 1)} AU from the Sun`,

    readouts: (p) => {
      const d = p === 0 ? 1 : distanceAt(p);
      const v = p === 0 ? 2 * Math.PI : sampleAt(p).v;
      const tempK = 255 / Math.sqrt(d);
      return [
        { label: 'Years since ejection', value: p === 0 ? '—' : fmt(yearsAt(p), 1) },
        { label: 'Distance from the Sun', value: `${fmt(d, d < 10 ? 2 : 0)} AU`, calculated: true },
        { label: 'Speed', value: `${fmt(v * AU_PER_YR_TO_KMS, 1)} km/s`, calculated: true },
        { label: 'Sunlight vs. today (1 ÷ distance²)', value: `${fmt(100 / (d * d), d < 3 ? 0 : d < 30 ? 2 : 3)}%`, calculated: true },
        {
          label: 'Temperature from sunlight alone',
          value: `${fmt(tempK - 273.15)} °C`,
          calculated: true,
        },
      ];
    },

    draw({ ctx, w, h, p, dt }) {
      const u = unit(w, h);
      const fs = Math.max(10, u * 1.3);
      const narrow = w < 560;

      if (p === 0) {
        orbitAngle += dt * 0.5;
        wasIdle = true;
      } else if (wasIdle) {
        capturedAngle = orbitAngle;
        wasIdle = false;
      }
      const rot = p === 0 ? orbitAngle : capturedAngle;
      const s = p === 0 ? { x: 1, y: 0 } : sampleAt(p);
      const ex = s.x * Math.cos(rot) - s.y * Math.sin(rot);
      const ey = s.x * Math.sin(rot) + s.y * Math.cos(rot);
      const d = Math.hypot(ex, ey);
      const sunlight = 1 / (d * d);

      // Camera: keep the Sun centred and widen the view as Earth recedes.
      const target = Math.max(1.6, d * 1.25);
      view = dt > 0 ? lerp(view, target, Math.min(1, dt * 4)) : target;
      const scale = (Math.min(w, h) * (narrow ? 0.46 : 0.44)) / view;
      const cx = w / 2;
      const cy = h / 2;

      // Interstellar starfield emerges as the Sun's glare fades.
      const starA = Math.min(1, Math.max(0, 1 - Math.pow(sunlight, 0.25)));
      for (const st of stars) {
        ctx.fillStyle = withAlpha('#dfe6ff', st.b * starA * 0.8);
        ctx.fillRect(st.x * w, st.y * h, 1.3, 1.3);
      }

      // Orbits for scale.
      ctx.lineWidth = 1;
      const all = [{ name: 'Earth’s orbit', au: 1 }, ...orbits];
      all.forEach((o, i) => {
        const r = o.au * scale;
        if (r < 14 || r > Math.max(w, h) * 1.2) return;
        const fade = Math.min(1, (r - 14) / 40);
        ctx.strokeStyle = withAlpha('#9fb0ff', (o.au === 1 ? 0.28 : 0.13) * fade);
        if (o.name === 'Heliopause') ctx.setLineDash([5, 6]);
        circle(ctx, cx, cy, r);
        ctx.stroke();
        ctx.setLineDash([]);
        // Stagger label angles so neighbouring orbits don't collide.
        const a = -Math.PI / 4 + (i % 2 ? 0.35 : 0);
        label(ctx, o.name, cx + r * Math.cos(a) + 4, cy + r * Math.sin(a) - 4, { size: fs * 0.8, color: withAlpha('#c9d2ff', 0.55 * fade) });
      });

      // The Sun shrinks to a point of light as the view widens.
      const sunR = Math.max(2.5, Math.min(u * 3, scale * 0.12));
      glow(ctx, cx, cy, sunR * 5, '#ffc56b', 0.9);
      ctx.fillStyle = '#ffe2a8';
      circle(ctx, cx, cy, sunR);
      ctx.fill();

      // Path travelled.
      if (p > 0) {
        const n = Math.min(path.length - 1, Math.floor(yearsAt(p) / SAMPLE_DT));
        ctx.strokeStyle = withAlpha('#8fa3ff', 0.55);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const stride = Math.max(1, Math.floor(n / 600));
        for (let i = 0; i <= n; i += stride) {
          const px = path[i].x * Math.cos(rot) - path[i].y * Math.sin(rot);
          const py = path[i].x * Math.sin(rot) + path[i].y * Math.cos(rot);
          if (i === 0) ctx.moveTo(cx + px * scale, cy - py * scale);
          else ctx.lineTo(cx + px * scale, cy - py * scale);
        }
        ctx.lineTo(cx + ex * scale, cy - ey * scale);
        ctx.stroke();
      }

      // Earth: its sunlit side dims with distance.
      const x = cx + ex * scale;
      const y = cy - ey * scale;
      const er = Math.max(4, u * 1.2);
      const lit = Math.pow(sunlight, 0.25);
      glow(ctx, x, y, er * 3.5, '#7fb2ff', 0.25 + 0.6 * lit);
      ctx.fillStyle = '#0d1522';
      circle(ctx, x, y, er);
      ctx.fill();
      const toSun = Math.atan2(cy - y, cx - x);
      ctx.fillStyle = withAlpha('#8fc2ff', 0.25 + 0.75 * lit);
      ctx.beginPath();
      ctx.arc(x, y, er, toSun - Math.PI / 2, toSun + Math.PI / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = withAlpha('#cfe0ff', 0.35);
      circle(ctx, x, y, er);
      ctx.stroke();
      label(ctx, 'Earth', x, y + er + fs * 1.2, { align: 'center', size: fs, color: ink.text });

      // Scale bar.
      const barAU = [0.5, 1, 2, 5, 10, 20, 50, 100].find((a) => a * scale > w * 0.12) ?? 100;
      const bx = u * 3;
      const by = h - u * 4;
      ctx.strokeStyle = ink.dim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + barAU * scale, by);
      ctx.moveTo(bx, by - 4);
      ctx.lineTo(bx, by + 4);
      ctx.moveTo(bx + barAU * scale, by - 4);
      ctx.lineTo(bx + barAU * scale, by + 4);
      ctx.stroke();
      label(ctx, `${barAU} AU`, bx, by - fs, { size: fs * 0.85, color: ink.dim });
    },
  };
};

export default factory;
