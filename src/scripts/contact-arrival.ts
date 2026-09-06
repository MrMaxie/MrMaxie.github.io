import { prefersReducedMotion, registerPageSetup } from './page-lifecycle';

let highlight: Animation | undefined;

const revealContact = () => {
  if (window.location.hash !== '#contact') return;
  const contact = document.getElementById('contact');
  if (!contact) return;

  contact.scrollIntoView({ block: 'start', behavior: 'instant' });
  contact.focus({ preventScroll: true });
  highlight?.cancel();

  if (prefersReducedMotion()) return;

  const accent = getComputedStyle(contact).getPropertyValue('--accent-secondary').trim();
  highlight = contact.animate(
    {
      backgroundColor: [`color-mix(in srgb, ${accent} 12%, transparent)`, 'transparent'],
      boxShadow: [`0 0 0 2px ${accent}`, '0 0 0 2px transparent'],
    },
    { duration: 1600, easing: 'ease-out' },
  );
};

registerPageSetup(() => {
  revealContact();

  return () => highlight?.cancel();
});

window.addEventListener('hashchange', revealContact);
document.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!(link instanceof HTMLAnchorElement)) return;
  const target = new URL(link.href);
  if (target.origin === location.origin && target.pathname === location.pathname && target.hash === '#contact') {
    requestAnimationFrame(revealContact);
  }
});
