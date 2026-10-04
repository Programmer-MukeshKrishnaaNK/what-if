import type { VizFactory } from './types';
import { circle, clamp, easeInOut, fmt, glow, ink, label, lerp, rng, span, unit, withAlpha } from './kit';

/** Field strength relative to today. Squared so the shield's (cube-root) shrink plays out evenly. */
const fieldAt = (p: number) => (1 - span(p, 0.02, 0.92)) ** 2;

/**
 * Magnetopause stand-off distance in Earth radii. Pressure balance between the
 * solar wind and a dipole (B ∝ r⁻³, pressure ∝ B²) gives r ∝ B^(1/3).
 * Today's typical value is ~10 Earth radii; it can't go below the atmosphere.
 */
const standoffAt = (f: number) => Math.max(1.03, 10 * Math.cbrt(f));

/** Draw radii compress the real stand-off so it fits on screen (not to scale). */
const drawRadius = (rE: number) => 1 + 0.27 * (rE - 1);

/** Shue et al. (1997) magnetopause shape: r(θ) = r0 · (2 / (1 + cos θ))^α. */
const boundary = (r0: number, theta: number) => r0 * Math.pow(2 / (1 + Math.cos(Math.min(theta, 2.6))), 0.5);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0 = free; >0 = being funnelled to a pole (progress 0–1). */
  funnel: number;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
}

interface Flash {
  x: number;
  y: number;
  life: number;
}

const factory: VizFactory = ({ accent }) => {
  const rand = rng(4);
  let particles: Particle[] = [];
  let flashes: Flash[] = [];
  let aurora = 0;
  let impactGlow = 0;
  let lastW = 0;
  let lastH = 0;
  let settledP = -1;

  const spawn = (w: number, h: number, anywhere: boolean): Particle => ({
    x: anywhere ? rand() * w : -rand() * w * 0.1,
    y: rand() * h,
    vx: 0,
    vy: 0,
    funnel: 0,
    fx: 0,
    fy: 0,
    tx: 0,
    ty: 0,
  });

  function step(w: number, h: number, p: number, dt: number, ex: number, ey: number, Re: number) {
    const f = fieldAt(p);
    const r0 = drawRadius(standoffAt(f)) * Re;
    const atm = Re * 1.08;
    const speed = w * 0.22;
    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];
      if (pt.funnel > 0) {
        pt.funnel += dt * 1.6;
        const k = easeInOut(clamp(pt.funnel));
        pt.x = lerp(pt.fx, pt.tx, k);
        pt.y = lerp(pt.fy, pt.ty, k) - Math.sin(k * Math.PI) * Re * 0.6 * Math.sign(pt.ty - ey);
        if (pt.funnel >= 1) {
          aurora = Math.min(1, aurora + 0.08);
          particles[i] = spawn(w, h, false);
        }
        continue;
      }
      if (pt.vx === 0 && pt.vy === 0) pt.vx = speed * (0.85 + rand() * 0.3);
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      // Relax back toward the solar-wind direction once past the obstacle.
      pt.vy *= 1 - Math.min(1, dt * 0.6);

      const dx = pt.x - ex;
      const dy = pt.y - ey;
      const dist = Math.hypot(dx, dy);
      const theta = Math.atan2(Math.abs(dy), -dx); // 0 = pointing at the Sun
      const rb = Math.max(atm, boundary(r0, theta));

      if (dist < rb && theta < 2.5) {
        if (r0 <= atm * 1.12) {
          // No shield worth the name: the wind hits the upper atmosphere.
          flashes.push({ x: ex + (dx / dist) * atm, y: ey + (dy / dist) * atm, life: 1 });
          impactGlow = Math.min(1, impactGlow + 0.04);
          particles[i] = spawn(w, h, false);
          continue;
        }
        const side = dy < 0 ? -1 : dy > 0 ? 1 : rand() < 0.5 ? -1 : 1;
        // Some particles near the cusps are funnelled down field lines to the poles.
        if (f > 0.03 && theta > 0.5 && theta < 1.2 && rand() < 0.012 * f) {
          pt.funnel = 0.001;
          pt.fx = pt.x;
          pt.fy = pt.y;
          const lat = auroraLat(f);
          pt.tx = ex - Math.cos(lat) * atm * 0.6;
          pt.ty = ey + side * Math.sin(lat) * atm;
          continue;
        }
        // Project onto the boundary and slide along it, tailward.
        const th = Math.max(theta, 0.02);
        const bx = ex - Math.cos(th) * rb;
        const by = ey + side * Math.sin(th) * rb;
        const th2 = th + 0.05;
        const rb2 = Math.max(atm, boundary(r0, th2));
        const nx = ex - Math.cos(th2) * rb2 - bx;
        const ny = ey + side * Math.sin(th2) * rb2 - by;
        const n = Math.hypot(nx, ny) || 1;
        const v = Math.hypot(pt.vx, pt.vy);
        pt.x = bx;
        pt.y = by;
        pt.vx = (nx / n) * v;
        pt.vy = (ny / n) * v;
      }
      if (pt.x > w + 10 || pt.y < -20 || pt.y > h + 20) particles[i] = spawn(w, h, false);
    }
    for (const fl of flashes) fl.life -= dt * 1.8;
    flashes = flashes.filter((fl) => fl.life > 0);
    aurora = Math.max(0, aurora - dt * 0.35);
    impactGlow = Math.max(0, impactGlow - dt * 0.5);
  }

  /** Auroral latitude creeps equatorward as the field weakens (radians). */
  const auroraLat = (f: number) => lerp(0.55, 1.17, Math.pow(f, 0.35));

  return {
    ambient: true,
    aspect: { wide: 16 / 9, narrow: 4 / 5 },

    valueText: (p) => `Magnetic field at ${Math.round(fieldAt(p) * 100)}% of today's strength`,

    readouts: (p) => {
      const f = fieldAt(p);
      const r = standoffAt(f);
      return [
        { label: 'Field strength', value: `${Math.round(f * 100)}%` },
        {
          label: 'Shield boundary (Earth radii)',
          value: r <= 1.03 ? 'At the atmosphere' : fmt(r, 1),
          calculated: true,
        },
        {
          label: 'Auroras',
          value: f > 0.6 ? 'Near the poles' : f > 0.05 ? 'Spreading to lower latitudes' : 'Faint, all over the day side',
        },
        { label: 'Solar wind at the upper atmosphere', value: f > 0.05 ? 'Mostly deflected' : 'Arriving directly' },
      ];
    },

    draw({ ctx, w, h, p, dt, reduced }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const Re = Math.max(16, u * (narrow ? 8 : 6.5));
      const ex = w * (narrow ? 0.62 : 0.64);
      const ey = h * 0.5;
      const f = fieldAt(p);
      const fs = Math.max(10, u * 1.3);
      const count = narrow ? 110 : 190;

      if (w !== lastW || h !== lastH || particles.length !== count) {
        particles = Array.from({ length: count }, () => spawn(w, h, true));
        lastW = w;
        lastH = h;
        settledP = -1;
      }
      if (reduced) {
        // No animation: settle the flow for this field strength once, then draw it still.
        if (settledP !== p) {
          particles = Array.from({ length: count }, () => spawn(w, h, true));
          for (let i = 0; i < 160; i++) step(w, h, p, 1 / 60, ex, ey, Re);
          settledP = p;
        }
      } else if (dt > 0) {
        step(w, h, p, Math.min(dt, 1 / 20), ex, ey, Re);
      }

      // The Sun, off to the left.
      glow(ctx, -w * 0.08, ey, w * 0.32, ink.sun, 0.8);
      label(ctx, '← from the Sun', u * 3, h * 0.08, { size: fs * 0.9, color: ink.dim });

      // Magnetopause boundary.
      const r0 = drawRadius(standoffAt(f)) * Re;
      ctx.beginPath();
      for (let i = -60; i <= 60; i++) {
        const th = (i / 60) * 2.3;
        const rb = boundary(r0, Math.abs(th));
        const x = ex - Math.cos(th) * rb;
        const y = ey + Math.sin(th) * rb;
        if (i === -60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = withAlpha(accent, f > 0.01 ? 0.35 + 0.35 * f : 0.12);
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);
      if (f > 0.02) {
        label(ctx, 'shield boundary', ex - r0 - u, ey - r0 * 0.95, { size: fs * 0.85, color: withAlpha(accent, 0.8), align: 'right' });
      }

      // Dipole field lines: r = L·sin²θ, clipped inside the boundary.
      if (f > 0.01) {
        ctx.save();
        ctx.beginPath();
        for (let i = -60; i <= 60; i++) {
          const th = (i / 60) * 2.3;
          const rb = boundary(r0, Math.abs(th));
          ctx.lineTo(ex - Math.cos(th) * rb, ey + Math.sin(th) * rb);
        }
        ctx.lineTo(w * 2, ey + h * 2);
        ctx.lineTo(w * 2, ey - h * 2);
        ctx.closePath();
        ctx.clip();
        ctx.lineWidth = 1;
        for (const L of [1.6, 2.3, 3.2, 4.4, 6]) {
          ctx.strokeStyle = withAlpha(accent, Math.max(0.08, 0.38 - L * 0.04) * Math.pow(f, 0.5));
          for (const side of [-1, 1]) {
            ctx.beginPath();
            const th0 = Math.asin(Math.sqrt(1 / L));
            for (let i = 0; i <= 50; i++) {
              const th = th0 + ((Math.PI - 2 * th0) * i) / 50;
              const r = L * Re * Math.sin(th) ** 2;
              const x = ex + side * r * Math.sin(th);
              const y = ey - r * Math.cos(th);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // Solar wind particles.
      ctx.fillStyle = withAlpha('#ffd9a0', 0.75);
      for (const pt of particles) {
        if (pt.funnel > 0) {
          ctx.fillStyle = withAlpha('#9effd9', 0.9);
          ctx.fillRect(pt.x - 1.2, pt.y - 1.2, 2.4, 2.4);
          ctx.fillStyle = withAlpha('#ffd9a0', 0.75);
        } else {
          ctx.fillRect(pt.x - 1, pt.y - 0.6, 3.2, 1.2);
        }
      }

      // Earth and atmosphere.
      glow(ctx, ex, ey, Re * 1.5, '#7fb2ff', 0.6);
      const body = ctx.createRadialGradient(ex - Re * 0.4, ey - Re * 0.3, Re * 0.1, ex, ey, Re);
      body.addColorStop(0, '#3d76b0');
      body.addColorStop(1, '#0f2238');
      ctx.fillStyle = body;
      circle(ctx, ex, ey, Re);
      ctx.fill();

      // Auroras: polar ovals that drift equatorward as the field fades.
      const auroraStrength = reduced ? 0.6 * Math.min(1, f * 3) : Math.max(aurora, 0.4 * Math.min(1, f * 8));
      if (f > 0.03 && auroraStrength > 0.02) {
        const lat = auroraLat(f);
        for (const side of [-1, 1]) {
          ctx.strokeStyle = withAlpha('#7dffc4', 0.25 + 0.6 * auroraStrength);
          ctx.lineWidth = Math.max(2, Re * 0.07);
          ctx.beginPath();
          const a = side < 0 ? -lat : lat;
          ctx.arc(ex, ey, Re * 1.07, a - 0.22, a + 0.22);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(ex, ey, Re * 1.07, Math.PI - a - 0.22, Math.PI - a + 0.22);
          ctx.stroke();
        }
      }
      // Day-side glow where the wind strikes the atmosphere directly.
      const dayGlow = reduced ? (f < 0.05 ? 0.7 : 0) : impactGlow;
      if (dayGlow > 0.01) {
        ctx.strokeStyle = withAlpha('#ffb38a', 0.2 + 0.5 * dayGlow);
        ctx.lineWidth = Math.max(2, Re * 0.12);
        ctx.beginPath();
        ctx.arc(ex, ey, Re * 1.08, Math.PI * 0.55, Math.PI * 1.45);
        ctx.stroke();
      }
      for (const fl of flashes) glow(ctx, fl.x, fl.y, Re * 0.35, '#ffb38a', fl.life);

      label(ctx, 'Earth', ex, ey + Re + fs * 1.4, { align: 'center', size: fs, color: ink.text });
    },
  };
};

export default factory;
