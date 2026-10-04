import type { Scenario, ScenarioMeta } from '../types';
import { catalog } from './catalog';

/**
 * The scenario catalogue. Adding scenario #11 = add its content file and a
 * catalogue entry (plus a visualization module if it needs a new visual type).
 */
export const scenarios: readonly ScenarioMeta[] = [...catalog].sort((a, b) => a.number - b.number);

export function getMeta(id: string): ScenarioMeta | undefined {
  return scenarios.find((s) => s.id === id);
}

const loaded = new Map<string, Promise<Scenario>>();

/** Loads (once) and returns the full scenario, discoveries included. */
export function loadScenario(meta: ScenarioMeta): Promise<Scenario> {
  let pending = loaded.get(meta.id);
  if (!pending) {
    pending = meta.load().then((m) => ({ ...meta, ...m.default }));
    // Don't cache failures: a retry should try the network again.
    pending.catch(() => loaded.delete(meta.id));
    loaded.set(meta.id, pending);
  }
  return pending;
}

export function neighbours(scenario: ScenarioMeta): { prev?: ScenarioMeta; next?: ScenarioMeta } {
  const i = scenarios.findIndex((s) => s.id === scenario.id);
  return { prev: scenarios[i - 1], next: scenarios[i + 1] };
}

/**
 * Structural checks for a scenario graph: every link resolves, every node is
 * reachable, nothing dead-ends, and every ending has a conclusion.
 */
export function validateScenario(s: Scenario): string[] {
  const errors: string[] = [];
  const nodes = s.discoveries;
  if (!nodes[s.entry]) errors.push(`entry "${s.entry}" missing`);
  for (const [id, node] of Object.entries(nodes)) {
    if (node.id !== id) errors.push(`node key "${id}" != id "${node.id}"`);
    const choices = node.choices ?? [];
    if (choices.length && node.conclusion) errors.push(`${id}: has both choices and a conclusion`);
    if (!choices.length && !node.conclusion) errors.push(`${id}: dead end (no choices, no conclusion)`);
    if (choices.length === 1) errors.push(`${id}: a choice needs at least two options`);
    for (const c of choices) if (!nodes[c.next]) errors.push(`${id}: choice → missing node "${c.next}"`);
  }
  const seen = new Set<string>();
  const stack = [s.entry];
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id) || !nodes[id]) continue;
    seen.add(id);
    for (const c of nodes[id].choices ?? []) stack.push(c.next);
  }
  for (const id of Object.keys(nodes)) if (!seen.has(id)) errors.push(`${id}: unreachable from entry`);
  return errors;
}

if (import.meta.env.DEV) {
  const ids = new Set<string>();
  for (const meta of scenarios) {
    if (ids.has(meta.id)) console.warn(`[scenarios] duplicate id: ${meta.id}`);
    ids.add(meta.id);
  }
  // Validate graphs once the page is idle, without blocking the first render.
  setTimeout(() => {
    for (const meta of scenarios) {
      loadScenario(meta).then((s) => {
        for (const e of validateScenario(s)) console.warn(`[scenarios] ${s.id}: ${e}`);
      });
    }
  }, 2000);
}
