/* Jeff.Q Productions — the reel and everything that follows it: the title, the
   meta rows, the timeline needle and numbers. */

(() => {
  /* The projects; the ones still called Lorem ipsum are placeholders. A
     project can have `youtube` or `instagram` (where the film is: the meta's
     last row takes its name, with "Watch ↗")
     and `media: { src, poster, phone, volume, fps, ratio }` for its card: a
     film (.mp4 / .webm, looping while it is at the front; `poster` is its
     first frame, shown until it plays; `phone` is the same film cut square,
     each shot framed on what matters in it, and lighter, with its own
     poster, for phones' square cards; `volume` evens out how loud the films
     are; `fps` is its frame rate, for the timecode) or a
     picture, 16:9 filling the card or 1:1 set in its middle, as in the Figma
     placeholders ("Video 16:9", "Image 1:1"). Each film is 40 seconds of the
     whole one, cut to the card's shape. For its page (a click on its film at the front)
     a project can have `synopsis`, `credits` ([name, value] pairs) and
     `stills` (pictures, or [picture, the part of it its box shows]); until
     it does, the page has Lorem ipsum and the poster, cropped closer, stands
     in for stills. */
  const PROJECTS = [
    {
      title: 'Maison Solenne', type: 'Spec ad', year: '2026', runtime: '00:42',
      youtube: 'https://youtu.be/brSsx2kpb-Q',
      // A fashion ad for a made-up brand. From the start (the whole film is 42
      // seconds): the closed eyes to the dune's crest at sunset.
      media: { src: 'assets/films/desert.mp4', poster: 'assets/films/desert.jpg', phone: { src: 'assets/films/desert-phone.mp4', poster: 'assets/films/desert-phone.jpg' }, volume: 0.95, fps: 24 },
      synopsis: [
        'Maison Solenne is a spec ad for a concept brand. The idea was to take high-fashion editorial imagery out into the landscape and treat it like cinema. The visual language is simple: fluid silhouettes, deep crimson and a desert lit by a low evening sun. Most shots are backlit, so the figure becomes a shape and the fabric glows at its edges.',
        'The direction is built on contrasts: delicate movement against huge open space, sculptural fabric against the soft curves of the dunes, close-ups of skin against wide shots where the model is a small red mark. Together they give a brand with no products yet a look and a mood of its own.',
      ],
      credits: [['Role', 'Creative Director'], ['Music', 'Jakob Ahlbom']],
      // Frames of the film: the eyes (0:02), the dune at sunset (0:26), the
      // dress (0:30), the veil (0:33).
      stills: [
        'assets/stills/maison-1.jpg',
        ['assets/stills/maison-2.jpg', '55% 50%'],
        'assets/stills/maison-3.jpg',
        'assets/stills/maison-4.jpg',
      ],
    },
    {
      title: 'Mongolia', type: 'Spec ad', year: '2026', runtime: '01:30',
      youtube: 'https://youtu.be/-wct-PZAX8o',
      // From 0:43 of the first cut, where the music is fullest: the red rock
      // spire, the eagle, horses, wrestling and the bow, to the yurt at dusk.
      media: { src: 'assets/films/mongolia.mp4', poster: 'assets/films/mongolia.jpg', phone: { src: 'assets/films/mongolia-phone.mp4', poster: 'assets/films/mongolia-phone.jpg' }, volume: 0.45, fps: 24 },
      synopsis: [
        'Mongolia is a concept for a destination ad. Instead of selling a place to visit, it tries to give you the experience of being there: vast, remote and a little overwhelming. The landscapes do most of the talking, from red sandstone cliffs and white badlands to snowy peaks and green valleys, with no voiceover and no list of sights to tick off.',
        'I skipped the usual travel story and focused on the pull of the land. Open horizons, natural textures and feeling small in a huge space shaped every visual choice. Aerial shots show the scale, and close ones bring you into the dust of running horses or face to face with an archer.',
      ],
      credits: [['Role', 'Creative Director'], ['Music', 'Henry Miles']],
      // Her photos: the eagle hunter, the rider by the river, the yurt at
      // dusk, the archer.
      stills: [
        'assets/stills/mongolia-1.webp',
        'assets/stills/mongolia-2.webp',
        'assets/stills/mongolia-3.webp',
        'assets/stills/mongolia-4.webp',
      ],
    },
    {
      title: 'Ocean Wonders', type: 'Short film', year: '2025', runtime: '01:49',
      youtube: 'https://youtu.be/wvu-Rvvs_QU',
      // From 0:26, where the music comes in: the dolphin at sunset to the walruses.
      media: { src: 'assets/films/ocean.mp4', poster: 'assets/films/ocean.jpg', phone: { src: 'assets/films/ocean-phone.mp4', poster: 'assets/films/ocean-phone.jpg' }, volume: 1, fps: 24 },
      synopsis: [
        'Ocean Wonders is a mood piece about the beauty and mystery of life in the sea. There is no linear story and no narrator. The images carry the film on their own: vivid shapes, slow movements and underwater places most people will never see. The camera stays at the level of the animals, so the ocean feels close and enormous at once.',
        'The direction treats the ocean as a world bigger than we can take in. Scale, light and color keep shifting, from a jellyfish filling the frame to a humpback breaching, from a golden sunset to the cold Arctic blue. The slow pacing asks you to notice a place that stays mostly hidden.',
      ],
      credits: [['Role', 'Creative Director'], ['Music', 'Sam Will']],
      // Her photos: the turtle, the jellyfish, the whale breaching, the
      // narwhal.
      stills: [
        ['assets/stills/ocean-1.webp', '0% 50%'],
        'assets/stills/ocean-2.webp',
        ['assets/stills/ocean-3.webp', '56% 50%'],
        'assets/stills/ocean-4.webp',
      ],
    },
    {
      title: 'The Invasion', type: 'Short film', year: '2025', runtime: '01:32',
      youtube: 'https://youtu.be/MEgY6crlBdY',
      // From 0:32: the animals flee, the ships arrive, the attack.
      media: { src: 'assets/films/aliens.mp4', poster: 'assets/films/aliens.jpg', phone: { src: 'assets/films/aliens-phone.mp4', poster: 'assets/films/aliens-phone.jpg' }, volume: 0.8, fps: 24 },
      synopsis: [
        'The Invasion is a short film about the familiar meeting the unknown. It imagines the day the ships arrive and lets suspense, unease and awe build from shot to shot. Instead of the usual alien plot, it works through images and scale: ships over Rio, the Great Wall, the Kremlin and Giza, places so well known that anything above them feels wrong.',
        'Visually it is about how fragile we are next to something we can’t explain. The film is built on contrasts: silence and sudden noise, a lone child looking up and a whole fleet filling the sky, curiosity turning into fear. Atmosphere always comes before story, so the extraordinary feels close and unsettling.',
      ],
      credits: [['Role', 'Creative Director'], ['Music', 'Edgar Hopp']],
      // Her photos: the ship over the Eiffel Tower, the kid with the ice
      // cream, the kid flying a kite, the ship over the pyramid.
      stills: [
        'assets/stills/aliens-1.jpg',
        ['assets/stills/aliens-2.jpg', '26% 50%'],
        ['assets/stills/aliens-3.jpg', '68% 50%'],
        'assets/stills/aliens-4.jpg',
      ],
    },
    {
      title: 'Krakatoa 1883', type: 'Short film', year: '2025', runtime: '04:22',
      youtube: 'https://youtu.be/s6cfM57IhPw',
      // From 0:56: the eruption to "Heard in Perth".
      media: { src: 'assets/films/krakatoa.mp4', poster: 'assets/films/krakatoa.jpg', phone: { src: 'assets/films/krakatoa-phone.mp4', poster: 'assets/films/krakatoa-phone.jpg' }, volume: 0.5, fps: 30 },
      synopsis: [
        'Krakatoa 1883 is a cinematic take on the eruption of Krakatoa. It is not a history lesson. The eruption is a lens on scale, destruction and awe, and on forces no one can control. The volcano appears as fire, ash and lightning, its orange heat set against the cold gray sea, and the people of Batavia look small next to its fury.',
        'The direction is about the tension between nature’s beauty and its power to destroy. Still, quiet shots of the shore sit against the blast, distant views against faces up close, fragile people against immense power. The film leaves you asking where we stand in a world that can change in an instant.',
      ],
      credits: [['Role', 'Creative Director'], ['Music', 'Hampus Naeselius']],
      // Her photos: the eruption, the carriage in Batavia, the wave, the man
      // on the beach.
      stills: [
        'assets/stills/krakatoa-1.webp',
        ['assets/stills/krakatoa-2.webp', '42% 50%'],
        'assets/stills/krakatoa-3.webp',
        'assets/stills/krakatoa-4.webp',
      ],
    },
  ];

  const N = PROJECTS.length;
  // Each project's page has its own address, #its-title (#krakatoa-1883).
  PROJECTS.forEach((project) => (project.slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')));
  const projectAt = (hash) => PROJECTS.findIndex((project) => `#${project.slug}` === hash);
  const SITE = document.title;
  const META = ['type', 'year', 'runtime', 'watch'];
  // Where a film can be watched, in the order looked for; the last meta row
  // is named after it (YouTube when there is nowhere yet).
  const PLATFORMS = [['youtube', 'YouTube'], ['instagram', 'Instagram']];

  /* In the frame the side card's far edge meets the window edge at 400.63
     of its 440px height: that fixes the angle and the perspective. */
  const FAR_EDGE = 400.63 / 440;
  const CARD_RATIO = 440 / 794;  // the front card's height to its width
  const MIN_ROOM = 48;          // least space above and below the card
                                // (unless styles.css says --card-space)
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
  const FPS = 24;               // a film's frame rate, unless it has its own
  const TICKS = 4;              // ticks between columns on the 12-column grid;
                                // the timeline keeps their spacing
  const SLATS = 6;              // rows a title turns in, like a blind's slats
  const META_SLATS = 2;         // …and a meta value
  const SLAT_OUT = 300;         // ms for a slat to turn edge on
  const SLAT_IN = 560;          // …and to turn back flat with the new words
  const SLAT_STAGGER = 55;      // ms from one slat to the next
  const ROW_STAGGER = 45;       // ms from one row of Info or a page to the next
  const ROWS_AFTER = 350;       // ms into Info's or a page's slide before its
                                // rows turn in
  const LINKED_AFTER = 900;     // ms after the site comes in that a linked
                                // project's page rises
  const PEN_SPEED = 0.5;        // signature units a ms its pen draws at
  const PEN_FRAMES = 90;        // steps its one take is laid out in
  const EMAIL_MIN = 14;         // px Info's email shrinks to before it wraps
  const CURSOR_FOLLOW = 20;     // spring rate the cursor eases after the mouse
  const CURSOR_STRETCH = 0.08;  // how far it stretches for each card a second
                                // the reel runs at…
  const CURSOR_STRETCH_MAX = 0.4; // …and at most
  const RING_RADIUS = 43.87;    // px of the circle the cursor's words run round
  const RING_TRACK = 2;         // px or so between their letters

  const MUTED = '#8b8984';
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const reel = document.querySelector('.reel');
  const stage = reel.querySelector('.reel__stage');
  const title = document.querySelector('.title');
  const metaValues = Object.fromEntries(META.map((key) => [key, document.querySelector(`[data-meta="${key}"]`)]));
  const watchKey = document.querySelector('[data-meta-key="watch"]');
  const timeline = document.querySelector('.timeline');
  const ticks = timeline.querySelector('.timeline__ticks');
  const needles = [...timeline.querySelectorAll('.needle')];
  const labels = timeline.querySelector('.timeline__labels');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const mod = (n, m) => ((n % m) + m) % m;
  const wrap = (d) => mod(d + N / 2, N) - N / 2;   // nearest way round the loop
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- Build ---------- */

  // On a phone, a film's square cut, where it has one.
  const phone = matchMedia('(max-width: 639px)');
  const filmFor = (media) => (phone.matches && media.phone) || media;

  const cards = PROJECTS.map((project, i) => {
    const card = document.createElement('div');
    card.className = 'reel__card';
    card.dataset.index = i;
    if (project.media) {
      const film = /\.(mp4|webm)$/i.test(project.media.src);
      const media = document.createElement(film ? 'video' : 'img');
      media.className = 'reel__media';
      const { src, poster } = filmFor(project.media);
      media.src = src;
      media.dataset.ratio = project.media.ratio || '16:9';
      if (film) {
        Object.assign(media, { muted: true, loop: true, playsInline: true, preload: 'metadata' });
        media.setAttribute('muted', '');
        if (poster) media.poster = poster;
        media.dataset.volume = project.media.volume ?? VOLUME;
        media.dataset.fps = project.media.fps || FPS;
        media.addEventListener('timeupdate', () => showTime(media));
      } else {
        media.alt = '';
      }
      card.append(media);
      card.classList.add('has-media');
      if (film) {
        // Over the film while it plays, its timecode; and how far into it
        // the reel has seen.
        const time = document.createElement('span');
        time.className = 'reel__time label';
        time.setAttribute('aria-hidden', 'true');
        time.textContent = timecode(0, FPS);
        const played = document.createElement('span');
        played.className = 'reel__played';
        played.setAttribute('aria-hidden', 'true');
        card.append(time, played);
      }
    }
    stage.append(card);
    return card;
  });

  timeline.style.setProperty('--count', N);
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
    // The card's height to its width: CARD_RATIO, or on phones square, and
    // taller (to --card-ratio-max) where the screen has the room.
    const ratio = parseFloat(style.getPropertyValue('--card-ratio')) || CARD_RATIO;
    const tallest = parseFloat(style.getPropertyValue('--card-ratio-max')) || ratio;
    const space = parseFloat(style.getPropertyValue('--card-space')) || MIN_ROOM;
    const width = reel.clientWidth;
    const room = reel.clientHeight;

    const col = (width - 2 * margin - 11 * gutter) / 12;
    let w = frontCols * col + (frontCols - 1) * gutter;
    let h = Math.min(Math.max(w * ratio, room - 2 * space), w * tallest);
    if (h > room - 2 * space) {
      h = Math.max(room - 2 * space, 120);
      w = h / ratio;
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

    // The timeline is cut into one slot a project, gutters between, like
    // the grid's columns; its ticks keep the 12-column grid's spacing.
    const lineWidth = timeline.clientWidth;
    const lineCol = (lineWidth - (N - 1) * gutter) / N;
    const gridUnit = (lineWidth - 11 * gutter) / 12 + gutter;
    const ticksPer = Math.max(2, Math.round(((lineCol + gutter) / gridUnit) * TICKS));
    geo = { w, h, gap: gutter, fold, cos, sin, perspective, dragUnit, line: { width: lineWidth, col: lineCol, unit: lineCol + gutter, ticks: ticksPer } };

    drawTicks();
    fitTitle(title.lastElementChild);
    if (infoOpen) fitEmail();
    if (projectOpen) fitWords(projectPage.querySelector('.project__title'));
    render();
  }

  /* Timeline rule: a long tick over each slot's centre (one per project),
     short ones between, all on whole pixels so they stay sharp. */
  const tickX = (n) => Math.round(n) + 0.5;

  function drawTicks() {
    const { width, col, unit, ticks: per } = geo.line;
    const step = unit / per;
    let short = '';
    let long = '';
    for (let j = -Math.floor(col / 2 / step); ; j++) {
      const at = col / 2 + j * step;
      if (at >= width) break;
      if (at < 0) continue;
      if (mod(j, per) !== 0) short += `M${tickX(at)} 1V7`;
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

    // The needle runs past the last project and comes back on at the start,
    // like the reel.
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
      // The last row's name turns with its value, but only when it changes.
      [watchKey, 'meta__key', (project) => platformOf(project)[1], META_SLATS, 120 + (META.length - 1) * 70, true],
    ];
    rows.forEach(([box, className, value, slats, delay, onChange]) => {
      box.replaceChildren();
      const el = words(className, value(PROJECTS[index]));
      box.append(el);
      if (box === title) fitTitle(el);
      if (!turn || (onChange && value(PROJECTS[from]) === value(PROJECTS[index]))) return;
      const old = words(className, value(PROJECTS[from]));
      box.append(old);
      if (box === title) fitTitle(old);
      blinds(box, old, el, slats, direction, delay);
    });
    buttons.forEach((button, i) => button.setAttribute('aria-current', i === index ? 'true' : 'false'));
    cards.forEach((card, i) => card.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
  }

  // [key, name] of where the project's film can be watched.
  const platformOf = (project) => PLATFORMS.find(([key]) => project[key]) || [null, PLATFORMS[0][1]];

  // The last row links out to the film; a project without one has a dash.
  function metaValue(project, key) {
    if (key !== 'watch') return project[key];
    const [platform, name] = platformOf(project);
    if (!platform) return '—';
    const link = document.createElement('a');
    link.className = 'link watch';
    link.href = project[platform];
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Watch ↗';
    link.setAttribute('aria-label', `Watch ${project.title} on ${name}`);
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

  /* The film on the front card plays once the reel is at rest on it, silent
     until the visitor turns the sound on (Sound, in the bar); from then on
     the films play with it, until they turn it off. The moment
     the reel moves it stops, and each film keeps its place: whenever the
     reel comes back to it, it picks up where it stopped. While it plays its
     timecode runs at the bottom right, and a pink line along its foot shows
     how far it has got (it stays on a film the reel has left). No films for
     reduced motion: the poster stays. */
  const films = cards.map((card) => card.querySelector('video'));
  let playing = null;   // the film playing, if any
  let sound = false;    // the visitor wants sound (they turn it on and off)

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

  // Sound in the bar is pressed while the visitor wants sound, and moves
  // while a film is heard.
  const soundButton = document.querySelector('.sound');

  function showSound() {
    films.forEach((video, i) => {
      if (video) cards[i].classList.toggle('is-playing', video === playing);
    });
    soundButton.setAttribute('aria-pressed', String(sound));
    soundButton.classList.toggle('is-heard', Boolean(playing && !playing.muted));
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
    if (sound) playHeard(video);
    else playSilent(video);
    showSound();
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  }

  // A film's place, hours to frames.
  function timecode(time, fps) {
    const frames = Math.floor(time * fps + 1e-6);
    const s = Math.floor(frames / fps);
    return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, frames % fps].map(pad).join(':');
  }

  function showTime(video) {
    const card = video.parentElement;
    const time = card.querySelector('.reel__time');
    const text = timecode(video.currentTime, Number(video.dataset.fps));
    if (time.textContent !== text) time.textContent = text;
    card.style.setProperty('--played', video.duration ? (video.currentTime / video.duration).toFixed(4) : 0);
    card.classList.toggle('has-played', video.currentTime > 0);
  }

  // Frame by frame while a film plays.
  let ticking = false;
  function tick() {
    if (!playing) {
      ticking = false;
      return;
    }
    showTime(playing);
    requestAnimationFrame(tick);
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
    if (infoOpen || projectOpen || root.classList.contains('is-loading') || root.classList.contains('is-moving') || document.hidden) return;
    const index = mod(Math.round(pos), N);
    films.forEach((video, i) => {
      if (!video || i === index) return;
      video.fadeId = (video.fadeId || 0) + 1;
      video.pause();
    });
    const video = films[index];
    if (video && video !== playing && !reduceMotion.matches) startFilm(video);
  }

  function toggleSound() {
    sound = !sound;
    if (playing && sound) playHeard(playing);
    else if (playing) playing.muted = true;
    showSound();
  }
  soundButton.addEventListener('click', toggleSound);

  // Into or out of a phone's layout, each card takes the film for its shape
  // (square or wide), keeping its place; the one playing plays on.
  phone.addEventListener('change', () => {
    films.forEach((video, i) => {
      if (!video) return;
      const { src, poster } = filmFor(PROJECTS[i].media);
      if (video.getAttribute('src') === src) return;
      const at = video.currentTime;
      const wasPlaying = video === playing;
      if (wasPlaying) playing = null;
      video.poster = poster || '';
      video.src = src;
      if (at) video.addEventListener('loadedmetadata', () => (video.currentTime = at), { once: true });
      if (wasPlaying) startFilm(video);
    });
  });

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
      aimCursor();
    }
  }

  function wake() {
    if (running) return;
    running = true;
    root.classList.add('is-moving');
    stopFilm();
    last = performance.now();
    requestAnimationFrame(frame);
    aimCursor();
    wakeCursor();
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
    if (e.pointerType === 'mouse' && !zoneAt(e.clientY, e.target)) return;
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
      if (!card || cancelled) return;
      // On the film at the front a click opens its page (the cursor says
      // Open); on another it turns the reel to that one.
      if (card.classList.contains('is-front') && !root.classList.contains('is-moving')) {
        if (projectReady()) openProject(Number(card.dataset.index));
      } else goTo(Number(card.dataset.index));
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
    if (infoOpen) {
      if (e.key === 'Escape') closeInfo();
      return;
    }
    if (projectOpen) {
      if (e.key === 'Escape') closeProject();
      return;
    }
    // Enter on the reel opens the film at the front, like a click on it.
    if ((e.key === 'Enter' || e.key === ' ') && e.target === reel) {
      e.preventDefault();
      if (projectReady()) openProject(current);
      return;
    }
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    target = Math.round(target) + step;
    wake();
  });

  /* ---------- Info ---------- */

  /* Info slides in from the right over the page from column 7, which dims
     behind it, and its rows turn in one after another like the slats of a
     blind (rows side by side together, the description line by line). Close,
     Esc or a click on the page closes it. The films wait while it is open. */
  const info = document.querySelector('.info');
  const infoOpener = document.querySelector('.info-open');
  const infoCloser = info.querySelector('.info__close');
  const paragraphs = info.querySelectorAll('.info__description p');
  const email = info.querySelector('.info__email');
  const address = email.textContent.trim();
  let infoOpen = false;

  // The description word by word, so its lines can turn one after another.
  for (const p of paragraphs) {
    p.replaceChildren(...p.textContent.trim().split(/\s+/).flatMap((word, i) => {
      const span = document.createElement('span');
      span.className = 'info__word';
      span.textContent = word;
      return i ? [' ', span] : [span];
    }));
  }

  // The email on one line: one wider than the panel is set smaller to fit,
  // down to EMAIL_MIN; past that it breaks after the @ instead.
  function fitEmail() {
    email.style.fontSize = '';
    email.classList.remove('is-wrapped');
    email.textContent = address;
    const room = email.parentElement.clientWidth;
    if (email.scrollWidth <= room) return;
    const size = (parseFloat(getComputedStyle(email).fontSize) * room) / email.scrollWidth;
    email.style.fontSize = `${Math.max(size, EMAIL_MIN)}px`;
    if (size >= EMAIL_MIN) return;
    const at = address.indexOf('@') + 1;
    email.replaceChildren(address.slice(0, at), document.createElement('wbr'), address.slice(at));
    email.classList.add('is-wrapped');
  }

  /* Rows turn in their turn down a sheet (Info, a project's page) like the
     title's slats; rows level with each other turn together, and pictures
     open from the top. Where a row is, is measured from the sheet's top, so
     it holds while the sheet is still sliding in. */
  function turnRowsIn(sheet, rows, delay) {
    if (reduceMotion.matches) return;
    const from = sheet.getBoundingClientRect().top;
    const top = (row) => Math.round(row.getBoundingClientRect().top - from);
    const levels = [...new Set(rows.map(top))].sort((a, b) => a - b);
    rows.forEach((row) => {
      const at = delay + levels.indexOf(top(row)) * ROW_STAGGER;
      row.getAnimations().forEach((a) => a.cancel());
      if (row.classList.contains('project__still')) {
        row.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }], {
          duration: 1000, delay: at, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards',
        });
      } else {
        row.animate([{ transform: 'perspective(600px) rotateX(-90deg)' }, { transform: 'none' }], {
          duration: SLAT_IN, delay: at, easing: 'cubic-bezier(0.3, 1.45, 0.6, 1)', fill: 'backwards',
        });
      }
    });
  }

  function turnInfoIn() {
    turnRowsIn(info, [...info.querySelectorAll('.info__line, .info__word, .info__list dt, .info__list dd, .info__contact > *')], ROWS_AFTER);
  }

  function openInfo() {
    if (infoOpen) return;
    infoOpen = true;
    stopFilm();
    hero.inert = true;
    root.classList.add('is-info');
    infoOpener.setAttribute('aria-expanded', 'true');
    history.replaceState(null, '', '#info');
    fitEmail();
    turnInfoIn();
    infoCloser.focus({ preventScroll: true });
    aimCursor();
  }

  function closeInfo() {
    if (!infoOpen) return;
    infoOpen = false;
    const focused = info.contains(document.activeElement);
    hero.inert = false;
    root.classList.remove('is-info');
    infoOpener.setAttribute('aria-expanded', 'false');
    history.replaceState(null, '', location.pathname + location.search);
    if (focused) infoOpener.focus({ preventScroll: true });
    restFilms();
    aimCursor();
  }

  infoOpener.addEventListener('click', (e) => {
    e.preventDefault();
    openInfo();
  });
  infoCloser.addEventListener('click', closeInfo);
  document.querySelector('.info-scrim').addEventListener('click', closeInfo);

  /* ---------- Project page ---------- */

  /* A click on the film at the front opens its project's page over the whole screen, up
     from the bottom with Info's motion, the reel dimming behind it, its rows
     turning in as Info's do (Figma "project-page"). On the left, staying put:
     the number and title, the meta and credits side by side, the synopsis;
     on the right, scrolling by: the stills. Where to watch the film closes
     the credits. Close or Esc closes it. The films wait while it is open.
     Open, the page has the project's address and the project's name in the
     tab, so it can be sent; Back closes it and Forward opens it again. */
  const SYNOPSIS = [
    'Lorem ipsum dolor sit amet consectetur. Feugiat egestas tristique ac tellus tempus est metus natoque. Elit vitae dignissim at eget egestas interdum aliquet arcu. Sit justo bibendum est mauris pretium. Et a aliquam mattis leo lacus enim.',
    'A ullamcorper nulla lacus nulla eget ut justo velit. Tincidunt venenatis arcu orci placerat adipiscing rhoncus donec non malesuada. Lorem quis elit at turpis. Nulla egestas tellus vel aliquet fames enim iaculis a. Elementum vitae aliquam velit porttitor faucibus sapien. Lobortis ante nunc lectus at molestie lobortis. Eget facilisi quam nunc nulla.',
    'Volutpat quam tincidunt ac libero urna rhoncus ante quis nulla. Eget enim sed sagittis nisi tristique vivamus enim risus enim. Molestie id gravida varius tempus. In ipsum sodales bibendum tempor vitae lobortis. Massa in semper nunc nibh quam ac. Pellentesque fames enim massa scelerisque viverra ullamcorper nisl euismod amet. Viverra ornare vulputate lacus vestibulum ac enim eget pellentesque. Est justo aliquam phasellus quis amet.',
  ];
  const CREDITS = [['Role', 'Creative Director'], ['Music', 'Lorem ipsum']];
  const CROPS = [[1, '50% 50%'], [2.2, '22% 62%'], [2.6, '80% 45%'], [1.6, '60% 30%']]; // [zoom, at]

  const projectPage = document.querySelector('.project');
  const projectScroll = projectPage.querySelector('.project__scroll');
  const projectCloser = projectPage.querySelector('.project__close');
  let projectOpen = false;

  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  // Word by word, so the lines can turn in one after another.
  const wordsOf = (text) => text.split(' ').flatMap((word, i) => (i ? [' ', make('span', 'project__word', word)] : [make('span', 'project__word', word)]));

  function projectList(rows, className = '') {
    const list = make('dl', `project__list label ${className}`.trim());
    rows.forEach(([key, value]) => {
      const row = make('div');
      const dd = make('dd');
      dd.append(value);
      row.append(make('dt', null, key), dd);
      list.append(row);
    });
    return list;
  }

  // The project's stills; until it has them, its poster and closer crops of
  // it (a grey card without one).
  function stillsOf(project) {
    const poster = project.media && (project.media.poster || (/\.(jpe?g|png|webp)$/i.test(project.media.src) ? project.media.src : null));
    const pictures = project.stills
      ? project.stills.map((still) => {
        const [src, at] = [].concat(still);
        return [src, at && { objectPosition: at }];
      })
      : CROPS.map(([zoom, at]) => [poster, zoom !== 1 && { transform: `scale(${zoom})`, transformOrigin: at }]);
    return pictures.map(([src, style]) => {
      const box = make('div', 'project__still');
      if (src) {
        const img = make('img');
        img.src = src;
        img.alt = '';
        if (style) Object.assign(img.style, style);
        box.append(img);
      }
      return box;
    });
  }

  function fillProject(i) {
    const project = PROJECTS[i];
    const heading = make('h2', 'project__title');
    heading.append(...wordsOf(project.title));
    const facts = make('div', 'project__facts');
    facts.append(
      projectList(META.filter((key) => key !== 'watch').map((key) => [key[0].toUpperCase() + key.slice(1), metaValue(project, key)])),
      projectList([...(project.credits || CREDITS), [platformOf(project)[1], metaValue(project, 'watch')]], 'project__credits'),
    );
    const synopsis = make('div', 'project__synopsis');
    synopsis.append(...[].concat(project.synopsis || SYNOPSIS).map((text) => {
      const p = make('p');
      p.append(...wordsOf(text));
      return p;
    }));
    const side = make('div', 'project__side');
    side.append(make('span', 'label project__number project__turn', `${pad(i + 1)} / ${pad(N)}`), heading, facts, synopsis, signature());
    const media = make('div', 'project__media');
    media.append(...stillsOf(project));
    const grid = make('div', 'project__grid');
    grid.append(side, media);
    projectScroll.replaceChildren(grid);
    projectScroll.scrollTop = 0;
    fitWords(heading);
    sideWatch.disconnect();
    sideWatch.observe(projectScroll);
    sideWatch.observe(side);
  }

  // Jeff's signature at the foot of the text. The pen draws it again in
  // one take as the page opens and whenever it is pointed at.
  const signatureTemplate = document.getElementById('signature');

  function signature() {
    const mark = signatureTemplate.content.firstElementChild.cloneNode(true);
    mark.addEventListener('pointerenter', () => drawSignature(mark));
    return mark;
  }

  // The pen eases in at the start and out at the end of the whole
  // signature, not of each stroke, and goes straight on from one stroke to
  // the next.
  const penEase = (t) => (1 - Math.cos(Math.PI * t)) / 2;

  function drawSignature(mark, delay = 0) {
    if (reduceMotion.matches || mark.getAnimations({ subtree: true }).length) return;
    const strokes = [...mark.querySelectorAll('mask path')];
    const lengths = strokes.map((stroke) => stroke.getTotalLength());
    const total = lengths.reduce((sum, length) => sum + length, 0);
    let before = 0;
    strokes.forEach((stroke, k) => {
      const length = lengths[k];
      const frames = [];
      for (let f = 0; f <= PEN_FRAMES; f++) {
        const drawn = penEase(f / PEN_FRAMES) * total - before;
        frames.push({ strokeDashoffset: drawn > 0 ? Math.max(0, length - drawn) : length + 2 });
      }
      // A gap longer than the stroke, so only the one dash ever shows.
      stroke.style.strokeDasharray = `${length} ${length + 8}`;
      stroke.animate(frames, { duration: total / PEN_SPEED, delay, fill: 'backwards' });
      before += length;
    });
  }

  // The side stays put while the stills scroll by; one taller than the
  // screen scrolls until its foot is in view, then stays.
  const sideWatch = new ResizeObserver(() => {
    const side = projectScroll.querySelector('.project__side');
    if (side) side.style.top = `${Math.min(0, projectScroll.clientHeight - side.offsetHeight)}px`;
  });

  // A heading whose longest word is wider than its column is set smaller.
  function fitWords(box) {
    box.style.fontSize = '';
    let size = parseFloat(getComputedStyle(box).fontSize);
    for (let k = 0; k < 20 && box.scrollWidth > box.clientWidth + 0.5; k++) {
      size *= 0.95;
      box.style.fontSize = `${size}px`;
    }
  }

  // What is on the page's first screen turns in as it opens; the rest is
  // simply there when it scrolls up.
  function turnProjectIn(delay) {
    const room = projectPage.clientHeight;
    const from = projectPage.getBoundingClientRect().top;
    const rows = [...projectScroll.querySelectorAll('.project__word, .project__turn, .project__list dt, .project__list dd, .project__still')]
      .filter((row) => row.getBoundingClientRect().top - from < room);
    turnRowsIn(projectPage, rows, delay);
  }

  function openProject(i, { push = true } = {}) {
    if (projectOpen) return;
    projectOpen = true;
    const address = `#${PROJECTS[i].slug}`;
    if (push && location.hash !== address) history.pushState({ project: i }, '', address);
    document.title = `${PROJECTS[i].title} — ${SITE}`;
    stopFilm();
    hero.inert = true;
    fillProject(i);
    root.classList.add('is-project');
    turnProjectIn(ROWS_AFTER);
    const mark = projectScroll.querySelector('.signature');
    if (mark.getBoundingClientRect().top - projectPage.getBoundingClientRect().top < projectPage.clientHeight) drawSignature(mark, ROWS_AFTER + 600);
    projectCloser.focus({ preventScroll: true });
    aimCursor();
  }

  // Back to the address it was opened from (or, when the visitor came
  // straight to the page, to the site's own).
  function closeProject({ pop = false } = {}) {
    if (!projectOpen) return;
    projectOpen = false;
    document.title = SITE;
    if (!pop && history.state && history.state.project !== undefined) history.back();
    else if (!pop) history.replaceState(null, '', location.pathname + location.search);
    const focused = projectPage.contains(document.activeElement);
    hero.inert = false;
    scrolling = false;
    root.classList.remove('is-project');
    if (focused) reel.focus({ preventScroll: true });
    restFilms();
    aimCursor();
  }

  // A project's page opens only with the reel at rest.
  const projectReady = () => !['is-moving', 'is-loading', 'is-info'].some((name) => root.classList.contains(name));
  projectCloser.addEventListener('click', () => closeProject());

  // Straight to a project, without turning the reel.
  function jump(i) {
    target = pos = Math.round(pos) + wrap(i - mod(Math.round(pos), N));
    velocity = 0;
    render();
  }

  addEventListener('popstate', () => {
    const i = projectAt(location.hash);
    if (i === -1) closeProject({ pop: true });
    else if (!projectOpen) {
      jump(i);
      openProject(i, { push: false });
    }
  });

  /* The wheel scrolls the page smoothly: it moves where the page is headed
     and the page eases there. Touch, keys and pinch scroll as they always
     do, and stop the easing. */
  const SCROLL_EASE = 0.1;   // of the way there each 60th of a second
  let scrollAt = 0;          // where the page is, unrounded
  let scrollTo = 0;          // where the wheel has sent it
  let scrolling = false;

  projectScroll.addEventListener('wheel', (e) => {
    if (e.ctrlKey || reduceMotion.matches) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? projectScroll.clientHeight : 1;
    const max = projectScroll.scrollHeight - projectScroll.clientHeight;
    if (!scrolling) scrollAt = scrollTo = projectScroll.scrollTop;
    scrollTo = Math.min(max, Math.max(0, scrollTo + e.deltaY * unit));
    if (scrolling) return;
    scrolling = true;
    let last = performance.now();
    requestAnimationFrame(function step(now) {
      if (!scrolling) return;
      const frames = Math.min(now - last, 100) / (1000 / 60);
      last = now;
      scrollAt += (scrollTo - scrollAt) * (1 - (1 - SCROLL_EASE) ** frames);
      if (Math.abs(scrollTo - scrollAt) < 0.5) {
        scrollAt = scrollTo;
        scrolling = false;
      }
      projectScroll.scrollTop = scrollAt;
      if (scrolling) requestAnimationFrame(step);
    });
  }, { passive: false });

  projectScroll.addEventListener('scroll', () => {
    if (scrolling && Math.abs(projectScroll.scrollTop - scrollAt) > 2) scrolling = false;
  }, { passive: true });

  /* ---------- Cursor ---------- */

  /* With a mouse, over the reel's zone a disc with Drag running round it;
     over the film at the front, with the reel at rest, Open project (a click
     there opens the project's page). It eases after the mouse and stretches with the reel as it runs, and its words turn
     with the reel (--roll, in cards run). */
  const cursor = document.querySelector('.cursor');
  const cursorBody = cursor.querySelector('.cursor__body');
  const mouse = matchMedia('(hover: hover) and (pointer: fine)');
  let pointer = null;             // where the mouse is, while it is on the page
  const drawn = { x: 0, y: 0 };   // where the cursor is
  let cursorState = '';
  let cursorRunning = false;
  let cursorLast = 0;
  let roll = 0;                   // how far the reel has run, in cards
  let ringFitted = false;

  /* Each phrase round the circle as many whole times as leaves its letters
     about RING_TRACK apart (never squeezed), so Drag and Open project are
     spaced alike; the circle's length closes it exactly. Measured once the
     cursor shows (it can't be measured hidden), again once Geist is in. */
  function fitRing() {
    const round = 2 * Math.PI * RING_RADIUS;
    for (const path of cursor.querySelectorAll('textPath')) {
      const words = path.dataset.words;
      path.removeAttribute('textLength');
      let best = 1;
      let bestOff = Infinity;
      for (let times = 1; times < 20; times++) {
        path.textContent = words.repeat(times);
        const length = path.getComputedTextLength();
        if (!length) return;
        if (length > round) break;
        const off = Math.abs((round - length) / (words.length * times) - RING_TRACK);
        if (off < bestOff) [best, bestOff] = [times, off];
      }
      path.textContent = words.repeat(best);
      path.setAttribute('textLength', round.toFixed(1));
    }
    ringFitted = true;
  }
  document.fonts.ready.then(() => (ringFitted = false));

  /* Where the reel answers the mouse: a strip edge to edge from the front
     card's top to halfway between its foot and the title. There the disc
     shows and a drag starts; above and below it, the pointer, and a press
     does nothing. */
  function zoneAt(y, el) {
    if (!(el instanceof Element) || !el.closest('.reel')) return false;
    const box = reel.getBoundingClientRect();
    const top = box.top + (box.height - geo.h) / 2;
    const bottom = box.bottom - (box.height - geo.h) / 4;
    return y >= top && y <= bottom;
  }

  function stateAt(el) {
    // With Info or a project's page open, the pointer (a click on the page
    // dimmed beside Info still closes it).
    if (infoOpen || projectOpen) return '';
    if (dragging && dragging.moved) return 'drag';
    if (!zoneAt(pointer.y, el)) return '';
    if (!root.classList.contains('is-moving') && el.closest('.reel__card.is-front')) return 'open';
    return 'drag';
  }

  function aimCursor() {
    if (!mouse.matches) return;
    const state = pointer ? stateAt(document.elementFromPoint(pointer.x, pointer.y)) : '';
    if (state === cursorState) return;
    if (!cursorState && pointer) Object.assign(drawn, pointer); // it appears where the mouse is
    cursorState = state;
    cursor.dataset.state = state;
    if (state && !ringFitted) fitRing();
    wakeCursor();
  }

  function wakeCursor() {
    if (cursorRunning || !mouse.matches) return;
    cursorRunning = true;
    cursorLast = performance.now();
    requestAnimationFrame(cursorFrame);
  }

  function cursorFrame(now) {
    const dt = Math.min(now - cursorLast, 100) / 1000;
    cursorLast = now;
    if (pointer) {
      const k = reduceMotion.matches ? 1 : 1 - Math.exp(-CURSOR_FOLLOW * dt);
      drawn.x += (pointer.x - drawn.x) * k;
      drawn.y += (pointer.y - drawn.y) * k;
    }
    const stretch = cursorState === 'drag' && !reduceMotion.matches
      ? Math.min(Math.abs(velocity) * CURSOR_STRETCH, CURSOR_STRETCH_MAX) : 0;
    cursor.style.transform = `translate3d(${drawn.x.toFixed(2)}px, ${drawn.y.toFixed(2)}px, 0)`;
    cursorBody.style.transform = `scale(${(1 + stretch).toFixed(3)}, ${(1 - stretch / 2).toFixed(3)})`;
    if (velocity) {
      roll += velocity * dt;
      cursor.style.setProperty('--roll', roll.toFixed(4));
    }
    const caught = !pointer || Math.hypot(pointer.x - drawn.x, pointer.y - drawn.y) < 0.1;
    if (caught && !running) cursorRunning = false;
    else requestAnimationFrame(cursorFrame);
  }

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer = { x: e.clientX, y: e.clientY };
    aimCursor();
    wakeCursor();
  }, { passive: true });
  // Off the page.
  document.addEventListener('pointerout', (e) => {
    if (e.relatedTarget) return;
    pointer = null;
    aimCursor();
  });
  addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') cursor.classList.add('is-pressed');
  });
  ['pointerup', 'pointercancel'].forEach((type) => addEventListener(type, () => {
    cursor.classList.remove('is-pressed');
    requestAnimationFrame(aimCursor);
  }));
  const fitCursor = () => root.classList.toggle('has-cursor', mouse.matches);
  fitCursor();
  mouse.addEventListener('change', fitCursor);

  /* ---------- Start ---------- */

  measure();
  if (location.hash === '#info') openInfo();
  // A link to a project's page: the reel starts on the project, and its page
  // rises once the site has come in.
  const linked = projectAt(location.hash);
  if (linked !== -1) {
    jump(linked);
    const rise = () => setTimeout(() => openProject(linked, { push: false }), LINKED_AFTER);
    if (!root.classList.contains('is-loading')) rise();
    else {
      const watch = new MutationObserver(() => {
        if (root.classList.contains('is-loading')) return;
        watch.disconnect();
        rise();
      });
      watch.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
  }
  restFilms();
  addEventListener('resize', measure);
  // Titles are measured in Syne: measure again once it has loaded.
  document.fonts.ready.then(() => fitTitle(title.lastElementChild));
})();
