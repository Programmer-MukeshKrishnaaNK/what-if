/** Shared drawing helpers and palette for all visualizations. */

export const ink = {
  bg: '#07080b',
  text: 'rgba(236, 232, 223, 0.92)',
  dim: 'rgba(236, 232, 223, 0.55)',
  faint: 'rgba(236, 232, 223, 0.22)',
  ghost: 'rgba(236, 232, 223, 0.08)',
  earth: '#2c5d8f',
  land: '#4c6b4f',
  ocean: '#3a8fd6',
  sun: '#ffc56b',
  warn: '#ff8a6b',
};

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Map v from [a, b] to [0, 1], clamped. */
export const span = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Deterministic pseudo-random generator so visuals are stable between frames. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

export function withAlpha(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${clamp(a)})`;
}

/** Blend two hex colours; returns hex so it can be fed back into withAlpha. */
export function mix(hexA: string, hexB: string, t: number): string {
  const pa = parseInt(hexA.slice(1), 16);
  const pb = parseInt(hexB.slice(1), 16);
  const c = (sh: number) => Math.round(lerp((pa >> sh) & 255, (pb >> sh) & 255, clamp(t)));
  return `#${((c(16) << 16) | (c(8) << 8) | c(0)).toString(16).padStart(6, '0')}`;
}

export type Font = 'mono' | 'sans' | 'serif';
const families: Record<Font, string> = {
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  sans: '"Schibsted Grotesk Variable", "Helvetica Neue", Arial, sans-serif',
  serif: '"Newsreader Variable", Georgia, serif',
};

export function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: { size?: number; color?: string; align?: CanvasTextAlign; font?: Font; baseline?: CanvasTextBaseline; weight?: number } = {},
) {
  const { size = 11, color = ink.dim, align = 'left', font = 'sans', baseline = 'middle', weight = 500 } = opts;
  ctx.font = `${weight} ${size}px ${families[font]}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
}

export function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
}

export function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, withAlpha(color, 0.55 * alpha));
  g.addColorStop(0.4, withAlpha(color, 0.18 * alpha));
  g.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = g;
  circle(ctx, x, y, r);
  ctx.fill();
}

/** Small arrowhead at (x, y) pointing along angle a. */
export function arrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, size: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size * Math.cos(a - 0.45), y - size * Math.sin(a - 0.45));
  ctx.lineTo(x - size * Math.cos(a + 0.45), y - size * Math.sin(a + 0.45));
  ctx.closePath();
  ctx.fill();
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, Math.max(0, w), Math.max(0, h), Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
}

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Base unit for sizing marks so visuals scale from phone to desktop. */
export const unit = (w: number, h: number) => Math.min(w, h * 1.6) / 100;
