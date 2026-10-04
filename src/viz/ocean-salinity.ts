import type { VizFactory } from './types';
import { arrowHead, circle, easeInOut, fmt, ink, label, lerp, mix, rng, roundRect, span, unit, withAlpha } from './kit';

const SEAWATER = 35; // g of salt per kg
/** A marine bony fish's body fluids are roughly a third as salty as seawater. */
const FISH_INTERNAL = 12;

const salinityAt = (p: number) => SEAWATER * (1 - easeInOut(span(p, 0.05, 0.95)));

/** Approximate, simplified tolerance ranges (g/kg). Illustrative, not species data. */
const groups = [
  { name: 'Reef corals', lo: 30, hi: 40 },
  { name: 'Open-ocean fish', lo: 28, hi: 40 },
  { name: 'Estuary animals', lo: 5, hi: 35 },
  { name: 'Salmon, bull sharks', lo: 0, hi: 40 },
  { name: 'Freshwater fish', lo: 0, hi: 8 },
];

type Health = 'ok' | 'stressed' | 'failing';
function health(S: number, g: { lo: number; hi: number }): Health {
  if (S >= g.lo && S <= g.hi) return 'ok';
  const off = S < g.lo ? g.lo - S : S - g.hi;
  return off <= 6 ? 'stressed' : 'failing';
}
const healthMark: Record<Health, string> = { ok: '✓', stressed: '!', failing: '✕' };
const healthWord: Record<Health, string> = { ok: 'at home', stressed: 'stressed', failing: "can't cope" };

function flow(S: number): string {
  if (Math.abs(S - FISH_INTERNAL) < 1.5) return 'Roughly balanced';
  return S > FISH_INTERNAL ? 'Leaking out' : 'Flooding in';
}

const factory: VizFactory = ({ accent }) => {
  const rand = rng(9);
  const salt = Array.from({ length: 240 }, () => ({ x: rand(), y: rand(), k: rand(), drift: rand() * 2 - 1 }));
  const fish = Array.from({ length: 7 }, (_, i) => ({
    y: 0.2 + rand() * 0.45,
    speed: 0.03 + rand() * 0.03,
    off: rand(),
    group: i < 5 ? 1 : 3, // open-ocean fish vs. salt-flexible migrants
  }));
  const freshFish = Array.from({ length: 3 }, () => ({ y: 0.15 + rand() * 0.35, speed: 0.035 + rand() * 0.02, off: rand() }));
  const corals = Array.from({ length: 9 }, () => ({ x: rand(), h: 0.5 + rand() * 0.5, b: Math.floor(rand() * 3) + 2 }));

  function drawFish(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, tilt: number, long: boolean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * (long ? 1.5 : 1), size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    const tx = -size * (long ? 1.5 : 1);
    ctx.beginPath();
    ctx.moveTo(tx + 1, 0);
    ctx.lineTo(tx - size * 0.6, -size * 0.4);
    ctx.lineTo(tx - size * 0.6, size * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  return {
    ambient: true,
    aspect: { wide: 16 / 9, narrow: 3 / 5 },

    valueText: (p) => `Salinity ${fmt(salinityAt(p), 1)} grams of salt per kilogram of water`,

    readouts: (p) => {
      const S = salinityAt(p);
      const home = groups.filter((g) => health(S, g) === 'ok').length;
      return [
        { label: 'Salinity', value: `${fmt(S, 1)} g/kg` },
        { label: 'Freezing point', value: `${fmt(-0.054 * S, 1)} °C`, calculated: true },
        { label: 'Water in a marine fish', value: flow(S) },
        { label: 'Groups within tolerance', value: `${home} of ${groups.length}` },
      ];
    },

    draw({ ctx, w, h, p, t }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const fs = Math.max(10, u * (narrow ? 1.6 : 1.25));
      const S = salinityAt(p);
      const saltFrac = S / SEAWATER;

      // ── Ocean cross-section ──
      const ox = 0;
      const oy = 0;
      const ow = narrow ? w : w * 0.56;
      const oh = narrow ? h * 0.42 : h;
      const water = ctx.createLinearGradient(0, oy, 0, oy + oh);
      water.addColorStop(0, mix('#1d5f8a', '#1f6b78', 1 - saltFrac));
      water.addColorStop(1, '#06121c');
      ctx.fillStyle = water;
      ctx.fillRect(ox, oy, ow, oh);

      // Dissolved salt: one dot per unit of concentration.
      const visible = Math.round(salt.length * saltFrac);
      ctx.fillStyle = withAlpha('#f3efe4', 0.55);
      for (let i = 0; i < visible; i++) {
        const s = salt[i];
        const x = ox + (((s.x + t * 0.006 * s.drift) % 1) + 1) % 1 * ow;
        const y = oy + s.y * oh * 0.86;
        ctx.fillRect(x, y, 1.6, 1.6);
      }

      // Reef on the seabed: bleaches as conditions leave its range.
      const coralHealth = health(S, groups[0]);
      const coralColor = coralHealth === 'ok' ? '#ff9a7a' : coralHealth === 'stressed' ? '#e8c2b0' : '#d8d4cc';
      const floor = oy + oh * 0.9;
      ctx.fillStyle = '#0b1a24';
      ctx.fillRect(ox, floor, ow, oh - (floor - oy));
      ctx.strokeStyle = coralColor;
      ctx.lineCap = 'round';
      for (const c of corals) {
        const cx = ox + c.x * ow;
        const ch = oh * 0.12 * c.h;
        ctx.lineWidth = Math.max(1.5, u * 0.35);
        for (let b = 0; b < c.b; b++) {
          const a = -Math.PI / 2 + (b - (c.b - 1) / 2) * 0.35;
          ctx.beginPath();
          ctx.moveTo(cx, floor);
          ctx.quadraticCurveTo(cx + Math.cos(a) * ch * 0.3, floor - ch * 0.5, cx + Math.cos(a) * ch * 0.6, floor + Math.sin(a) * ch);
          ctx.stroke();
        }
      }

      // Marine fish: slow, sink and fade as they fall outside their tolerance.
      for (const f of fish) {
        const g = groups[f.group];
        const st = health(S, g);
        const speed = st === 'ok' ? 1 : st === 'stressed' ? 0.45 : 0.12;
        const x = ox + ((f.off + t * f.speed * speed) % 1.2 - 0.1) * ow;
        const sink = st === 'failing' ? 0.18 : st === 'stressed' ? 0.06 : 0;
        const y = oy + (f.y + sink) * oh;
        const alpha = st === 'ok' ? 0.9 : st === 'stressed' ? 0.6 : 0.25;
        const color = f.group === 3 ? withAlpha('#ffd29a', alpha) : withAlpha('#cfe6ff', alpha);
        drawFish(ctx, x, y, Math.max(5, u * 1.3), color, st === 'failing' ? 0.5 : st === 'stressed' ? 0.2 : 0, f.group === 3);
      }
      // Freshwater fish move in once the water is fresh enough for them.
      const freshOk = health(S, groups[4]);
      if (freshOk !== 'failing') {
        const a = freshOk === 'ok' ? 0.9 : 0.4;
        for (const f of freshFish) {
          const x = ox + ow - ((f.off + t * f.speed) % 1.2 - 0.1) * ow;
          ctx.save();
          ctx.translate(x, oy + f.y * oh);
          ctx.scale(-1, 1);
          drawFish(ctx, 0, 0, Math.max(5, u * 1.1), withAlpha('#b7f0a8', a), 0, false);
          ctx.restore();
        }
      }
      label(ctx, 'OCEAN CROSS-SECTION', ox + u * 2.5, oy + fs * 1.4, { size: fs * 0.8, color: ink.dim });

      // ── Osmosis inset ──
      const ix = narrow ? w * 0.27 : w * 0.82;
      const iy = narrow ? h * 0.54 : h * 0.27;
      const ir = narrow ? Math.min(w * 0.11, h * 0.05) : Math.min(w * 0.05, h * 0.09);
      label(ctx, 'A MARINE FISH CELL', narrow ? w * 0.06 : w * 0.6, narrow ? h * 0.455 : fs * 1.6, { size: fs * 0.8, color: ink.dim });
      ctx.fillStyle = withAlpha(accent, 0.12);
      ctx.strokeStyle = withAlpha(accent, 0.7);
      ctx.lineWidth = 1.5;
      circle(ctx, ix, iy, ir);
      ctx.fill();
      ctx.stroke();
      label(ctx, `inside ≈ ${FISH_INTERNAL}`, ix, iy - fs * 0.45, { align: 'center', size: fs * 0.8, color: ink.text });
      label(ctx, 'g/kg', ix, iy + fs * 0.75, { align: 'center', size: fs * 0.75, color: ink.dim });

      const diff = S - FISH_INTERNAL;
      const mag = diff > 0 ? diff / (SEAWATER - FISH_INTERNAL) : -diff / FISH_INTERNAL;
      const outward = diff > 0;
      ctx.fillStyle = '#8fd0ff';
      ctx.strokeStyle = '#8fd0ff';
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + 0.3;
        const len = ir * 0.6 * Math.max(0.12, mag);
        if (mag < 0.07) continue;
        const r0 = outward ? ir + 3 : ir + 3 + len;
        const r1 = outward ? ir + 3 + len : ir + 3;
        const x0 = ix + Math.cos(a) * r0;
        const y0 = iy + Math.sin(a) * r0;
        const x1 = ix + Math.cos(a) * r1;
        const y1 = iy + Math.sin(a) * r1;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        arrowHead(ctx, x1, y1, Math.atan2(y1 - y0, x1 - x0), 6);
        // A water droplet travelling along the arrow.
        const f = (t * 0.8 + k * 0.17) % 1;
        circle(ctx, lerp(x0, x1, f), lerp(y0, y1, f), 1.6);
        ctx.fill();
      }
      const flowLabel = `water ${flow(S).toLowerCase()}`;
      label(ctx, flowLabel, narrow ? ix + ir * 1.9 : w * 0.6, narrow ? iy : fs * 3.2, {
        align: 'left',
        size: fs * 0.9,
        color: diff < 0 ? ink.warn : '#8fd0ff',
      });

      // ── Tolerance chart ──
      const cx0 = narrow ? w * 0.06 : w * 0.6;
      const cx1 = narrow ? w * 0.94 : w * 0.97;
      const cy0 = narrow ? h * 0.66 : h * 0.55;
      const rowH = narrow ? h * 0.052 : h * 0.07;
      const nameW = narrow ? w * 0.36 : (cx1 - cx0) * 0.36;
      const bx0 = cx0 + nameW;
      const bx1 = cx1 - fs * 1.6;
      const sx = (s: number) => bx0 + (s / 40) * (bx1 - bx0);
      label(ctx, 'SALINITY EACH GROUP TOLERATES (APPROX.)', cx0, cy0 - fs * 1.4, { size: fs * 0.75, color: ink.dim });

      groups.forEach((g, i) => {
        const y = cy0 + i * rowH + rowH / 2;
        const st = health(S, g);
        label(ctx, g.name, cx0, y, { size: fs * 0.85, color: st === 'ok' ? ink.text : ink.dim });
        ctx.fillStyle = withAlpha('#ffffff', 0.05);
        roundRect(ctx, bx0, y - rowH * 0.18, bx1 - bx0, rowH * 0.36, 3);
        ctx.fill();
        ctx.fillStyle = st === 'ok' ? withAlpha(accent, 0.8) : st === 'stressed' ? withAlpha('#f2c46b', 0.6) : withAlpha('#ffffff', 0.2);
        roundRect(ctx, sx(g.lo), y - rowH * 0.18, sx(g.hi) - sx(g.lo), rowH * 0.36, 3);
        ctx.fill();
        label(ctx, healthMark[st], cx1, y, {
          align: 'right',
          size: fs,
          color: st === 'ok' ? ink.text : st === 'stressed' ? '#f2c46b' : ink.warn,
          weight: 700,
        });
      });
      // Current salinity marker.
      const mx = sx(S);
      const chartBottom = cy0 + groups.length * rowH;
      ctx.strokeStyle = ink.text;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mx, cy0 - 2);
      ctx.lineTo(mx, chartBottom + 2);
      ctx.stroke();
      for (const s of [0, 10, 20, 30, 40]) {
        label(ctx, String(s), sx(s), chartBottom + fs * 1.1, { align: 'center', size: fs * 0.75, color: ink.faint });
      }
      label(ctx, `${fmt(S, 0)} g/kg now`, mx, chartBottom + fs * 2.5, { align: 'center', size: fs * 0.85, color: ink.text });
      label(ctx, `✓ ${healthWord.ok}   ! ${healthWord.stressed}   ✕ ${healthWord.failing}`, cx0, chartBottom + fs * 4, {
        size: fs * 0.75,
        color: ink.faint,
      });
    },
  };
};

export default factory;
