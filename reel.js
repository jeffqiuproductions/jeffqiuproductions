/* Jeff Production — the reel and everything that follows it: the title, the
   meta rows, the timeline needle and numbers. */

(() => {
  /* Placeholder projects — swap in the real ones. A project can also have
     `media: { src, ratio }` for its card: a film (.mp4 / .webm) or a picture,
     16:9 filling the card or 1:1 set in its middle, as in the Figma
     placeholders ("Video 16:9", "Image 1:1"). */
  const PROJECTS = [
    { title: 'Lorem ipsum', type: 'Short film', year: '2026', runtime: '04:12', ratio: '2.39:1' },
    { title: 'Dolor sit',   type: 'Commercial', year: '2026', runtime: '00:45', ratio: '16:9' },
    { title: 'Amet',        type: 'Brand film', year: '2025', runtime: '01:30', ratio: '1.85:1' },
    { title: 'Consectetur', type: 'Feature',    year: '2025', runtime: '92:00', ratio: '2.39:1' },
    { title: 'Adipiscing',  type: 'Short film', year: '2025', runtime: '11:20', ratio: '1.85:1' },
    { title: 'Elit sed',    type: 'Promo',      year: '2024', runtime: '00:30', ratio: '9:16' },
    { title: 'Tempor',      type: 'Short film', year: '2024', runtime: '07:05', ratio: '2.00:1' },
    { title: 'Incididunt',  type: 'Commercial', year: '2024', runtime: '01:00', ratio: '16:9' },
    { title: 'Labore',      type: 'Brand film', year: '2023', runtime: '02:15', ratio: '2.39:1' },
    { title: 'Magna',       type: 'Short film', year: '2023', runtime: '14:40', ratio: '4:3' },
    { title: 'Aliqua',      type: 'Promo',      year: '2022', runtime: '00:20', ratio: '1:1' },
    { title: 'Veniam',      type: 'Feature',    year: '2022', runtime: '88:00', ratio: '1.85:1' },
  ];

  const N = PROJECTS.length;
  const META = ['type', 'year', 'runtime', 'ratio'];

  /* In the frame the side card's far edge meets the window edge at 400.63
     of its 440px height: that fixes the angle and the perspective. */
  const FAR_EDGE = 400.63 / 440;
  const CARD_RATIO = 440 / 794;  // the front card's height to its width
  const MIN_ROOM = 48;          // least space above and below the card
  const WHEEL_STEP = 600;       // wheel / trackpad pixels per card
  const NUDGE = 0.12;           // a smaller push than this snaps back
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  const INK = '#f1efe9';
  const LINE = '#3d3d3d';
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const reel = document.querySelector('.reel');
  const stage = reel.querySelector('.reel__stage');
  const title = document.querySelector('.title');
  const metaValues = Object.fromEntries(META.map((key) => [key, document.querySelector(`[data-meta="${key}"]`)]));
  const timeline = document.querySelector('.timeline');
  const ticks = timeline.querySelector('.timeline__ticks');
  const needles = [...timeline.querySelectorAll('.needle')];
  const labels = timeline.querySelector('.timeline__labels');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const mod = (n, m) => ((n % m) + m) % m;
  const wrap = (d) => mod(d + N / 2, N) - N / 2;   // nearest way round the loop
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- Build ---------- */

  const cards = PROJECTS.map((project, i) => {
    const card = document.createElement('div');
    card.className = 'reel__card';
    card.dataset.index = i;
    if (project.media) {
      const film = /\.(mp4|webm)$/i.test(project.media.src);
      const media = document.createElement(film ? 'video' : 'img');
      media.className = 'reel__media';
      media.src = project.media.src;
      media.dataset.ratio = project.media.ratio || '16:9';
      if (film) Object.assign(media, { muted: true, loop: true, playsInline: true, preload: 'metadata' });
      else media.alt = '';
      card.append(media);
      card.classList.add('has-media');
    }
    stage.append(card);
    return card;
  });

  const buttons = PROJECTS.map((project, i) => {
    const item = document.createElement('li');
    item.style.setProperty('--i', i);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = pad(i + 1);
    button.setAttribute('aria-label', `${pad(i + 1)} ${project.title}`);
    button.addEventListener('click', () => goTo(i));
    item.append(button);
    labels.append(item);
    return button;
  });

  /* ---------- Geometry ---------- */

  /* The reel is a strip of cards folded at both sides of the front card: flat
     across the middle, then turning away into the screen. A card's two ends
     sit on the strip and the card runs straight between them, so on its way
     round a fold it cuts the corner (and narrows a little) instead of bending. */
  let geo = null;
  let majors = [];

  function measure() {
    const style = getComputedStyle(root);
    const margin = parseFloat(style.getPropertyValue('--margin'));
    const gutter = parseFloat(style.getPropertyValue('--gutter'));
    const frontCols = parseFloat(style.getPropertyValue('--front-cols'));
    const width = reel.clientWidth;
    const room = reel.clientHeight;

    const col = (width - 2 * margin - 11 * gutter) / 12;
    let w = frontCols * col + (frontCols - 1) * gutter;
    let h = w * CARD_RATIO;
    if (h > room - 2 * MIN_ROOM) {
      h = Math.max(room - 2 * MIN_ROOM, 120);
      w = h / CARD_RATIO;
    }

    // Fold just past the front card's edge; a side card's far edge lands on
    // the window edge at FAR_EDGE of its height.
    const fold = w / 2 + gutter;
    const cos = Math.min(Math.max((width / 2 / FAR_EDGE - fold) / w, 0.08), 0.92);
    const sin = Math.sqrt(1 - cos * cos);
    const perspective = (w * sin) / (1 / FAR_EDGE - 1);

    stage.style.perspective = `${perspective}px`;
    stage.style.setProperty('--card-w', `${w}px`);
    stage.style.setProperty('--card-h', `${h}px`);

    // Screen distance between the front card's centre and the next card's:
    // how far a drag moves the reel by one card.
    const nextX = fold + (w / 2) * cos;
    const nextZ = (w / 2) * sin;
    const dragUnit = (nextX * perspective) / (perspective + nextZ);

    const lineWidth = timeline.clientWidth;
    const lineCol = (lineWidth - 11 * gutter) / 12;
    geo = { w, gap: gutter, fold, cos, sin, dragUnit, line: { width: lineWidth, col: lineCol, unit: lineCol + gutter } };

    drawTicks();
    fitTitle(title.lastElementChild);
    render();
  }

  /* Timeline rule: a long tick over each column's centre (one per project),
     three short ones between, all on whole pixels so they stay sharp. */
  function drawTicks() {
    const { width, col, unit } = geo.line;
    const x = (n) => Math.round(n) + 0.5;
    const quarter = unit / 4;
    let short = '';
    for (let j = -Math.floor(col / 2 / quarter); ; j++) {
      const at = col / 2 + j * quarter;
      if (at >= width) break;
      if (at > 0 && mod(j, 4) !== 0) short += `M${x(at)} 1V7`;
    }

    ticks.setAttribute('viewBox', `0 0 ${width} 15`);
    ticks.innerHTML = '';
    const path = (d, attrs) => {
      const el = document.createElementNS(SVG_NS, 'path');
      el.setAttribute('d', d);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      ticks.append(el);
      return el;
    };
    path(`M0 0.5H${width}`, { stroke: LINE });
    path(short, { stroke: LINE });
    majors = PROJECTS.map((_, i) => path(`M${x(col / 2 + i * unit)} 1V14`, { stroke: i === current ? INK : LINE }));
  }

  /* ---------- Render ---------- */

  let pos = 0;        // where the reel is, in cards (any real number)
  let target = 0;     // where it is going
  let velocity = 0;
  let current = -1;   // project shown in the title
  let last = 0;

  function render() {
    const { w, gap, fold, cos, sin, line } = geo;
    const onStrip = (s) => {
      const a = Math.abs(s);
      if (a <= fold) return [s, 0];
      const t = a - fold;
      return [Math.sign(s) * (fold + t * cos), -t * sin];
    };

    cards.forEach((card, i) => {
      const d = wrap(i - pos);
      const shown = Math.abs(d) < 3.5;
      if (card.hidden === shown) card.hidden = !shown;
      if (!shown) return;
      const centre = d * (w + gap);
      const [ax, az] = onStrip(centre - w / 2);
      const [bx, bz] = onStrip(centre + w / 2);
      const dx = bx - ax;
      const dz = bz - az;
      card.style.transform =
        `translate3d(${(ax + bx) / 2}px, 0, ${(az + bz) / 2}px) ` +
        `rotateY(${Math.atan2(-dz, dx)}rad) scaleX(${Math.hypot(dx, dz) / w})`;
      card.classList.toggle('is-front', Math.abs(d) < 0.5);
      const video = card.querySelector('video');
      if (video) Math.abs(d) < 1.5 ? video.play().catch(() => {}) : video.pause();
    });

    // The needle runs past 12 and comes back on at the start, like the reel.
    const x = line.col / 2 + mod(pos, N) * line.unit - 5.5;
    needles[0].style.transform = `translateX(${x}px)`;
    needles[1].style.transform = `translateX(${x - N * line.unit}px)`;

    const index = mod(Math.round(pos), N);
    if (index !== current) show(index, current === -1 ? 0 : Math.sign(wrap(index - current)));
  }

  /* ---------- Title and meta ---------- */

  function show(index, direction) {
    const project = PROJECTS[index];
    current = index;
    swap(title, 'title__text', project.title, direction, fitTitle);
    META.forEach((key, row) => swap(metaValues[key], 'meta__value', project[key], direction, null, row * 40));
    buttons.forEach((button, i) => button.setAttribute('aria-current', i === index ? 'true' : 'false'));
    majors.forEach((tick, i) => tick.setAttribute('stroke', i === index ? INK : LINE));
    cards.forEach((card, i) => card.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
  }

  /* The new text comes up from below as the old goes up and out (the other way
     when the reel turns back). */
  function swap(box, className, text, direction, after, delay = 0) {
    const old = [...box.children];
    const leaving = old.pop();
    old.forEach((el) => el.remove());

    const el = document.createElement('span');
    el.className = className;
    el.textContent = text;
    box.append(el);
    if (after) after(el);

    if (!leaving) return;
    if (!direction || reduceMotion.matches) {
      leaving.remove();
      return;
    }
    const from = direction > 0 ? 100 : -100;
    const options = { duration: 700, easing: EASE, delay, fill: 'backwards' };
    el.animate([{ transform: `translateY(${from}%)` }, { transform: 'none' }], options);

    const now = getComputedStyle(leaving).transform;
    leaving.getAnimations().forEach((a) => a.cancel());
    leaving.classList.add('is-leaving');
    leaving
      .animate([{ transform: now }, { transform: `translateY(${-from}%)` }], { ...options, fill: 'forwards' })
      .onfinish = () => leaving.remove();
    // Animations stall in a hidden tab; don't let the old text pile up there.
    setTimeout(() => leaving.remove(), options.duration + delay + 200);
  }

  /* A title set too wide for its box (or too many lines on a phone) is set
     smaller until it fits. */
  function fitTitle(el) {
    if (!el) return;
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    const room = title.clientWidth;
    if (el.scrollWidth > room) {
      size *= room / el.scrollWidth;
      el.style.fontSize = `${size}px`;
    }
    for (let i = 0; i < 12 && (el.scrollWidth > room + 0.5 || el.offsetHeight > title.clientHeight + 0.5); i++) {
      size *= 0.94;
      el.style.fontSize = `${size}px`;
    }
  }

  /* ---------- Motion ---------- */

  let running = false;
  let dragging = null;

  // A critically damped spring towards the target: eases in and out, and a
  // flick hands it its speed.
  function frame(now) {
    const dt = Math.min(now - last, 200) / 1000;
    last = now;
    if (reduceMotion.matches && !dragging) {
      pos = target;
      velocity = 0;
    } else {
      const omega = dragging ? 28 : 11;
      const steps = Math.ceil(dt / 0.004);
      const h = dt / steps;
      for (let i = 0; i < steps; i++) {
        velocity += (omega * omega * (target - pos) - 2 * omega * velocity) * h;
        pos += velocity * h;
      }
      if (Math.abs(target - pos) < 1e-4 && Math.abs(velocity) < 1e-3) {
        pos = target;
        velocity = 0;
      }
    }
    render();
    if (pos !== target || dragging) requestAnimationFrame(frame);
    else running = false;
  }

  function wake() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  // End a push on a whole card: at least one card on from where it began
  // once it is past NUDGE.
  function settle(from, to) {
    const moved = to - from;
    let n = Math.round(moved);
    if (n === 0 && Math.abs(moved) > NUDGE) n = Math.sign(moved);
    target = from + n;
    wake();
  }

  function goTo(index) {
    const from = Math.round(target);
    target = from + wrap(index - mod(from, N));
    wake();
  }

  /* ---------- Input ---------- */

  // Wheel and trackpad, horizontal or vertical, anywhere on the screen.
  let wheelFrom = null;
  let wheelTimer = 0;
  hero.addEventListener('wheel', (e) => {
    if (e.ctrlKey) return; // pinch zoom
    e.preventDefault();
    let delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) delta *= 16;
    else if (e.deltaMode === 2) delta *= innerHeight;
    if (wheelFrom === null) wheelFrom = Math.round(target);
    target += delta / WHEEL_STEP;
    wake();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      settle(wheelFrom, target);
      wheelFrom = null;
    }, 140);
  }, { passive: false });

  // Drag the reel; a click on a side card brings it to the front.
  reel.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = { id: e.pointerId, x: e.clientX, y: e.clientY, from: Math.round(target), start: target, moved: false, trail: [] };
  });

  reel.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== dragging.id) return;
    const dx = e.clientX - dragging.x;
    const dy = e.clientY - dragging.y;
    if (!dragging.moved) {
      if (Math.hypot(dx, dy) < 6) return;
      if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) {
        dragging = null; // a vertical swipe scrolls the page
        return;
      }
      dragging.moved = true;
      try { reel.setPointerCapture(e.pointerId); } catch {}
      reel.classList.add('is-dragging');
    }
    target = dragging.start - dx / geo.dragUnit;
    dragging.trail.push([e.timeStamp, e.clientX]);
    while (dragging.trail.length > 2 && e.timeStamp - dragging.trail[0][0] > 90) dragging.trail.shift();
    wake();
  });

  function release(e, cancelled) {
    if (!dragging || e.pointerId !== dragging.id) return;
    const drag = dragging;
    dragging = null;
    reel.classList.remove('is-dragging');
    if (!drag.moved) {
      const card = e.target.closest('.reel__card');
      if (card && !cancelled) goTo(Number(card.dataset.index));
      return;
    }
    // A flick carries on up to two cards; a drag that came to rest doesn't.
    let fling = 0;
    const [t0, x0] = drag.trail[0];
    const [t1, x1] = drag.trail[drag.trail.length - 1];
    if (!cancelled && e.timeStamp - t1 < 100) {
      const speed = -(x1 - x0) / Math.max(t1 - t0, 16) / geo.dragUnit * 1000; // cards per second
      fling = Math.max(-2, Math.min(2, speed * 0.12));
    }
    settle(drag.from, target + fling);
  }

  reel.addEventListener('pointerup', (e) => release(e, false));
  reel.addEventListener('pointercancel', (e) => release(e, true));

  document.addEventListener('keydown', (e) => {
    if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable]')) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    target = Math.round(target) + step;
    wake();
  });

  /* ---------- Start ---------- */

  measure();
  addEventListener('resize', measure);
  // Titles are measured in Syne: measure again once it has loaded.
  document.fonts.ready.then(() => fitTitle(title.lastElementChild));
})();
