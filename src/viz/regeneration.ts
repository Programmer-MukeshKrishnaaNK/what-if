import type { VizFactory } from './types';
import { ink, label, roundRect, smooth, span, unit, withAlpha } from './kit';

const WEEKS = 10;

/** Skin closes over the wound. */
const closedAt = (p: number) => smooth(span(p, 0.06, 0.2));
/** Blastema — the bud of undifferentiated cells. */
const budAt = (p: number) => smooth(span(p, 0.2, 0.38));
/** Elongation of the regrowing limb. */
const growAt = (p: number) => smooth(span(p, 0.36, 0.9));
/** Scar tissue maturing. */
const scarAt = (p: number) => smooth(span(p, 0.2, 0.5));

function stageOfRegrowth(p: number): string {
  if (p < 0.06) return 'Open wound';
  if (p < 0.2) return 'New skin covers the wound';
  if (p < 0.38) return 'Blastema forming';
  if (p < 0.7) return 'Regrowing';
  if (p < 0.9) return 'Digits forming';
  return 'Complete limb';
}

function stageOfHuman(p: number): string {
  if (p < 0.06) return 'Open wound';
  if (p < 0.2) return 'New skin covers the wound';
  if (p < 0.5) return 'Scar tissue forming';
  return 'Healed with a scar';
}

interface Limb {
  /** Width of the limb relative to the column unit. */
  width: number;
  digits: number;
  thumb: boolean;
}

const AXOLOTL: Limb = { width: 0.62, digits: 4, thumb: false };
const HUMAN: Limb = { width: 0.8, digits: 5, thumb: true };

const factory: VizFactory = ({ accent }) => {
  /** Draw the distal limb (forearm + hand) from the cut down, scaled by growth g (0–1). */
  function distal(ctx: CanvasRenderingContext2D, x: number, cutY: number, len: number, lw: number, limb: Limb, g: number) {
    const foreLen = len * 0.56;
    const fore = foreLen * Math.min(1, g / 0.6);
    const wrist = lw * 0.82;
    const taper = lw - (lw - wrist) * (fore / foreLen);
    // Forearm, tapering toward the wrist.
    ctx.beginPath();
    ctx.moveTo(x - lw / 2, cutY - 1);
    ctx.lineTo(x + lw / 2, cutY - 1);
    ctx.lineTo(x + taper / 2, cutY + fore);
    ctx.quadraticCurveTo(x, cutY + fore + lw * 0.12, x - taper / 2, cutY + fore);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (g < 0.6) return;
    // Palm grows in, then the digits.
    const handLen = len * 0.44;
    const handG = span(g, 0.6, 0.8);
    const palmW = lw * (limb.thumb ? 1.2 : 1.05);
    const palmH = handLen * 0.42 * handG;
    const py = cutY + fore - 1;
    roundRect(ctx, x - palmW / 2, py, palmW, palmH, Math.min(palmW, palmH) * 0.35);
    ctx.fill();
    ctx.stroke();
    const digitG = span(g, 0.78, 1);
    if (digitG <= 0) return;
    const fingers = limb.thumb ? limb.digits - 1 : limb.digits;
    const spread = limb.thumb ? 0.07 : 0.2;
    const dw = (palmW / fingers) * 0.7;
    for (let i = 0; i < fingers; i++) {
      const offset = i - (fingers - 1) / 2;
      const dx = x + offset * (palmW / fingers);
      const lenK = limb.thumb ? [0.8, 0.95, 1, 0.9][i] ?? 0.9 : 1 - Math.abs(offset) * 0.12;
      const dl = handLen * 0.58 * digitG * lenK;
      ctx.save();
      ctx.translate(dx, py + palmH - dw * 0.3);
      ctx.rotate(-offset * spread);
      roundRect(ctx, -dw / 2, 0, dw, dl, dw / 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    if (limb.thumb) {
      const tw = dw * 1.1;
      ctx.save();
      ctx.translate(x - palmW / 2 + tw * 0.3, py + palmH * 0.3);
      ctx.rotate(0.75);
      roundRect(ctx, -tw / 2, 0, tw, handLen * 0.42 * digitG, tw / 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  function ghost(ctx: CanvasRenderingContext2D, x: number, cutY: number, len: number, lw: number, limb: Limb) {
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = withAlpha('#ffffff', 0.22);
    ctx.fillStyle = 'transparent';
    distal(ctx, x, cutY, len, lw, limb, 1);
    ctx.restore();
  }

  return {
    ambient: false,
    aspect: { wide: 16 / 9, narrow: 4 / 5 },

    valueText: (p) => `About ${Math.round(p * WEEKS)} weeks after the injury. Axolotl: ${stageOfRegrowth(p)}. Human: ${stageOfHuman(p)}.`,

    readouts: (p) => [
      { label: 'Time since injury', value: p === 0 ? 'Day 0' : `~${Math.max(1, Math.round(p * WEEKS))} weeks` },
      { label: 'Axolotl', value: stageOfRegrowth(p) },
      { label: 'Human today', value: stageOfHuman(p) },
      { label: 'Hypothetical human', value: stageOfRegrowth(p) },
    ],

    draw({ ctx, w, h, p }) {
      const u = unit(w, h);
      const narrow = w < 560;
      const fs = Math.max(10, u * (narrow ? 1.5 : 1.3));
      const cols = [
        { title: 'Axolotl', tag: 'ESTABLISHED', limb: AXOLOTL, regrows: true, hypothetical: false },
        { title: 'Human today', tag: 'ESTABLISHED', limb: HUMAN, regrows: false, hypothetical: false },
        { title: narrow ? 'Human (what if)' : 'Human, enhanced', tag: 'HYPOTHETICAL', limb: HUMAN, regrows: true, hypothetical: true },
      ];
      const colW = w / 3;
      const topY = h * 0.17;
      const cutY = h * 0.37;
      const len = h * 0.5;
      const base = Math.min(colW * 0.3, h * 0.12);

      cols.forEach((col, i) => {
        const x = colW * (i + 0.5);
        const lw = base * col.limb.width;
        const skin = col.limb === AXOLOTL ? '#e9a7b8' : '#c9a58c';
        const fill = col.hypothetical ? withAlpha(skin, 0.5) : withAlpha(skin, 0.9);
        const stroke = col.hypothetical ? withAlpha(skin, 0.95) : withAlpha('#000000', 0.25);

        label(ctx, col.title, x, h * 0.07, { align: 'center', size: fs * 1.15, color: ink.text, font: 'sans', weight: 600 });
        label(ctx, col.tag, x, h * 0.07 + fs * 1.6, {
          align: 'center',
          size: fs * 0.75,
          color: col.hypothetical ? '#c7a6ff' : '#8fd6a8',
        });

        // The target shape, faintly.
        ghost(ctx, x, cutY, len, lw, col.limb);

        // Upper limb (the part that remains).
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.2;
        if (col.hypothetical) ctx.setLineDash([4, 3]);
        roundRect(ctx, x - lw / 2, topY, lw, cutY - topY, lw * 0.2);
        ctx.fill();
        ctx.stroke();

        const closed = closedAt(p);
        if (col.regrows) {
          const bud = budAt(p);
          const g = growAt(p);
          if (g > 0) distal(ctx, x, cutY, len, lw, col.limb, g);
          // Blastema bud at the growing tip.
          if (bud > 0 && g < 0.98) {
            const tipY = cutY + len * 0.62 * g;
            ctx.fillStyle = withAlpha(accent, 0.75 * (1 - g * 0.7));
            ctx.beginPath();
            ctx.ellipse(x, tipY, lw * 0.5, lw * 0.42 * bud, 0, 0, Math.PI);
            ctx.fill();
            if (i === 0 && p > 0.2 && p < 0.6) {
              label(ctx, 'blastema', x + lw * 0.8, tipY + lw * 0.2, { size: fs * 0.85, color: accent });
            }
          }
        } else {
          // Scar: fibrous cap that closes the wound but rebuilds nothing.
          const scar = scarAt(p);
          if (scar > 0) {
            ctx.fillStyle = withAlpha('#e8d9cf', 0.55 + 0.3 * scar);
            ctx.beginPath();
            ctx.ellipse(x, cutY, lw * 0.5, lw * 0.22 * (0.4 + scar), 0, 0, Math.PI);
            ctx.fill();
            ctx.strokeStyle = withAlpha('#7a5c4f', 0.6 * scar);
            ctx.lineWidth = 1;
            for (let k = -2; k <= 2; k++) {
              ctx.beginPath();
              ctx.moveTo(x + (k * lw) / 6 - lw * 0.06, cutY + 1);
              ctx.lineTo(x + (k * lw) / 6 + lw * 0.06, cutY + lw * 0.16 * (0.4 + scar));
              ctx.stroke();
            }
            if (p > 0.35) label(ctx, 'scar tissue', x + lw * 0.8, cutY + lw * 0.2, { size: fs * 0.85, color: ink.dim });
          }
        }
        ctx.setLineDash([]);

        // The wound edge: sealed by new skin early on.
        if (closed < 1) {
          ctx.strokeStyle = withAlpha(ink.warn, 0.9 * (1 - closed));
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x - lw / 2, cutY);
          ctx.lineTo(x + lw / 2, cutY);
          ctx.stroke();
        }
        if (closed > 0 && (col.regrows ? budAt(p) < 0.5 : true)) {
          ctx.strokeStyle = withAlpha('#f6e3d8', 0.8 * closed);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(x, cutY, lw * 0.5, lw * 0.12 * closed, 0, 0, Math.PI);
          ctx.stroke();
        }

        // Outcome tick/cross in text, not colour alone.
        if (p > 0.92) {
          const ok = col.regrows;
          const y = h * 0.95;
          label(ctx, ok ? '✓ regrown' : '— scarred, not regrown', x, y, {
            align: 'center',
            size: fs * 0.9,
            color: ok ? ink.text : ink.dim,
          });
        }
      });

      // Column dividers.
      ctx.strokeStyle = ink.ghost;
      ctx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(colW * i, h * 0.04);
        ctx.lineTo(colW * i, h * 0.96);
        ctx.stroke();
      }
    },
  };
};

export default factory;
