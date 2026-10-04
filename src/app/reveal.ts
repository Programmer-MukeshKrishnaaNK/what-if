import { prefersReducedMotion } from './motion';

/** Fade/slide elements marked [data-reveal] in as they enter the viewport. */
export function setupReveal(root: HTMLElement): () => void {
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  targets.forEach((t) => {
    t.classList.add('reveal');
    io.observe(t);
  });
  return () => io.disconnect();
}
