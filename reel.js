/* Jeff Production — the reel and everything that follows it: the title, the
   meta rows, the timeline needle and numbers. */

(() => {
  /* The projects; the ones still called Lorem ipsum are placeholders. A
     project can have `youtube` (the film on YouTube, the meta's "Watch ↗")
     and `media: { src, poster, volume, ratio }` for its card: a film (.mp4 /
     .webm, looping while it is at the front; `poster` is its first frame,
     shown until it plays; `volume` evens out how loud the films are) or a
     picture, 16:9 filling the card or 1:1 set in its middle, as in the Figma
     placeholders ("Video 16:9", "Image 1:1"). Each film is 40 seconds of the
     whole one, cut to the card's shape. */
  const PROJECTS = [
    {
      title: 'Ocean Wonders', type: 'AI film', year: '2025', runtime: '01:49',
      youtube: 'https://youtu.be/wvu-Rvvs_QU',
      // From 0:26, where the music comes in: the dolphin at sunset to the walruses.
      media: { src: 'assets/films/ocean.mp4', poster: 'assets/films/ocean.jpg', volume: 1 },
    },
    {
      title: 'The Alien Invasion', type: 'AI film', year: '2025', runtime: '01:32',
      youtube: 'https://youtu.be/MEgY6crlBdY',
      // From 0:32: the animals flee, the ships arrive, the attack.
      media: { src: 'assets/films/aliens.mp4', poster: 'assets/films/aliens.jpg', volume: 0.8 },
    },
    {
      title: 'Krakatoa 1883', type: 'AI film', year: '2025', runtime: '04:22',
      youtube: 'https://youtu.be/s6cfM57IhPw',
      // From 0:56: the eruption to "Heard in Perth".
      media: { src: 'assets/films/krakatoa.mp4', poster: 'assets/films/krakatoa.jpg', volume: 0.5 },
    },
    { title: 'Consectetur', type: 'Feature',    year: '2025', runtime: '92:00' },
    { title: 'Adipiscing',  type: 'Short film', year: '2025', runtime: '11:20' },
    { title: 'Elit sed',    type: 'Promo',      year: '2024', runtime: '00:30' },
    { title: 'Tempor',      type: 'Short film', year: '2024', runtime: '07:05' },
    { title: 'Incididunt',  type: 'Commercial', year: '2024', runtime: '01:00' },
    { title: 'Labore',      type: 'Brand film', year: '2023', runtime: '02:15' },
    { title: 'Magna',       type: 'Short film', year: '2023', runtime: '14:40' },
    { title: 'Aliqua',      type: 'Promo',      year: '2022', runtime: '00:20' },
    { title: 'Veniam',      type: 'Feature',    year: '2022', runtime: '88:00' },
  ];

  const N = PROJECTS.length;
  const META = ['type', 'year', 'runtime', 'youtube'];

  /* In the frame the side card's far edge meets the window edge at 400.63
     of its 440px height: that fixes the angle and the perspective. */
  const FAR_EDGE = 400.63 / 440;
  const CARD_RATIO = 440 / 794;  // the front card's height to its width
  const MIN_ROOM = 48;          // least space above and below the card
  const SIDE_CARDS = 3;         // cards laid out on each side of the front one
  const WHEEL_START = 20;       // wheel / trackpad pixels before the first card
  const WHEEL_STEP = 400;       // …and for each card after it, in one gesture
  const WHEEL_MAX = 3;          // cards one gesture can move at most
  const NUDGE = 0.12;           // a smaller push than this snaps back
  const GLIDE = 7;              // spring rate gliding to a card (lower is softer)
  const FOLLOW = 24;            // spring rate following a drag
  const DEPTH_FADE = 0.3;       // what is left of a card's light where the
                                // first side card meets the window edge; it
                                // darkens on the same way the deeper it goes
  const VOLUME = 0.8;           // a film's sound is faded up to this, or
                                // to its own `volume`
  const SLATS = 6;              // rows a title turns in, like a blind's slats
  const META_SLATS = 2;         // …and a meta value
  const SLAT_OUT = 300;         // ms for a slat to turn edge on
  const SLAT_IN = 560;          // …and to turn back flat with the new words
  const SLAT_STAGGER = 55;      // ms from one slat to the next

  const MUTED = '#8b8984';
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
      if (film) {
        Object.assign(media, { muted: true, loop: true, playsInline: true, preload: 'metadata' });
        media.setAttribute('muted', '');
        if (project.media.poster) media.poster = project.media.poster;
        media.dataset.volume = project.media.volume ?? VOLUME;
      } else {
        media.alt = '';
      }
      card.append(media);
      card.classList.add('has-media');
      if (film) {
        // Sound on / off, over the film while it plays (a click anywhere on
        // the playing film does the same).
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'reel__sound label';
        toggle.textContent = 'Sound off';
        toggle.addEventListener('click', toggleSound);
        card.append(toggle);
      }
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
     round a fold it cuts the corner (and narrows a little) instead of bending.
     The cards are spaced so the gap between them on screen is always the
     gutter, however far round the fold they have gone. */
  let geo = null;

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
    geo = { w, gap: gutter, fold, cos, sin, perspective, dragUnit, line: { width: lineWidth, col: lineCol, unit: lineCol + gutter } };

    drawTicks();
    fitTitle(title.lastElementChild);
    render();
  }

  /* Timeline rule: a long tick over each column's centre (one per project),
     three short ones between, all on whole pixels so they stay sharp. */
  const tickX = (n) => Math.round(n) + 0.5;

  function drawTicks() {
    const { width, col, unit } = geo.line;
    const quarter = unit / 4;
    let short = '';
    let long = '';
    for (let j = -Math.floor(col / 2 / quarter); ; j++) {
      const at = col / 2 + j * quarter;
      if (at >= width) break;
      if (at < 0) continue;
      if (mod(j, 4) !== 0) short += `M${tickX(at)} 1V7`;
      else long += `M${tickX(at)} 1V14`;
    }
    ticks.setAttribute('viewBox', `0 0 ${width} 15`);
    ticks.innerHTML =
      `<path d="M0 0.5H${width}" stroke="${MUTED}"/>` +
      `<path d="${short}" stroke="${MUTED}"/>` +
      `<path d="${long}" stroke="${MUTED}"/>`;
  }

  /* ---------- Render ---------- */

  let pos = 0;        // where the reel is, in cards (any real number)
  let target = 0;     // where it is going
  let velocity = 0;
  let current = -1;   // project shown in the title
  const shades = [];  // each card's depth shade, as last set
  let last = 0;

  // A point s along the strip, in 3D…
  function onStrip(s) {
    const { fold, cos, sin } = geo;
    const a = Math.abs(s);
    if (a <= fold) return [s, 0];
    const t = a - fold;
    return [Math.sign(s) * (fold + t * cos), -t * sin];
  }

  // …where it lands across the screen (from the middle, in the stage's
  // perspective), and back: the same on the flat part; round a fold the
  // strip runs away into the screen and closes up.
  function project(s) {
    const [x, z] = onStrip(s);
    return (x * geo.perspective) / (geo.perspective - z);
  }

  function unproject(x) {
    const { fold, cos, sin, perspective } = geo;
    const a = Math.abs(x);
    if (a <= fold) return x;
    const room = perspective * cos - a * sin;   // gone at the vanishing point
    return room > 0 ? Math.sign(x) * (fold + (perspective * (a - fold)) / room) : null;
  }

  function render() {
    const { w, gap, line } = geo;

    // The card nearest the middle sits where the reel is; the others follow
    // it outwards, each one gutter on screen from the last.
    const anchor = Math.round(pos);
    const start = (anchor - pos) * (w + gap) - w / 2;
    const spans = new Map([[mod(anchor, N), [start, start + w]]]);
    const reach = Math.min(SIDE_CARDS, Math.floor((N - 1) / 2));
    for (const side of [1, -1]) {
      let edge = side > 0 ? start + w : start;
      for (let k = 1; k <= reach; k++) {
        const near = unproject(project(edge) + side * gap);
        if (near === null) break;
        const far = near + side * w;
        spans.set(mod(anchor + side * k, N), side > 0 ? [near, far] : [far, near]);
        edge = far;
      }
    }

    const fade = (z) => Math.pow(DEPTH_FADE, -z / (w * geo.sin));
    cards.forEach((card, i) => {
      const span = spans.get(i);
      if (card.hidden === Boolean(span)) card.hidden = !span;
      if (!span) return;
      const [ax, az] = onStrip(span[0]);
      const [bx, bz] = onStrip(span[1]);
      const dx = bx - ax;
      const dz = bz - az;
      card.style.transform =
        `translate3d(${(ax + bx) / 2}px, 0, ${(az + bz) / 2}px) ` +
        `rotateY(${Math.atan2(-dz, dx)}rad) scaleX(${Math.hypot(dx, dz) / w})`;
      card.classList.toggle('is-front', i === mod(anchor, N));

      // The further round the fold, the darker the card goes: from its near
      // end to its far end (z runs straight along it). A shade over it, so it
      // stays solid and the dust never shows through.
      const [na, nm, nb] = [fade(az), fade((az + bz) / 2), fade(bz)];
      const shade = na > 0.995 && nb > 0.995 ? 'none'
        : `linear-gradient(to right, ${[na, nm, nb].map((v) => `rgba(0,0,0,${(1 - v).toFixed(3)})`).join(', ')})`;
      if (shades[i] !== shade) {
        shades[i] = shade;
        card.style.setProperty('--shade', shade);
      }
    });

    // The needle runs past 12 and comes back on at the start, like the reel.
    // On a project its stem lies exactly over the tick (drawn on whole
    // pixels); between projects it slides from one to the next.
    const at = mod(pos, N);
    const from = Math.floor(at);
    const k = at - from;
    const tick = (i) => line.col / 2 + mod(i, N) * line.unit;
    const offset = (i) => tickX(tick(i)) - tick(i);
    const x = line.col / 2 + at * line.unit + offset(from) * (1 - k) + offset(from + 1) * k - 5.5;
    needles[0].style.transform = `translateX(${x}px)`;
    needles[1].style.transform = `translateX(${x - N * line.unit}px)`;

    const index = mod(Math.round(pos), N);
    if (index !== current) show(index, current === -1 ? 0 : Math.sign(wrap(index - current)));
  }

  /* ---------- Title and meta ---------- */

  function show(index, direction) {
    const from = current;
    current = index;
    const turn = from !== -1 && direction !== 0 && !reduceMotion.matches;
    const rows = [
      [title, 'title__text', (project) => project.title, SLATS, 0],
      ...META.map((key, row) => [metaValues[key], 'meta__value', (project) => metaValue(project, key), META_SLATS, 120 + row * 70]),
    ];
    rows.forEach(([box, className, value, slats, delay]) => {
      box.replaceChildren();
      const el = words(className, value(PROJECTS[index]));
      box.append(el);
      if (box === title) fitTitle(el);
      if (!turn) return;
      const old = words(className, value(PROJECTS[from]));
      box.append(old);
      if (box === title) fitTitle(old);
      blinds(box, old, el, slats, direction, delay);
    });
    buttons.forEach((button, i) => button.setAttribute('aria-current', i === index ? 'true' : 'false'));
    cards.forEach((card, i) => card.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
  }

  // The YouTube row links out to the film; a project without one has a dash.
  function metaValue(project, key) {
    if (key !== 'youtube') return project[key];
    if (!project.youtube) return '—';
    const link = document.createElement('a');
    link.className = 'link watch';
    link.href = project.youtube;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Watch ↗';
    link.setAttribute('aria-label', `Watch ${project.title} on YouTube`);
    return link;
  }

  function words(className, value) {
    const el = document.createElement('span');
    el.className = className;
    el.append(value);
    return el;
  }

  /* The words change like a blind's slats turning: the old title, cut into
     rows, turns edge on row after row (down the title as the reel turns on,
     up as it turns back), and the new one's rows turn back flat; the meta
     values, cut in two, follow one row after another. */
  const pct = (v) => `${(v * 100).toFixed(3)}%`;

  function slatsOf(el, n) {
    return Array.from({ length: n }, (_, i) => {
      const slat = el.cloneNode(true);
      slat.classList.add('is-slat');
      slat.setAttribute('aria-hidden', 'true');
      slat.style.clipPath = `inset(${pct(i / n)} 0 ${pct((n - i - 1) / n)} 0)`;
      slat.style.transformOrigin = `50% ${pct((i + 0.5) / n)}`;
      return slat;
    });
  }

  function blinds(box, old, el, n, direction, delay) {
    const outs = slatsOf(old, n);
    const ins = slatsOf(el, n);
    old.remove();
    el.style.visibility = 'hidden';
    box.append(...outs, ...ins);

    const turn = (deg) => `perspective(600px) rotateX(${deg}deg)`;
    const at = (i) => delay + (direction > 0 ? i : n - 1 - i) * SLAT_STAGGER;
    outs.forEach((slat, i) => slat.animate(
      [{ transform: turn(0) }, { transform: turn(direction * 90) }],
      { duration: SLAT_OUT, delay: at(i), easing: 'cubic-bezier(0.5, 0, 0.9, 0.5)', fill: 'forwards' },
    ));
    ins.forEach((slat, i) => slat.animate(
      [{ transform: turn(-direction * 90) }, { transform: turn(0) }],
      { duration: SLAT_IN, delay: at(i) + SLAT_OUT, easing: 'cubic-bezier(0.3, 1.45, 0.6, 1)', fill: 'backwards' },
    ));
    // Animations stall in a hidden tab: settle on time regardless.
    setTimeout(() => {
      if (!el.isConnected) return;
      el.style.visibility = '';
      outs.forEach((slat) => slat.remove());
      ins.forEach((slat) => slat.remove());
    }, delay + (n - 1) * SLAT_STAGGER + SLAT_OUT + SLAT_IN + 40);
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

  /* ---------- Films ---------- */

  /* The film on the front card plays once the reel is at rest on it, with its
     sound as soon as the browser allows (after the visitor's first click, tap
     or key) unless they turn it off. The moment the reel moves it stops; it
     picks up where it was if the reel comes back to it, and starts over if
     another card comes to the front. No films for reduced motion: the poster
     stays. */
  const films = cards.map((card) => card.querySelector('video'));
  let playing = null;   // the film playing, if any
  let sound = true;     // the visitor wants sound (Sound off turns it off)
  let allowed = Boolean(navigator.userActivation && navigator.userActivation.hasBeenActive);

  // Volume up or down over a moment, then `then`; a new fade replaces it.
  function fadeVolume(video, to, ms, then) {
    const from = video.volume;
    const began = Date.now();
    const id = (video.fadeId = (video.fadeId || 0) + 1);
    (function step() {
      if (video.fadeId !== id) return;
      const k = Math.min((Date.now() - began) / ms, 1);
      video.volume = from + (to - from) * k;
      if (k < 1) setTimeout(step, 16);
      else if (then) then();
    })();
  }

  function showSound() {
    films.forEach((video, i) => {
      if (!video) return;
      cards[i].classList.toggle('is-playing', video === playing);
      const on = video === playing && !video.muted;
      const toggle = cards[i].querySelector('.reel__sound');
      toggle.textContent = on ? 'Sound on' : 'Sound off';
      toggle.setAttribute('aria-label', on ? 'Turn the sound off' : 'Turn the sound on');
    });
  }

  function playSilent(video) {
    video.muted = true;
    video.volume = Number(video.dataset.volume);
    video.play().catch(() => {});
  }

  // Sound up on the film; if the browser won't have it yet, it plays on
  // silent.
  function playHeard(video) {
    video.muted = false;
    video.volume = 0;
    video.play().then(() => fadeVolume(video, Number(video.dataset.volume), 600), () => {
      if (playing !== video) return;
      playSilent(video);
      showSound();
    });
  }

  function startFilm(video) {
    playing = video;
    video.fadeId = (video.fadeId || 0) + 1;
    if (sound && allowed) playHeard(video);
    else playSilent(video);
    showSound();
  }

  function stopFilm() {
    if (!playing) return;
    const video = playing;
    playing = null;
    if (video.muted) video.pause();
    else fadeVolume(video, 0, 150, () => video.pause());
    showSound();
  }

  // The reel has come to rest on a card.
  function restFilms() {
    if (root.classList.contains('is-loading') || root.classList.contains('is-moving') || document.hidden) return;
    const index = mod(Math.round(pos), N);
    films.forEach((video, i) => {
      if (!video || i === index) return;
      video.fadeId = (video.fadeId || 0) + 1;
      video.pause();
      if (video.currentTime) video.currentTime = 0;
    });
    const video = films[index];
    if (video && video !== playing && !reduceMotion.matches) startFilm(video);
  }

  function toggleSound() {
    allowed = true; // a click: the browser allows sound now
    if (!playing) return;
    sound = playing.muted;
    if (sound) playHeard(playing);
    else playing.muted = true;
    showSound();
  }

  // The first click, tap or key anywhere turns the sound on (a click on the
  // playing film is its own toggle).
  function allow(e) {
    if (navigator.userActivation && !navigator.userActivation.isActive) return;
    if (e.target instanceof Element && e.target.closest('.reel__card.is-playing')) return;
    const first = !allowed;
    allowed = true;
    if (first && sound && playing && playing.muted) {
      playHeard(playing);
      showSound();
    }
  }
  ['pointerdown', 'pointerup', 'keydown'].forEach((type) => addEventListener(type, allow, true));

  // Not while the page is out of sight, nor under the loader.
  document.addEventListener('visibilitychange', () => (document.hidden ? stopFilm() : restFilms()));
  new MutationObserver(restFilms).observe(root, { attributes: true, attributeFilter: ['class'] });

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
      const omega = dragging ? FOLLOW : GLIDE;
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
    if (pos !== target || dragging) {
      requestAnimationFrame(frame);
    } else {
      running = false;
      root.classList.remove('is-moving');
      restFilms();
    }
  }

  function wake() {
    if (running) return;
    running = true;
    root.classList.add('is-moving');
    stopFilm();
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

  // Wheel and trackpad, horizontal or vertical, anywhere on the screen. A
  // gesture (a turn of the wheel, a swipe and its glide) moves the reel on
  // whole cards: one as it starts, another for each WHEEL_STEP more. The reel
  // always heads for a card, so it never stops short and settles back.
  let gesture = null;
  let gestureTimer = 0;
  hero.addEventListener('wheel', (e) => {
    if (e.ctrlKey) return; // pinch zoom
    e.preventDefault();
    let delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) delta *= 16;
    else if (e.deltaMode === 2) delta *= innerHeight;
    if (!gesture) gesture = { from: Math.round(target), sum: 0 };
    gesture.sum += delta;
    const steps = Math.ceil(Math.max(Math.abs(gesture.sum) - WHEEL_START, 0) / WHEEL_STEP);
    target = gesture.from + Math.sign(gesture.sum) * Math.min(steps, WHEEL_MAX);
    wake();
    clearTimeout(gestureTimer);
    gestureTimer = setTimeout(() => (gesture = null), 180);
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
      if (!card || cancelled || e.target.closest('.reel__sound')) return;
      if (card.classList.contains('is-playing')) toggleSound();
      else goTo(Number(card.dataset.index));
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
  restFilms();
  addEventListener('resize', measure);
  // Titles are measured in Syne: measure again once it has loaded.
  document.fonts.ready.then(() => fitTitle(title.lastElementChild));
})();
