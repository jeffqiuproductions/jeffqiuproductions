/* The pointer — the mouse's own mark wherever the reel's disc isn't: an
   empty ring, the disc's edge drawn small (styles.css draws both). On a link
   it opens into a wider pink ring round the pointer; where the disc shows it
   opens all the way out to the disc's edge and hands over to it, and comes
   back out of it when the disc goes. GSAP moves and sizes it. Off on touch
   screens, and while the page loads. */

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
  const DISC = 112;       // px across the disc it grows into
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
  let inDisc = false; // the disc shows in its place

  function show() {
    const away = !at || root.classList.contains('is-loading');
    pointer.classList.toggle('is-away', away);
    const onDisc = Boolean(disc && disc.dataset.state);
    if (onDisc === inDisc) return;
    inDisc = onDisc;
    pointer.classList.toggle('is-disc', onDisc);
    size();
  }

  function size() {
    const to = inDisc ? DISC : aimed ? RING_ON : RING;
    gsap.to(ring, { width: to, height: to, duration: reduceMotion.matches ? 0 : 0.45, ease: 'expo.out', overwrite: 'auto' });
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
    size();
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

  // Into the disc and out of it as it shows and goes; hidden while the page loads.
  if (disc) new MutationObserver(show).observe(disc, { attributes: true, attributeFilter: ['data-state'] });
  new MutationObserver(show).observe(root, { attributes: true, attributeFilter: ['class'] });

  const fit = () => root.classList.toggle('has-pointer', mouse.matches);
  fit();
  mouse.addEventListener('change', fit);
})();
