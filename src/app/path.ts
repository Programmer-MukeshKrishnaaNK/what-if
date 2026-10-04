import type { Discovery, Scenario } from '../data/types';

/**
 * The reader's path through one scenario (entry → … → current node).
 * Kept in sessionStorage so refresh, Back and Forward keep making sense:
 * - revisiting a node already on the path truncates back to it;
 * - arriving via a choice from the last node extends the path;
 * - anything else (deep link, shared URL) falls back to the shortest path from the entry.
 */
const key = (scenarioId: string) => `whatif:path:${scenarioId}`;

function load(scenarioId: string): string[] {
  try {
    const raw = sessionStorage.getItem(key(scenarioId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function save(scenarioId: string, path: string[]) {
  try {
    sessionStorage.setItem(key(scenarioId), JSON.stringify(path));
  } catch {
    /* storage unavailable: path still works for this render */
  }
}

/** Shortest path of node ids from the entry to `target` (breadth-first). */
export function canonicalPath(scenario: Scenario, target: string): string[] {
  const prev = new Map<string, string | null>([[scenario.entry, null]]);
  const queue = [scenario.entry];
  while (queue.length) {
    const id = queue.shift()!;
    if (id === target) break;
    for (const c of scenario.discoveries[id]?.choices ?? []) {
      if (!prev.has(c.next)) {
        prev.set(c.next, id);
        queue.push(c.next);
      }
    }
  }
  if (!prev.has(target)) return [scenario.entry];
  const path: string[] = [];
  for (let id: string | null = target; id; id = prev.get(id) ?? null) path.unshift(id);
  return path;
}

const visitedKey = (scenarioId: string) => `whatif:visited:${scenarioId}`;

/** Nodes the reader has opened in this session (used to mark explored choices). */
export function isVisited(scenarioId: string, nodeId: string): boolean {
  try {
    return (JSON.parse(sessionStorage.getItem(visitedKey(scenarioId)) ?? '[]') as string[]).includes(nodeId);
  } catch {
    return false;
  }
}

function markVisited(scenarioId: string, nodeId: string) {
  try {
    const list = JSON.parse(sessionStorage.getItem(visitedKey(scenarioId)) ?? '[]') as string[];
    if (!list.includes(nodeId)) sessionStorage.setItem(visitedKey(scenarioId), JSON.stringify([...list, nodeId]));
  } catch {
    /* storage unavailable */
  }
}

export function resolvePath(scenario: Scenario, nodeId: string): Discovery[] {
  const stored = load(scenario.id).filter((id) => scenario.discoveries[id]);
  let path: string[];
  const at = stored.indexOf(nodeId);
  const last = stored.length ? scenario.discoveries[stored[stored.length - 1]] : undefined;
  if (at >= 0 && stored[0] === scenario.entry) {
    path = stored.slice(0, at + 1);
  } else if (stored[0] === scenario.entry && last?.choices?.some((c) => c.next === nodeId)) {
    path = [...stored, nodeId];
  } else {
    path = canonicalPath(scenario, nodeId);
  }
  save(scenario.id, path);
  markVisited(scenario.id, nodeId);
  return path.map((id) => scenario.discoveries[id]);
}
