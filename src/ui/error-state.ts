import { h } from './dom';

interface ErrorStateOptions {
  onRetry: () => void;
  compact?: boolean;
  title?: string;
  message?: string;
}

export function errorState({
  onRetry,
  compact = false,
  title = 'Something broke in this timeline.',
  message = "This part of the experience didn't load. It's usually a network hiccup.",
}: ErrorStateOptions): HTMLElement {
  const retry = h('button.btn.btn-primary', { type: 'button' }, 'Try again');
  retry.addEventListener('click', onRetry);
  return h(
    `div.${compact ? 'stage-error' : 'page-error'}`,
    { role: 'alert' },
    h('p.error-glyph', { 'aria-hidden': 'true' }, '?'),
    h(compact ? 'p' : 'h1', { class: 'error-title', tabindex: compact ? undefined : '-1' }, title),
    h('p.error-message', {}, message),
    h('div.error-actions', {}, retry, compact ? null : h('a.btn.btn-ghost', { href: '#/' }, 'All questions')),
  );
}
