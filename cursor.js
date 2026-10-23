/* The pointer — the mouse's own mark wherever the reel's disc isn't: an
   empty ring, round like the disc it grows into over the reel (styles.css
   draws it). On a link it opens into a wider pink ring round the pointer.
   GSAP moves and sizes it. Off on touch screens, and while the page loads. */

(() => {
  const gsap = window.gsap;
  if (!gsap) return;

  const root = document.documentElement;
  const mouse = matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const disc = document.querySelector('.cursor');

  const FOLLOW = 0.16;    // s the ring takes to catch the mouse
  const RING = 16;        // px across
  const RING_ON = 40;     // px across on a link
  const LINKS = 'a[href], button';

  const pointer = document.createElement('div');
  pointer.className = 'pointer is-away';
  pointer.setAttribute('aria-hidden', 'true');
  pointer.innerHTML = '<span class="pointer__ring"></span>';
  document.body.append(pointer);
  const ring = pointer.firstElementChild;

  const toX = gsap.quickTo(pointer, 'x', { duration: FOLLOW, ease: 'power3' });
  const toY = gsap.quickTo(pointer, 'y', { duration: FOLLOW, ease: 'power3' });

  let at = null;      // where the mouse is, while it is on the page
  let aimed = null;   // the link it is on

  function show() {
    const away = !at || Boolean(disc && disc.dataset.state) || root.classList.contains('is-loading');
    pointer.classList.toggle('is-away', away);
  }

  function place(jump) {
    if (jump || reduceMotion.matches) {
      toX(at.x, at.x);
      toY(at.y, at.y);
    } else {
      toX(at.x);
      toY(at.y);
    }
  }

  function aim(el) {
    if (aimed === el) return;
    if (aimed) aimed.classList.remove('is-aimed');
    aimed = el;
    pointer.classList.toggle('is-aimed', Boolean(el));
    if (el) el.classList.add('is-aimed');
    const size = el ? RING_ON : RING;
    gsap.to(ring, { width: size, height: size, duration: reduceMotion.matches ? 0 : el ? 0.45 : 0.4, ease: 'expo.out', overwrite: 'auto' });
  }

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const first = !at;
    at = { x: e.clientX, y: e.clientY };
    const link = e.target instanceof Element ? e.target.closest(LINKS) : null;
    aim(link && !link.closest('[data-preview]') ? link : null);
    place(first);
    show();
  }, { passive: true });

  // Off the page.
  document.addEventListener('pointerout', (e) => {
    if (e.relatedTarget) return;
    at = null;
    aim(null);
    show();
  });

  addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') pointer.classList.add('is-pressed');
  });
  ['pointerup', 'pointercancel'].forEach((type) => addEventListener(type, () => pointer.classList.remove('is-pressed')));

  // Hidden while the disc shows, and while the page loads.
  if (disc) new MutationObserver(show).observe(disc, { attributes: true, attributeFilter: ['data-state'] });
  new MutationObserver(show).observe(root, { attributes: true, attributeFilter: ['class'] });

  const fit = () => root.classList.toggle('has-pointer', mouse.matches);
  fit();
  mouse.addEventListener('change', fit);
})();
