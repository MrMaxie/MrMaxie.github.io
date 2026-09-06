import { registerPageSetup } from './page-lifecycle';

registerPageSetup(() => {
  const nav = document.querySelector<HTMLElement>('[data-site-nav]');

  if (!nav) return;

  const update = () => {
    if (nav.hasAttribute('data-home-nav')) {
      nav.toggleAttribute('data-at-top', window.scrollY < 20);
    }

    const range = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = range > 0 ? window.scrollY / range : 0;
    nav.style.setProperty('--scroll-progress', Math.min(1, Math.max(0, progress)).toFixed(4));
  };
  let frame: number | undefined;
  const schedule = () => {
    if (frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      update();
    });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  update();

  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    observer.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
  };
});
