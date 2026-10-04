import type { VisualizationType } from '../data/types';

/**
 * Small line-art identities for each scenario card (64×64, stroke = currentColor).
 * Elements with class "g-draw" animate in on hover.
 */
const glyphs: Partial<Record<VisualizationType, string>> = {
  'earth-rotation': `
    <circle cx="32" cy="32" r="18"/>
    <ellipse cx="32" cy="32" rx="7" ry="18" class="g-draw"/>
    <path d="M14 32h36" opacity=".5"/>
    <path d="M10 18a26 26 0 0 1 30-9" class="g-draw"/><path d="M38 6l3 3-4 2"/>`,
  'sunlight-delay': `
    <circle cx="12" cy="32" r="7"/>
    <path d="M22 32h28" stroke-dasharray="3 4" class="g-draw"/>
    <circle cx="54" cy="32" r="3.5"/>
    <path d="M12 21v-5M12 48v-5M3 26l-2-2M3 38l-2 2" opacity=".6"/>`,
  'sleepless-day': `
    <circle cx="32" cy="32" r="18" opacity=".45"/>
    <path d="M32 14a18 18 0 0 1 15.6 27" stroke-width="4" class="g-draw"/>
    <path d="M32 32V22M32 32l6 4"/>`,
  'magnetic-shield': `
    <circle cx="38" cy="32" r="7"/>
    <path d="M38 25c-12-10-22 4-12 9 4 2 8 2 12-2M38 39c-12 10-22-4-12-9" class="g-draw"/>
    <path d="M38 25c12-10 22 4 12 9-4 2-8 2-12-2M38 39c12 10 22-4 12-9" class="g-draw"/>
    <path d="M4 22h8M4 32h10M4 42h8" opacity=".6"/>`,
  'lunar-tides': `
    <ellipse cx="28" cy="32" rx="19" ry="13" class="g-draw"/>
    <circle cx="28" cy="32" r="10"/>
    <circle cx="56" cy="32" r="4"/>`,
  regeneration: `
    <path d="M26 6v24M38 6v24" />
    <path d="M26 30h12" opacity=".6"/>
    <path d="M26 30v14l-3 12M30 44v13M34 44v13M38 30v14l3 12" stroke-dasharray="3 3" class="g-draw"/>`,
  'rogue-orbit': `
    <circle cx="22" cy="34" r="4"/>
    <circle cx="22" cy="34" r="12" opacity=".45"/>
    <path d="M22 22c14-2 22 6 26 14s6 14 10 18" class="g-draw"/>
    <circle cx="58" cy="54" r="2.5"/>`,
  generations: `
    <path d="M8 14h22M14 24h26M20 34h30M26 44h30M32 54h24" class="g-draw"/>
    <path d="M30 8v52" opacity=".5"/>`,
  'ocean-salinity': `
    <path d="M6 22c6-4 10-4 16 0s10 4 16 0 10-4 16 0 8 3 8 3" class="g-draw"/>
    <path d="M6 34c6-4 10-4 16 0s10 4 16 0 10-4 16 0" opacity=".5"/>
    <circle cx="16" cy="44" r="1.2"/><circle cx="30" cy="50" r="1.2"/><circle cx="44" cy="45" r="1.2"/><circle cx="52" cy="54" r="1.2"/>`,
  'dense-atmosphere': `
    <path d="M4 52h56" />
    <path d="M10 52a22 22 0 0 1 44 0" class="g-draw"/>
    <path d="M18 52a14 14 0 0 1 28 0" class="g-draw"/>
    <circle cx="32" cy="22" r="1.4"/><circle cx="24" cy="30" r="1.4"/><circle cx="40" cy="30" r="1.4"/><circle cx="32" cy="40" r="1.4"/><circle cx="20" cy="42" r="1.4"/><circle cx="44" cy="42" r="1.4"/>`,
};

export function glyphMarkup(type: VisualizationType): string {
  return `<svg class="glyph" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${glyphs[type] ?? ''}</svg>`;
}
