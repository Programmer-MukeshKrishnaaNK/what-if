import type { Choice, Conclusion, Discovery, Scenario, ScenarioMeta } from '../data/types';
import { neighbours, scenarios } from '../data/scenarios';
import { scenarioHref, type Page } from '../app/router';
import { isVisited } from '../app/path';
import { h, pad2 } from './dom';
import { createStage, type StageHandle } from './stage';
import { statusBadge, statusLegend } from './status';

const ORDINAL = ['First discovery', 'Second consequence', 'Third consequence', 'Fourth consequence'];

/**
 * One discovery node of a scenario. Generic over the scenario graph: the entry
 * node gets the full hero; deeper nodes get a compact hero plus the reader's path.
 */
export function renderScenario(scenario: Scenario, node: Discovery, path: Discovery[]): Page {
  const { prev, next } = neighbours(scenario);
  const num = pad2(scenario.number);
  const isEntry = node.id === scenario.entry;
  const depth = path.length - 1;
  const previousNode = path.length > 1 ? path[path.length - 2] : undefined;
  const kicker = node.conclusion ? 'Final consequence' : (ORDINAL[depth] ?? 'Consequence');

  let stage: StageHandle | null = null;
  let stageSection: HTMLElement | null = null;
  if (node.visualization) {
    // Shown once the visualization has played through.
    const jump = h('a.jump-to-discovery', { href: '#discovery', hidden: true }, 'What just happened?', h('span', { 'aria-hidden': 'true' }, '↓'));
    jump.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('discovery');
      target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      target?.focus({ preventScroll: true });
    });
    stage = createStage({ spec: node.visualization, accent: scenario.accent, onComplete: () => (jump.hidden = false) });
    stageSection = h(
      'section.s-stage.reveal-now',
      { 'aria-label': 'Interactive visualization' },
      stage.el,
      h('details.s-describe', {}, h('summary', {}, 'Describe this visualization'), h('p', {}, node.visualization.description)),
      jump,
    );
  }

  const pagerLink = (s: ScenarioMeta | undefined, dir: 'prev' | 'next') =>
    s
      ? h(
          `a.pager-link.pager-${dir}`,
          { href: scenarioHref(s.id), style: `--accent:${s.accent}` },
          h('span.pager-dir', {}, dir === 'prev' ? '← Previous question' : 'Next question →'),
          h('span.pager-q', {}, s.question),
        )
      : h('span.pager-link.pager-empty', { 'aria-hidden': 'true' });

  const el = h(
    'div.scenario-page',
    { style: `--accent:${scenario.accent}` },
    h(
      'header.topbar',
      {},
      h('a.topbar-back', { href: '#/' }, h('span', { 'aria-hidden': 'true' }, '←'), ' All questions'),
      h('a.topbar-brand', { href: '#/', 'aria-label': 'What If? home' }, 'What if', h('span', {}, '?')),
      h(
        'div.topbar-end',
        {},
        h(
          'p.topbar-progress',
          { 'aria-label': `Question ${scenario.number} of ${scenarios.length}` },
          h('span.progress-current', {}, num),
          ` / ${pad2(scenarios.length)}`,
        ),
        h('div.audio-slot', { 'data-audio-slot': '' }),
      ),
    ),
    h(
      'main.scenario',
      { id: 'main', tabindex: '-1' },
      h(
        `section.s-hero${isEntry ? '' : '.is-compact'}`,
        { 'aria-labelledby': 's-title' },
        h('p.s-meta.reveal-now', {}, h('span', {}, num), h('span.s-meta-sep', { 'aria-hidden': 'true' }, '—'), h('span', {}, scenario.category)),
        h(
          'h1.s-title.reveal-now',
          { id: 's-title', tabindex: '-1' },
          h('span.s-whatif', {}, 'What if '),
          h('span.s-premise', {}, scenario.premise),
        ),
        isEntry ? null : trail(scenario, path, previousNode),
        h('p.s-intro.reveal-now', {}, isEntry ? scenario.intro : (node.hook ?? '')),
      ),
      stageSection,
      discoverySection(node, kicker, !isEntry),
      node.choices?.length ? choiceSection(scenario, node.choices) : null,
      node.conclusion ? conclusionSection(scenario, node.conclusion, path) : null,
      h(
        'nav.pager',
        { 'aria-label': 'Other questions' },
        pagerLink(prev, 'prev'),
        h('a.pager-all', { href: '#/' }, 'All 10 questions'),
        pagerLink(next, 'next'),
      ),
      h('footer.site-footer.compact', { 'data-reveal': '' }, statusLegend()),
    ),
  );

  return {
    el,
    title: isEntry ? `${scenario.question} — What If?` : `${node.label} · ${scenario.question} — What If?`,
    destroy: () => stage?.destroy(),
  };
}

/** A quiet line showing how the reader got here, plus a way back one step. */
function trail(scenario: Scenario, path: Discovery[], previousNode?: Discovery): HTMLElement {
  const steps = path.map((n, i) => {
    const name = i === 0 ? scenario.shortTitle : n.label;
    const isCurrent = i === path.length - 1;
    return h(
      'li',
      {},
      isCurrent ? h('span', { 'aria-current': 'page' }, name) : h('a', { href: scenarioHref(scenario.id, n.id) }, name),
    );
  });
  return h(
    'div.trail.reveal-now',
    {},
    h('nav', { 'aria-label': 'Your path through this question' }, h('ol.trail-list', {}, ...steps)),
    previousNode
      ? h(
          'a.trail-back',
          { href: scenarioHref(scenario.id, previousNode.id) },
          h('span', { 'aria-hidden': 'true' }, '←'),
          `Back to ${previousNode.id === scenario.entry ? 'the first discovery' : previousNode.label.toLowerCase()}`,
        )
      : null,
  );
}

function discoverySection(node: Discovery, kicker: string, focusTarget: boolean): HTMLElement {
  return h(
    'section.s-discovery',
    { id: 'discovery', tabindex: '-1', 'aria-labelledby': 'd-title' },
    h('div.d-head', { 'data-reveal': '' }, h('p.kicker', {}, kicker), statusBadge(node.status)),
    h('h2.d-title', { id: 'd-title', 'data-reveal': '', tabindex: '-1', 'data-focus': focusTarget ? '' : undefined }, node.title),
    h(
      `div.d-grid${node.highlight ? '' : '.is-single'}`,
      {},
      h('div.d-body', { 'data-reveal': '' }, ...node.explanation.map((para) => h('p', {}, para))),
      node.highlight
        ? h(
            'aside.highlight',
            { 'data-reveal': '', 'aria-label': 'Key number' },
            h('p.highlight-value', {}, node.highlight.value),
            h('p.highlight-label', {}, node.highlight.label),
            node.highlight.basis ? h('p.highlight-basis', {}, h('span.calc', {}, 'calc'), node.highlight.basis) : null,
            statusBadge(node.highlight.status),
          )
        : null,
    ),
    node.facts.length
      ? h(
          'div.facts',
          { 'data-reveal': '' },
          h('h3.facts-title', {}, 'What else changes'),
          h('ul.fact-list', {}, ...node.facts.map((f) => h('li.fact', {}, statusBadge(f.status), h('p', {}, f.text)))),
        )
      : null,
  );
}

/** The decision point: which consequence to follow. Both happen — this is about where to look. */
function choiceSection(scenario: Scenario, choices: Choice[]): HTMLElement {
  return h(
    'section.s-choices',
    { 'aria-labelledby': 'choices-title', 'data-reveal': '' },
    h('p.kicker', {}, 'What happens next'),
    h('h2.choices-title', { id: 'choices-title' }, 'Follow the next consequence'),
    h('p.choices-note', {}, 'Both of these happen. Choose which one to follow — you can come back for the other.'),
    h(
      'ol.choice-list',
      {},
      ...choices.map((c, i) => {
        const explored = isVisited(scenario.id, c.next);
        return h(
          'li',
          {},
          h(
            'a.choice',
            { href: scenarioHref(scenario.id, c.next) },
            h('span.choice-index', { 'aria-hidden': 'true' }, String.fromCharCode(65 + i)),
            h('span.choice-label', {}, c.label),
            h('span.choice-desc', {}, c.description),
            h(
              'span.choice-cta',
              {},
              explored ? h('span.choice-explored', {}, 'Explored · ') : null,
              'Follow',
              h('span.choice-arrow', { 'aria-hidden': 'true' }, ' →'),
            ),
          ),
        );
      }),
    ),
  );
}

function conclusionSection(scenario: Scenario, c: Conclusion, path: Discovery[]): HTMLElement {
  // Choices along this path that the reader didn't take — the natural "explore another branch".
  const onPath = new Set(path.map((n) => n.id));
  const untaken = new Map<string, { choice: Choice; from: Discovery }>();
  for (const n of path) {
    for (const choice of n.choices ?? []) {
      if (!onPath.has(choice.next) && !untaken.has(choice.next)) untaken.set(choice.next, { choice, from: n });
    }
  }
  const { next } = neighbours(scenario);

  return h(
    'section.s-conclusion',
    { 'aria-labelledby': 'conclusion-title' },
    h('p.kicker', { 'data-reveal': '' }, 'Conclusion'),
    h('h2.c-title', { id: 'conclusion-title', 'data-reveal': '' }, c.title),
    h('div.c-summary', { 'data-reveal': '' }, ...c.summary.map((p) => h('p', {}, p))),
    h(
      'dl.c-numbers',
      { 'data-reveal': '' },
      ...c.numbers.map((n) =>
        h(
          'div.c-number',
          {},
          h('dd.c-number-value', {}, n.value),
          h('dt.c-number-label', {}, n.label, n.calculated ? h('span.calc', { title: 'Calculated from a formula' }, 'calc') : null),
          statusBadge(n.status),
        ),
      ),
    ),
    h('p.c-takeaway', { 'data-reveal': '' }, c.takeaway),
    h(
      'div.c-path',
      { 'data-reveal': '' },
      h('h3.facts-title', {}, 'The path you followed'),
      h('ol.c-path-list', {}, ...path.map((n, i) => h('li', {}, i === 0 ? `${scenario.shortTitle}: ${n.label}` : n.label))),
    ),
    untaken.size
      ? h(
          'div.c-explore',
          { 'data-reveal': '' },
          h('h3.facts-title', {}, 'Paths you didn’t follow'),
          h(
            'ul.c-explore-list',
            {},
            ...[...untaken.values()].map(({ choice, from }) =>
              h(
                'li',
                {},
                h(
                  'a.c-explore-link',
                  { href: scenarioHref(scenario.id, choice.next) },
                  h('span.c-explore-from', {}, `From ${from.id === scenario.entry ? 'the first discovery' : from.label.toLowerCase()}`),
                  h('span.c-explore-label', {}, choice.label),
                ),
              ),
            ),
          ),
        )
      : null,
    h(
      'div.c-actions',
      { 'data-reveal': '' },
      h('a.btn.btn-ghost', { href: scenarioHref(scenario.id) }, 'Start this question again'),
      next
        ? h('a.btn.btn-primary', { href: scenarioHref(next.id) }, 'Next question', h('span.btn-arrow', { 'aria-hidden': 'true' }, '→'))
        : h('a.btn.btn-primary', { href: '#/' }, 'All questions'),
    ),
  );
}
