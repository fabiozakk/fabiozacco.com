/**
 * Single client-side motion bundle for the whole page: smooth scroll,
 * scroll-reveal, hero parallax, a custom "play" cursor over video cards,
 * and a scroll-linked marquee speed.
 *
 * Everything here is opt-in and reversible: reveal targets are fully visible
 * by default in CSS. Only once this script confirms `prefers-reduced-motion`
 * is NOT set does it arm the hidden states — so a slow/broken script load,
 * JS-disabled browsers, and reduced-motion users all see complete, static
 * content instead of stuck-invisible sections.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  document.documentElement.classList.add('motion-on');
  armReveal();
  initParallax();
  initMarquee();
  initCursor();
  initLenis();
  initHeroSlideshow();
}

function armReveal() {
  // Above-the-fold content (the hero) plays on load rather than waiting on
  // an IntersectionObserver: whether it counts as "intersecting" at the
  // moment the observer attaches is fragile across viewport heights, since
  // the hero deliberately places its content near the bottom of the fold.
  const immediate = document.querySelectorAll<HTMLElement>('[data-reveal-immediate]');
  if (immediate.length) {
    immediate.forEach((el) => el.classList.add('reveal-armed'));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        immediate.forEach((el) => el.classList.add('is-visible'));
      });
    });
  }

  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal-armed'));

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
  );

  targets.forEach((el) => io.observe(el));
}

function initParallax() {
  const el = document.querySelector<HTMLElement>('[data-parallax]');
  if (!el) return;

  let active = false;
  let ticking = false;

  const io = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) requestTick();
  });
  io.observe(el);

  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    ticking = false;
    if (!active) return;
    const rect = el.getBoundingClientRect();
    const offset = rect.top * 0.15;
    el.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    requestTick();
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  requestTick();
}

function initMarquee() {
  const track = document.querySelector<HTMLElement>('[data-marquee-track]');
  if (!track) return;

  // Progressive enhancement over the CSS keyframe fallback: drive the same
  // translateX with a rAF loop so speed can react to scroll velocity.
  track.style.animation = 'none';

  const baseSpeed = 40; // px/s
  let x = 0;
  let lastTime = performance.now();
  let lastScrollY = window.scrollY;
  let boost = 0;
  const trackWidth = () => track.scrollWidth / 2;

  window.addEventListener(
    'scroll',
    () => {
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      boost = Math.max(-120, Math.min(120, boost + dy * 0.5));
    },
    { passive: true },
  );

  function frame(time: number) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;
    boost *= 0.94; // decay back to base speed
    x -= (baseSpeed + Math.abs(boost)) * dt;
    const w = trackWidth();
    if (w > 0 && Math.abs(x) >= w) x += w;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function initHeroSlideshow() {
  const root = document.querySelector<HTMLElement>('[data-hero-slideshow]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll<HTMLElement>('.hero__slide'));
  if (slides.length < 2) return;

  const interval = Number(root.dataset.interval) || 5;
  let index = 0;

  setInterval(() => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  }, interval * 1000);
}

function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.querySelector<HTMLElement>('[data-play-cursor]');
  if (!cursor) return;

  let raf = 0;
  let x = 0;
  let y = 0;

  document.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
    if (!raf) {
      raf = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        raf = 0;
      });
    }
  });

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as HTMLElement).closest('[data-cursor="play"]');
    cursor.classList.toggle('is-active', Boolean(target));
  });
}

async function initLenis() {
  const { default: Lenis } = await import('lenis');
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
