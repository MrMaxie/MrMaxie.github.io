import EmblaCarousel from 'embla-carousel';

let slideshowCleanups: Array<() => void> = [];

const setupSlideshow = (root: HTMLElement) => {
  const viewport = root.querySelector<HTMLElement>('[data-mod-slideshow-viewport]');
  const previousButton = root.querySelector<HTMLButtonElement>('[data-mod-slideshow-prev]');
  const nextButton = root.querySelector<HTMLButtonElement>('[data-mod-slideshow-next]');
  const currentSlide = root.querySelector<HTMLElement>('[data-mod-slideshow-current]');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-mod-slideshow-slide]'));

  if (!viewport || !previousButton || !nextButton || !currentSlide || slides.length === 0) {
    return () => undefined;
  }

  root.setAttribute('data-mod-slideshow-ready', '');

  const emblaApi = EmblaCarousel(viewport, {
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const updateControls = () => {
    const selectedIndex = emblaApi.selectedScrollSnap();

    currentSlide.textContent = String(selectedIndex + 1);
    previousButton.disabled = !emblaApi.canScrollPrev();
    nextButton.disabled = !emblaApi.canScrollNext();

    for (const [index, slide] of slides.entries()) {
      slide.setAttribute('aria-hidden', String(index !== selectedIndex));
    }
  };
  const showPrevious = () => emblaApi.scrollPrev(reduceMotion.matches);
  const showNext = () => emblaApi.scrollNext(reduceMotion.matches);

  previousButton.addEventListener('click', showPrevious);
  nextButton.addEventListener('click', showNext);
  emblaApi.on('select', updateControls);
  emblaApi.on('reInit', updateControls);
  updateControls();

  return () => {
    previousButton.removeEventListener('click', showPrevious);
    nextButton.removeEventListener('click', showNext);
    emblaApi.destroy();
    root.removeAttribute('data-mod-slideshow-ready');
  };
};

const initSlideshows = () => {
  for (const cleanup of slideshowCleanups) cleanup();
  slideshowCleanups = Array.from(document.querySelectorAll<HTMLElement>('[data-mod-slideshow]'), setupSlideshow);
};

document.addEventListener('astro:page-load', initSlideshows);
document.addEventListener('astro:before-swap', () => {
  for (const cleanup of slideshowCleanups) cleanup();
  slideshowCleanups = [];
});
initSlideshows();
