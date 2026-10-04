import type { VizFactory } from './types';
import { fmt, ink, label, roundRect, unit, withAlpha } from './kit';

const LIFESPAN = 80; // years, simplified
const GAP = 25; // years between generations
const NON_AGING_DEATH_RATE = 0.001; // per year — roughly a healthy young adult's risk
const START = -100;
const END = 300;
const births = Array.from({ length: Math.floor((END - START) / GAP) }, (_, i) => START + i * GAP);

const yearAt = (p: number) => Math.round(p * END);

/**
 * Simple cohort model: one unit of births every year; before year 0 everyone
 * lives exactly 80 years; from year 0 nobody ages and deaths happen at a flat
 * 0.1% a year. Returns population relative to today and mean age.
 */
function population(year: number): { ratio: number; meanAge: number } {
  let n = 0;
  let ageSum = 0;
  for (let born = -LIFESPAN + 1; born <= year; born++) {
    const exposed = year - Math.max(born, 0);
    const alive = Math.exp(-NON_AGING_DEATH_RATE * exposed);
    n += alive;
    ageSum += alive * (year - born);
  }
  return { ratio: n / LIFESPAN, meanAge: ageSum / n };
}

/** Alive at `year`: born already, and either young enough at year 0 or still within a normal lifespan. */
const isAlive = (born: number, year: number) => born <= year && born + LIFESPAN > Math.min(0, year);

const factory: VizFactory = ({ accent }) => ({
  ambient: false,
  aspect: { wide: 16 / 9, narrow: 3 / 4 },

  valueText: (p) => {
    const y = yearAt(p);
    const alive = births.filter((b) => isAlive(b, y)).length;
    return `Year ${y} after aging stopped: ${alive} generations alive at once`;
  },

  readouts: (p) => {
    const y = yearAt(p);
    const pop = population(y);
    return [
      { label: 'Years since aging stopped', value: `${y}` },
      { label: 'Generations alive at once', value: `${births.filter((b) => isAlive(b, y)).length}` },
      { label: 'Population vs. today', value: `${fmt(pop.ratio, 2)}×`, calculated: true },
      { label: 'Average age (years lived)', value: fmt(pop.meanAge), calculated: true },
    ];
  },

  draw({ ctx, w, h, p }) {
    const u = unit(w, h);
    const narrow = w < 560;
    const fs = Math.max(10, u * (narrow ? 1.5 : 1.25));
    const year = yearAt(p);

    const left = narrow ? w * 0.06 : w * 0.1;
    const right = w * 0.96;
    const top = h * 0.1;
    const bottom = h * 0.84;
    const xOf = (yr: number) => left + ((yr - START) / (END - START)) * (right - left);
    const rowH = (bottom - top) / births.length;
    const barH = Math.max(4, rowH * 0.56);

    // Axis.
    ctx.strokeStyle = ink.ghost;
    ctx.lineWidth = 1;
    for (let yr = -100; yr <= END; yr += 50) {
      const x = xOf(yr);
      ctx.beginPath();
      ctx.moveTo(x, top - fs * 0.5);
      ctx.lineTo(x, bottom);
      ctx.stroke();
      if (!narrow || yr % 100 === 0) {
        label(ctx, yr > 0 ? `+${yr}` : `${yr}`, x, bottom + fs * 1.3, { align: 'center', size: fs * 0.85, color: ink.faint });
      }
    }
    label(ctx, 'YEARS', right, bottom + fs * 2.8, { align: 'right', size: fs * 0.8, color: ink.faint });

    // "Aging stops" marker.
    const x0 = xOf(0);
    ctx.strokeStyle = withAlpha(accent, 0.7);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0, top - fs * 1.2);
    ctx.lineTo(x0, bottom);
    ctx.stroke();
    label(ctx, 'aging stops', x0 + 6, top - fs * 1.2, { size: fs * 0.9, color: accent });

    births.forEach((born, i) => {
      if (born > year) return;
      const y = top + i * rowH + (rowH - barH) / 2;
      const normalEnd = born + LIFESPAN;
      const diedBefore = normalEnd <= 0;
      const end = diedBefore ? normalEnd : year;

      // Where this life would normally have ended.
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = withAlpha('#ffffff', 0.22);
      ctx.lineWidth = 1;
      roundRect(ctx, xOf(born), y, xOf(normalEnd) - xOf(born), barH, 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Life lived within a normal span.
      const normalPart = Math.min(end, normalEnd);
      roundRect(ctx, xOf(born), y, Math.max(1.5, xOf(normalPart) - xOf(born)), barH, 2);
      ctx.fillStyle = diedBefore ? withAlpha('#ffffff', 0.18) : withAlpha('#e9e2d4', 0.55);
      ctx.fill();

      // Extra life beyond it — what stopping aging adds.
      if (!diedBefore && end > normalEnd) {
        const survive = Math.exp(-NON_AGING_DEATH_RATE * (year - Math.max(0, born)));
        roundRect(ctx, xOf(normalEnd), y, xOf(end) - xOf(normalEnd), barH, 2);
        ctx.fillStyle = withAlpha(accent, 0.5 + 0.4 * survive);
        ctx.fill();
      }
      if (!narrow && rowH > fs * 1.1) {
        label(ctx, `born ${born > 0 ? '+' : ''}${born}`, xOf(born) - 6, y + barH / 2, {
          align: 'right',
          size: fs * 0.75,
          color: ink.faint,
        });
      }
    });

    // Cursor.
    const xc = xOf(year);
    ctx.strokeStyle = ink.text;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xc, top);
    ctx.lineTo(xc, bottom);
    ctx.stroke();
    if (year > 0) {
      label(ctx, `+${year}`, xc, bottom + fs * 2.8, { align: 'center', size: fs, color: ink.text });
    }

    // Legend: text + shape, not colour alone.
    const ly = h * 0.965;
    const lx = left;
    const sw = fs * 1.6;
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = withAlpha('#ffffff', 0.3);
    roundRect(ctx, lx, ly - barH / 2, sw, barH, 2);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, 'normal lifespan', lx + sw + 6, ly, { size: fs * 0.8, color: ink.dim });
    const lx2 = lx + (narrow ? w * 0.46 : w * 0.24);
    roundRect(ctx, lx2, ly - barH / 2, sw, barH, 2);
    ctx.fillStyle = withAlpha(accent, 0.85);
    ctx.fill();
    label(ctx, 'years added by not aging', lx2 + sw + 6, ly, { size: fs * 0.8, color: ink.dim });
  },
});

export default factory;
