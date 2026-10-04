import type { ScientificStatus } from '../data/types';
import { h } from './dom';

export const statusInfo: Record<ScientificStatus, { label: string; meaning: string }> = {
  established: { label: 'Established', meaning: 'Supported by well-understood science.' },
  inferred: { label: 'Inferred', meaning: 'A reasonable consequence derived from established science.' },
  hypothetical: { label: 'Hypothetical', meaning: 'Plausible, but the exact outcome cannot be known.' },
};

/** Status label: icon shape + text, so meaning never relies on colour alone. */
export function statusBadge(status: ScientificStatus): HTMLElement {
  const info = statusInfo[status];
  return h(
    'span.status',
    { 'data-status': status, title: info.meaning },
    h('span.status-icon', { 'aria-hidden': 'true' }),
    info.label,
  );
}

export function statusLegend(): HTMLElement {
  return h(
    'dl.legend',
    {},
    ...(Object.keys(statusInfo) as ScientificStatus[]).flatMap((s) => [
      h('dt', {}, statusBadge(s)),
      h('dd', {}, statusInfo[s].meaning),
    ]),
  );
}
