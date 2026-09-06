type PageSetup = () => undefined | (() => void);

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const registerPageSetup = (setup: PageSetup) => {
  let cleanup: (() => void) | undefined;

  const dispose = () => {
    cleanup?.();
    cleanup = undefined;
  };
  const initialize = () => {
    dispose();
    cleanup = setup() || undefined;
  };

  document.addEventListener('astro:page-load', initialize);
  document.addEventListener('astro:before-swap', dispose);
  initialize();
};

export const registerPageMotion = (setup: PageSetup) =>
  registerPageSetup(() => {
    if (prefersReducedMotion()) return;
    return setup();
  });
