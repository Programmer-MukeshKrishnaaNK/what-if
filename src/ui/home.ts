import { scenarios } from '../data/scenarios';
import { h, pad2, svg } from './dom';
import { glyphMarkup } from './glyphs';
import { statusLegend } from './status';
import type { Page } from '../app/router';

export function renderHome(): Page {
  const list = h(
    'ol.question-list',
    {},
    ...scenarios.map((s, i) => {
      return h(
        'li.question-item',
        { 'data-reveal': '', style: `--accent:${s.accent}; --i:${i}` },
        h(
          'a.question-card',
          { href: `#/what-if/${s.id}` },
          h('span.qc-number', { 'aria-hidden': 'true' }, pad2(s.number)),
          h('span.qc-glyph', { 'aria-hidden': 'true' }, svg(glyphMarkup(s.glyph))),
          h(
            'span.qc-text',
            {},
            h('span.qc-question', {}, h('span.qc-whatif', {}, 'What if '), s.premise),
            h('span.qc-teaser', {}, s.teaser),
          ),
          h('span.qc-meta', { 'aria-hidden': 'true' }, h('span.qc-category', {}, s.category), h('span.qc-cta', {}, 'Explore', h('span.qc-arrow', {}, '→'))),
        ),
      );
    }),
  );

  const scrollCue = h('button.scroll-cue', { type: 'button' }, `${scenarios.length} questions`, h('span', { 'aria-hidden': 'true' }, '↓'));
  scrollCue.addEventListener('click', () => {
    const target = document.getElementById('questions');
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    (list.querySelector('a') as HTMLElement | null)?.focus({ preventScroll: true });
  });

  const el = h(
    'main.home',
    { id: 'main', tabindex: '-1' },
    h(
      'section.hero',
      { 'aria-labelledby': 'hero-title' },
      h('div.hero-horizon', { 'aria-hidden': 'true' }),
      h('div.audio-slot.home-audio', { 'data-audio-slot': '' }),
      h('p.eyebrow.reveal-now', {}, 'An interactive field guide to alternate realities'),
      h('h1.wordmark.reveal-now', { id: 'hero-title' }, 'What if', h('span.wordmark-q', {}, '?')),
      h('p.tagline.reveal-now', {}, 'Change one rule of reality.', h('br'), 'See what happens next.'),
      scrollCue,
    ),
    h(
      'section.questions',
      { id: 'questions', 'aria-labelledby': 'questions-title' },
      h(
        'header.section-head',
        { 'data-reveal': '' },
        h('h2', { id: 'questions-title' }, 'Pick a rule to break'),
        h('p', {}, 'Each question opens a visual experiment and its first discovery. Every claim is labelled by how sure science is.'),
      ),
      list,
    ),
    h(
      'footer.site-footer',
      { 'data-reveal': '' },
      h('h2.footer-title', {}, 'How sure are we?'),
      statusLegend(),
      h('p.footer-note', {}, 'Animations are visualizations built for intuition, not full simulations. Where a number is calculated, it is marked "calc" and the formula is given.'),
    ),
  );

  return { el, title: 'What If? — Change one rule of reality' };
}
