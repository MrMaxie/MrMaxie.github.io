import { registerPageMotion } from './page-lifecycle';

const positionProperties = ['--pointer-x', '--pointer-y', '--grid-x', '--grid-y'] as const;

registerPageMotion(() => {
  const cleanups = Array.from(document.querySelectorAll<HTMLElement>('[data-interactive-surface]'), surface => {
    const move = (event: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

      surface.style.setProperty('--pointer-x', `${x * 100}%`);
      surface.style.setProperty('--pointer-y', `${y * 100}%`);
      surface.style.setProperty('--grid-x', `${(x - 0.5) * 10}px`);
      surface.style.setProperty('--grid-y', `${(y - 0.5) * 10}px`);
    };
    const reset = () => {
      for (const property of positionProperties) surface.style.removeProperty(property);
    };

    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', reset);

    return () => {
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', reset);
      reset();
    };
  });

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
});
