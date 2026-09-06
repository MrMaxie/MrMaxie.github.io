import { scroll } from 'motion';

import { registerPageSetup } from './page-lifecycle';

registerPageSetup(() => {
  const nav = document.querySelector<HTMLElement>('[data-site-nav]');

  if (!nav) return;

  return scroll((progress, { y }) => {
    if (nav.hasAttribute('data-home-nav')) {
      nav.toggleAttribute('data-at-top', y.current < 20);
    }

    nav.style.setProperty('--scroll-progress', Math.min(1, Math.max(0, progress)).toFixed(4));
  });
});
