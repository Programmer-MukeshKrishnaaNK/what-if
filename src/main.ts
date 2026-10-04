// Newsreader: roman with optical sizing (display ↔ text), italic for accents only.
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/wght-italic.css';
import '@fontsource-variable/schibsted-grotesk/wght.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './styles/base.css';
import './styles/home.css';
import './styles/scenario.css';
import './styles/stage.css';
import './styles/audio.css';


import { getMeta, loadScenario } from './data/scenarios';
import { prefersReducedMotion } from './app/motion';
import { setupReveal } from './app/reveal';
import { parseRoute, scenarioHref, type Page, type Route } from './app/router';
import { resolvePath } from './app/path';
import type { ScenarioMeta } from './data/types';
import { errorState } from './ui/error-state';
import { audio } from './app/audio';
import { createAudioControl } from './ui/audio-control';
import { renderHome } from './ui/home';
import { renderScenario } from './ui/scenario-page';

const root = document.getElementById('app')!;
// One sound engine and one control for the whole app; pages only provide a slot.
const audioControl = createAudioControl(audio);
let current: { page: Page; route: Route; cleanupReveal: () => void } | null = null;
let activeTransition: ViewTransition | null = null;

function notFound(scenario?: ScenarioMeta): Page {
  const el = errorState({
    title: scenario ? 'This branch of the timeline doesn’t exist.' : "This timeline doesn't exist.",
    message: scenario
      ? `That consequence isn’t part of “${scenario.question}”. The link may be old or mistyped.`
      : "We couldn't find that question. It may have been mistyped.",
    onRetry: () => (location.hash = scenario ? scenarioHref(scenario.id) : '#/'),
  });
  el.querySelector('.btn-primary')!.textContent = scenario ? 'Start this question' : 'Back to all questions';
  if (!scenario) el.querySelector('.btn-ghost')?.remove();
  return { el: wrapMain(el), title: 'Not found — What If?' };
}

function wrapMain(child: HTMLElement): HTMLElement {
  const main = document.createElement('main');
  main.id = 'main';
  main.className = 'error-page';
  main.tabIndex = -1;
  main.append(child);
  return main;
}

async function build(route: Route): Promise<Page> {
  switch (route.name) {
    case 'home':
      return renderHome();
    case 'scenario': {
      const meta = getMeta(route.id);
      if (!meta) return notFound();
      const scenario = await loadScenario(meta);
      const node = scenario.discoveries[route.node ?? scenario.entry];
      if (!node) return notFound(meta);
      return renderScenario(scenario, node, resolvePath(scenario, node.id));
    }
    default:
      return notFound();
  }
}

let renderToken = 0;

async function render(route: Route, isFirst: boolean) {
  const token = ++renderToken;
  const previous = current;
  let page: Page;
  try {
    page = await build(route);
  } catch (err) {
    console.error(err);
    page = {
      el: wrapMain(errorState({ onRetry: () => render(route, false) })),
      title: 'Something broke — What If?',
    };
  }
  // A newer navigation started while this one was loading: drop this result.
  if (token !== renderToken) {
    page.destroy?.();
    return;
  }

  const swap = () => {
    previous?.page.destroy?.();
    previous?.cleanupReveal();
    root.replaceChildren(page.el);
    page.el.querySelector('[data-audio-slot]')?.append(audioControl);
    document.title = page.title;
    window.scrollTo(0, 0);
    current = { page, route, cleanupReveal: setupReveal(page.el) };
    // Move focus to the new page's heading so keyboard and screen-reader users land in context.
    // Done here, after the swap, because a view transition runs this callback asynchronously.
    if (!isFirst) {
      const target =
        page.el.querySelector<HTMLElement>('[data-focus]') ??
        page.el.querySelector<HTMLElement>('h1[tabindex]') ??
        page.el.querySelector<HTMLElement>('#main') ??
        page.el;
      target.focus({ preventScroll: true });
    }
  };

  const canTransition = !isFirst && !document.hidden && !prefersReducedMotion() && 'startViewTransition' in document;
  activeTransition?.skipTransition();
  if (canTransition) {
    const transition = document.startViewTransition(swap);
    activeTransition = transition;
    // A skipped/aborted transition still runs `swap`; its rejections are expected, not errors.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {}).finally(() => {
      if (activeTransition === transition) activeTransition = null;
    });
  } else {
    swap();
  }
}

function onHashChange() {
  const route = parseRoute(location.hash);
  if (!route) return; // in-page anchor
  render(route, false);
}

window.addEventListener('hashchange', onHashChange);
render(parseRoute(location.hash) ?? { name: 'home' }, true);
document.documentElement.classList.add('js-ready');

// Skip link: focus the main region without touching the hash (the hash is the route).
document.querySelector('.skip-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('main')?.focus();
});
