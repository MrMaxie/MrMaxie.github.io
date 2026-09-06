import { animate, inView } from 'motion';

import { registerPageMotion } from './page-lifecycle';

const revealEase = [0.16, 1, 0.3, 1] as [number, number, number, number];

let hadHeroBeforeSwap = false;
document.addEventListener('astro:before-swap', () => {
  hadHeroBeforeSwap = Boolean(document.querySelector('[data-hero]'));
});

type RevealOptions = {
  distance: number;
  duration: number;
  margin: `${number}px ${number}px ${number}% ${number}px`;
};

registerPageMotion(() => {
  const animations = new Set<ReturnType<typeof animate>>();
  const observers: Array<() => void> = [];

  const play = (target: HTMLElement, distance: number, duration: number, delay = 0) => {
    const animation = animate(target, { y: [distance, 0] }, { delay, duration, ease: revealEase });
    animations.add(animation);
    animation.then(
      () => {
        animations.delete(animation);
        target.style.removeProperty('transform');
      },
      () => animations.delete(animation),
    );
  };

  const observe = (selector: string, options: RevealOptions) => {
    observers.push(
      inView(
        selector,
        target => {
          play(target as HTMLElement, options.distance, options.duration);
        },
        { margin: options.margin },
      ),
    );
  };

  const home = document.querySelector<HTMLElement>('[data-home-page]');

  if (home) {
    observe('[data-home-reveal]', { distance: 8, duration: 0.62, margin: '0px 0px -10% 0px' });
  } else {
    observe('[data-page-reveal]', { distance: 8, duration: 0.64, margin: '0px 0px -9% 0px' });
  }

  const hero = document.querySelector<HTMLElement>('[data-hero]');

  if (hero && !hadHeroBeforeSwap) {
    const content = hero.querySelector<HTMLElement>('[data-hero-reveal]');
    const visual = hero.querySelector<HTMLElement>('[data-hero-visual]');

    if (content) play(content, 9, 0.62);
    if (visual) play(visual, 8, 0.72, 0.08);
  }

  return () => {
    for (const stop of observers) stop();
    for (const animation of animations) animation.cancel();
    animations.clear();
  };
});
