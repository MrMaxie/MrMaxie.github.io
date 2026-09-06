import { registerPageMotion } from './page-lifecycle';

const revealEase = 'cubic-bezier(0.16, 1, 0.3, 1)';

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
  const animations = new Set<Animation>();
  const observers: IntersectionObserver[] = [];

  const play = (target: HTMLElement, distance: number, duration: number, delay = 0) => {
    const animation = target.animate(
      { transform: [`translateY(${distance}px)`, 'translateY(0px)'] },
      { delay: delay * 1000, duration: duration * 1000, easing: revealEase, fill: 'both' },
    );
    animations.add(animation);
    animation.finished.then(
      () => {
        animations.delete(animation);
        animation.cancel();
      },
      () => animations.delete(animation),
    );
  };

  const observe = (selector: string, options: RevealOptions) => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          play(entry.target as HTMLElement, options.distance, options.duration);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: options.margin },
    );
    for (const target of document.querySelectorAll(selector)) observer.observe(target);
    observers.push(observer);
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
    for (const observer of observers) observer.disconnect();
    for (const animation of animations) animation.cancel();
    animations.clear();
  };
});
