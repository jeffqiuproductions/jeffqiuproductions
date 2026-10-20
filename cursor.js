/* The pointer — the mouse's own mark wherever the reel's disc isn't: a
   viewfinder's corners round a point (styles.css draws it). On a link the
   corners close round its words, as a camera's do when it focuses, blink
   twice and lean a little after the mouse. GSAP moves and sizes it. Off on
   touch screens, and while the page loads. */

(() => {
  const gsap = window.gsap;
  if (!gsap) return;

  const root = document.documentElement;
  const mouse = matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const disc = document.querySelector('.cursor');

  const FOLLOW = 0.16;          // s the frame takes to catch the mouse
  const MAGNET = 0.12;          // how far, on a link, it leans after the mouse
  const FRAME = 16;             // px square round the point
  const FRAME_PAD = [14, 10];   // px it adds round a link's words
  const LINKS = 'a[href], button';

  const pointer = document.createElement('div');
  pointer.className = 'pointer is-away';
  pointer.setAttribute('aria-hidden', 'true');
  pointer.innerHTML = '<span class="pointer__frame"><i></i><i></i><i></i><i></i></span>';
  document.body.append(pointer);
  const frame = pointer.firstElementChild;

  const toX = gsap.quickTo(pointer, 'x', { duration: FOLLOW, ease: 'power3' });
  const toY = gsap.quickTo(pointer, 'y', { duration: FOLLOW, ease: 'power3' });

  let at = null;      // where the mouse is, while it is on the page
  let aimed = null;   // the link it is on

  // Where a link's words are (with Sound, its bars too).
  function boxOf(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const box = range.getBoundingClientRect();
    return box.width ? box : el.getBoundingClientRect();
  }

  function show() {
    const away = !at || Boolean(disc.dataset.state) || root.classList.contains('is-loading');
    pointer.classList.toggle('is-away', away);
  }

  // After the mouse; on a link, round its words.
  function place(jump) {
    let { x, y } = at;
    if (aimed) {
      const box = boxOf(aimed);
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      [x, y] = [cx + (x - cx) * MAGNET, cy + (y - cy) * MAGNET];
    }
    if (jump || reduceMotion.matches) {
      toX(x, x);
      toY(y, y);
    } else {
      toX(x);
      toY(y);
    }
  }

  function aim(el) {
    if (aimed === el) return;
    if (aimed) aimed.classList.remove('is-aimed');
    aimed = el;
    pointer.classList.toggle('is-aimed', Boolean(el));
    const still = reduceMotion.matches;
    if (!el) {
      gsap.to(frame, { width: FRAME, height: FRAME, duration: still ? 0 : 0.4, ease: 'expo.out', overwrite: 'auto' });
      gsap.set(frame.children, { opacity: 1, overwrite: 'auto' });
      return;
    }
    el.classList.add('is-aimed');
    const box = boxOf(el);
    gsap.to(frame, {
      width: box.width + FRAME_PAD[0],
      height: box.height + FRAME_PAD[1],
      duration: still ? 0 : 0.45,
      ease: 'expo.out',
      overwrite: 'auto',
    });
    if (still) return;
    gsap.fromTo(frame.children, { opacity: 1 }, {
      opacity: 0.2, duration: 0.07, repeat: 3, yoyo: true, delay: 0.3, ease: 'none', overwrite: 'auto',
    });
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

  // A page that scrolls under a link the mouse is on takes the frame with it.
  addEventListener('scroll', () => {
    if (aimed && at) place(true);
  }, { capture: true, passive: true });

  addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') pointer.classList.add('is-pressed');
  });
  ['pointerup', 'pointercancel'].forEach((type) => addEventListener(type, () => pointer.classList.remove('is-pressed')));

  // Hidden while the disc shows, and while the page loads.
  new MutationObserver(show).observe(disc, { attributes: true, attributeFilter: ['data-state'] });
  new MutationObserver(show).observe(root, { attributes: true, attributeFilter: ['class'] });

  const fit = () => root.classList.toggle('has-pointer', mouse.matches);
  fit();
  mouse.addEventListener('change', fit);
})();
