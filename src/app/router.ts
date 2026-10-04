export interface Page {
  el: HTMLElement;
  title: string;
  destroy?: () => void;
}

export type Route =
  | { name: 'home' }
  | { name: 'scenario'; id: string; node?: string }
  | { name: 'not-found' };

/**
 * Hash routes: "#/", "#/what-if/<scenario>" and "#/what-if/<scenario>/<node>".
 * Hashes not starting with "#/" are in-page anchors.
 */
export function parseRoute(hash: string): Route | null {
  if (hash === '' || hash === '#' || hash === '#/') return { name: 'home' };
  if (!hash.startsWith('#/')) return null;
  const match = hash.match(/^#\/what-if\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?\/?$/);
  if (match) return { name: 'scenario', id: match[1], node: match[2] };
  return { name: 'not-found' };
}

export const scenarioHref = (scenarioId: string, nodeId?: string) =>
  nodeId ? `#/what-if/${scenarioId}/${nodeId}` : `#/what-if/${scenarioId}`;
