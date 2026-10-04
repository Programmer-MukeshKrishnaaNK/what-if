const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => query.matches;

export function onReducedMotionChange(fn: (reduced: boolean) => void): () => void {
  const handler = () => fn(query.matches);
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}
