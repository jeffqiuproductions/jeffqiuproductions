/* Loader — the name in the middle of the plain black, made of dust like the
   backdrop's. Its letters start as faint dust inside a dotted outline and
   fill from the left with bright grains as the page loads, a brighter front
   running ahead of the fill. At 100 the loader runs up off the screen and
   the page follows it up, the way a projector moves on to the next frame,
   its parts coming up into place as it arrives. Without WebGL the name fills
   as plain type. */

(() => {
  // Once the loader has run, it runs quicker for the rest of the visit.
  const SEEN = 'jeffq-loaded';
  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN) === '1';
  } catch {}

  const MIN_TIME = seen ? 700 : 1600;  // ms the fill takes at least, so it is seen
  const MAX_WAIT = 4000;    // ms it waits for any one thing at most
  const HOLD = 200;         // ms the name stays full before it goes
  const ADVANCE = 900;      // ms for the loader to run up and the page to follow
  const FADE = 900;         // ms it fades instead, with reduced motion
  const SPEED = 0.018;      // the backdrop's drift and warp (backdrop.js), so
  const SCALE = 0.7;        // the letters' grains move as its dust does

  const root = document.documentElement;
  const loader = document.querySelector('.loader');
  // No loader, or the page already gave up waiting for it (index.html).
  if (!loader || !root.classList.contains('is-loading')) {
    root.classList.remove('is-loading');
    return;
  }
  window.loaderRunning = true;
  loader.classList.add('is-open');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 4);
  const easeInOut = (t) => (t = clamp(t), t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2);

  /* ---------- Progress ---------- */

  /* What the page really waits for — its fonts, the window's load, the reel's
     pictures (for a film, its poster) — but no faster than a clock of
     MIN_TIME that moves in bursts and holds, the way a load does, and none of
     it longer than MAX_WAIT. It only ever goes up. */
  const CLOCK = [[0, 0], [0.1, 0.07], [0.2, 0.12], [0.34, 0.38], [0.46, 0.44], [0.62, 0.71], [0.74, 0.78], [0.88, 0.94], [1, 1]];
  const picture = (media) => (media.tagName === 'VIDEO' ? Object.assign(new Image(), { src: media.poster }) : media);
  const waits = [
    document.fonts.ready,
    new Promise((done) => (document.readyState === 'complete' ? done() : addEventListener('load', done, { once: true }))),
    ...[...document.querySelectorAll('.reel__media')].map(picture).map((pic) => new Promise((done) => {
      if (pic.complete) return done();
      pic.addEventListener('load', done, { once: true });
      pic.addEventListener('error', done, { once: true });
    })),
  ].map((wait) => Promise.race([wait, new Promise((done) => setTimeout(done, MAX_WAIT))]));
  let ready = 0;
  waits.forEach((wait) => wait.then(() => ready++));

  const began = performance.now();
  let progress = 0;
  let last = began;

  function measure(now) {
    const k = clamp((now - began) / MIN_TIME);
    let i = 1;
    while (CLOCK[i][0] < k) i++;
    const [k0, v0] = CLOCK[i - 1];
    const [k1, v1] = CLOCK[i];
    const s = clamp((k - k0) / (k1 - k0));
    const clock = v0 + (v1 - v0) * s * s * (3 - 2 * s);
    const real = ready / waits.length;
    const target = Math.max(Math.min(clock, real < 1 ? real * 0.95 : 1), progress);
    const dt = Math.min(now - last, 100) / 1000;
    last = now;
    progress += (target - progress) * (1 - Math.exp(-dt * 10));
    if (target - progress < 0.002) progress = target;
    return progress;
  }

  /* ---------- Screen ---------- */

  /* The name is set in the page as type (a word a span, so a phone can stack
     them) and the canvas draws it from where its letters fall; under it,
     Loading and the count, as wide as the name. */
  const centre = document.createElement('div');
  centre.className = 'loader__centre';
  const name = document.createElement('div');
  name.className = 'loader__name';
  name.setAttribute('aria-hidden', 'true');
  name.innerHTML = '<span>Jeff.Q</span> <span>Productions</span>';
  const row = document.createElement('div');
  row.className = 'loader__row label loader__type';
  const label = document.createElement('span');
  label.textContent = 'Loading';
  const number = document.createElement('span');
  number.className = 'loader__number';
  number.textContent = '0%';
  row.append(label, number);
  centre.append(name, row);
  loader.append(centre);

  // Its type shows once Syne and Geist are in.
  const fonts = Promise.all([
    document.fonts.load('800 100px Syne', 'JEFF.Q PRODUCTIONS'),
    document.fonts.load('500 12px Geist', 'LOADING PICTURE START 0123456789%'),
  ]).catch(() => {});
  fonts.then(() => loader.classList.add('has-fonts'));

  /* ---------- Name in dust ---------- */

  const VERTEX = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;

  const FRAGMENT = `
    precision highp float;
    uniform sampler2D uMask;  // r: the letters, g: their outline, b: a soft glow round them
    uniform vec2 uRes;        // device px
    uniform float uDpr;
    uniform float uTime;      // the backdrop's clock
    uniform float uSec;       // seconds, for the fill's front
    uniform float uScale;     // css px per unit of the backdrop's warp
    uniform vec4 uBox;        // the letters' ink, device px, y up: left, bottom, right, top
    uniform float uFill;      // 0…1
    uniform float uShow;      // the empty letters coming in, 0…1
    uniform float uFade;      // 1, or less as it fades out instead

    // 3D simplex noise — Ian McEwan, Stefan Gustavson (Ashima Arts), MIT.
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    // Hash without sine — Dave Hoskins, MIT.
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    const vec3 INK = vec3(241.0, 239.0, 233.0) / 255.0;   // --color-ink

    void main() {
      vec2 f = gl_FragCoord.xy;

      // The backdrop's warp: its grains ride it, and so do these.
      vec2 p = f / uDpr / uScale;
      vec2 q = vec2(snoise(vec3(p * 0.8, uTime)), snoise(vec3(p * 0.8 + 7.3, uTime + 3.1)));
      vec2 grain = floor(f + q * 90.0 * uDpr);

      vec3 m = texture2D(uMask, vec2(f.x / uRes.x, 1.0 - f.y / uRes.y)).rgb;
      if (m.r + m.g + m.b < 0.004) {
        gl_FragColor = vec4(0.0);
        return;
      }

      // The backdrop's filaments, wider, run through the letters.
      float vein = pow(1.0 - abs(snoise(vec3(p + 0.55 * q, uTime * 0.7))), 9.0);

      // How far this point is behind the fill's front, in css px. The front
      // wavers as it runs from the name's left edge to its right.
      float wave = 18.0;
      float x = mix(uBox.x / uDpr - 2.0 * wave, uBox.z / uDpr + 2.0 * wave, uFill)
              + wave * snoise(vec3(f.y / uDpr / 70.0, uSec * 0.45, 1.7));
      float behind = x - f.x / uDpr;
      float fill = smoothstep(-1.5, 1.5, behind);
      float front = exp(-behind * behind / 60.0) * smoothstep(0.0, 0.04, uFill);

      float empty = (0.05 + 0.12 * vein) * uShow;
      float full = 0.62 + 0.36 * vein;
      float density = m.r * (mix(empty, full, fill) + 0.55 * front)
                    + m.g * (1.0 - fill) * 0.5 * uShow
                    + m.b * 0.03 * fill;
      float lit = step(hash(grain), density);
      float bright = (0.45 + 0.55 * hash(grain + 17.0)) * mix(0.45, 1.0, max(fill, front));
      float a = clamp(lit * bright * uFade, 0.0, 1.0);
      gl_FragColor = vec4(INK * a, a);
    }
  `;

  function dust() {
    const canvas = document.createElement('canvas');
    canvas.className = 'loader__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    loader.prepend(canvas);
    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) {
      canvas.remove();
      return null;
    }
    const shader = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    // One triangle that covers the screen.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const where = {};
    const set = (key, ...v) => {
      if (!(key in where)) where[key] = gl.getUniformLocation(program, key);
      gl[`uniform${v.length}f`](where[key], ...v);
    };

    /* The mask: the name drawn where its letters fall on the page, the fill
       in red, a 2px outline in green and a soft glow in blue. */
    const mask = document.createElement('canvas');
    const pen = mask.getContext('2d');
    let dpr = 1;
    let painted = false;

    function paint() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      // A window with no size yet (a hidden tab): paint on the next resize.
      if (!width || !height) return;
      canvas.width = mask.width = width;
      canvas.height = mask.height = height;
      gl.viewport(0, 0, width, height);

      const type = getComputedStyle(name);
      const size = parseFloat(type.fontSize) * dpr;
      pen.font = `${type.fontWeight} ${size}px ${type.fontFamily}`;
      pen.fillStyle = '#000';
      pen.fillRect(0, 0, width, height);
      pen.globalCompositeOperation = 'lighter';
      pen.lineJoin = 'round';

      // Each letter where the page sets it, on its word's baseline.
      const box = [Infinity, Infinity, -Infinity, -Infinity];
      const letters = [];
      const range = document.createRange();
      for (const word of name.children) {
        const text = word.firstChild;
        const rect = word.getBoundingClientRect();
        const metrics = pen.measureText(text.data);
        const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
        const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
        const baseline = rect.top * dpr + (rect.height * dpr - ascent - descent) / 2 + ascent;
        for (let i = 0; i < text.length; i++) {
          range.setStart(text, i);
          range.setEnd(text, i + 1);
          const x = range.getBoundingClientRect().left * dpr;
          const char = text.data[i].toUpperCase();
          const ink = pen.measureText(char);
          letters.push([char, x, baseline]);
          box[0] = Math.min(box[0], x - ink.actualBoundingBoxLeft);
          box[1] = Math.min(box[1], baseline - ink.actualBoundingBoxAscent);
          box[2] = Math.max(box[2], x + ink.actualBoundingBoxRight);
          box[3] = Math.max(box[3], baseline + ink.actualBoundingBoxDescent);
        }
      }
      const draw = (how) => letters.forEach(([char, x, y]) => how(char, x, y));
      pen.fillStyle = pen.shadowColor = '#00f';
      pen.shadowBlur = 28 * dpr;
      draw((c, x, y) => pen.fillText(c, x, y));
      pen.shadowBlur = 0;
      pen.shadowColor = 'transparent';
      pen.fillStyle = '#f00';
      draw((c, x, y) => pen.fillText(c, x, y));
      pen.strokeStyle = '#0f0';
      pen.lineWidth = 2 * dpr;
      draw((c, x, y) => pen.strokeText(c, x, y));
      pen.globalCompositeOperation = 'source-over';

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
      set('uRes', width, height);
      set('uDpr', dpr);
      set('uScale', Math.max(canvas.clientWidth, canvas.clientHeight) * SCALE);
      set('uBox', box[0], height - box[3], box[2], height - box[1]);
      painted = true;
    }

    return {
      paint,
      draw(values) {
        if (!painted) return;
        for (const [key, value] of Object.entries(values)) set(key, value);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        loader.classList.add('has-canvas');
      },
      release() {
        const lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
        canvas.remove();
      },
    };
  }

  let scene = null;
  try {
    scene = dust();
  } catch (error) {
    console.error(error);
    scene = null;
  }
  let shownAt = 0;
  const repaint = () => scene && scene.paint();
  fonts.then(() => {
    repaint();
    shownAt = performance.now();
    addEventListener('resize', repaint);
  });

  /* ---------- Page entrance ---------- */

  /* The page comes up behind the loader as the next frame, and as it
     arrives its parts come up into place one after another: the top bar, the
     cards (the front one first, then outwards), the title and the meta
     through their boxes, then the timeline, its numbers and the needle. */
  function showPage() {
    root.classList.remove('is-loading');
    const quiet = reduceMotion.matches;
    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const play = (el, frames, duration, delay) => {
      if (!el) return;
      if (quiet) frames = [{ opacity: 0 }, { opacity: 1 }];
      el.animate(frames, { duration: quiet ? 400 : duration, delay: quiet ? 0 : delay, easing: EASE, fill: 'backwards' });
    };
    const rise = (by) => [{ opacity: 0, translate: `0 ${by}px` }, { opacity: 1, translate: '0 0' }];
    const up = [{ transform: 'translateY(100%)' }, { transform: 'none' }];
    const fade = [{ opacity: 0 }, { opacity: 1 }];

    document.querySelectorAll('.hero__bar .brand, .hero__menu > *').forEach((el, i) => play(el, rise(14), 1000, 450 + i * 70));

    const front = document.querySelector('.reel__card.is-front');
    const box = front && front.getBoundingClientRect();
    const middle = box ? box.left + box.width / 2 : innerWidth / 2;
    const away = (card) => {
      const r = card.getBoundingClientRect();
      return Math.abs(r.left + r.width / 2 - middle);
    };
    [...document.querySelectorAll('.reel__card:not([hidden])')]
      .sort((a, b) => away(a) - away(b))
      .forEach((card, i) => play(card, [
        { opacity: 0, translate: '0 64px', scale: '0.94' },
        { opacity: 1, translate: '0 0', scale: '1' },
      ], 1300, 500 + i * 70));

    play(document.querySelector('.title__text:last-child'), up, 1200, 700);
    document.querySelectorAll('.meta__row').forEach((row, i) => {
      play(row.querySelector('dt'), fade, 800, 800 + i * 60);
      play(row.querySelector('.meta__value:last-child'), up, 900, 800 + i * 60);
    });

    play(document.querySelector('.timeline__ticks'), rise(10), 1000, 900);
    document.querySelectorAll('.timeline__labels li').forEach((li, i) => play(li, rise(10), 900, 950 + i * 60));
    play(document.querySelector('.timeline__needles'), rise(-10), 800, 1250);
  }

  /* ---------- Run ---------- */

  const hero = document.querySelector('.hero');
  const easeInOut3 = (t) => (t = clamp(t), t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let doneAt = 0;
  let leaving = 0;
  let shown = -1;

  function finish() {
    removeEventListener('resize', repaint);
    if (scene) scene.release();
    hero.style.transform = '';
    loader.classList.remove('is-open');
    loader.hidden = true;
    loader.replaceChildren();
    loader.removeAttribute('style');
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {}
  }

  function frame(now) {
    const v = measure(now);
    const n = Math.round(v * 100);
    if (n !== shown) {
      shown = n;
      number.textContent = `${n}%`;
      loader.setAttribute('aria-valuenow', n);
      name.style.setProperty('--fill', `${n}%`);
    }
    if (v >= 1 && !doneAt) {
      doneAt = now;
      label.textContent = 'Picture start';
    }
    const still = reduceMotion.matches;
    if (doneAt && !leaving && now - doneAt >= HOLD) {
      leaving = now;
      row.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
      loader.style.pointerEvents = 'none';
      if (still) loader.animate([{ backgroundColor: 'rgb(23 23 23 / 0)' }], { duration: FADE, easing: 'ease-in-out', fill: 'forwards' });
      showPage();
    }

    // The loader runs up and the page follows it; with reduced motion the
    // loader fades.
    const k = leaving ? clamp((now - leaving) / (still ? FADE : ADVANCE)) : 0;
    if (leaving && !still) {
      const e = easeInOut3(k);
      loader.style.transform = `translateY(${-e * 100}%)`;
      hero.style.transform = `translateY(${(1 - e) * 100}%)`;
    }
    const t = still ? began : now;
    if (scene) {
      scene.draw({
        uTime: 40 * SPEED + ((t - began) / 1000) * SPEED,
        uSec: (t - began) / 1000,
        uFill: v,
        uShow: easeOut((now - shownAt) / 900),
        uFade: still ? 1 - easeInOut(k) : 1,
      });
    }
    if (still && (!scene || !loader.classList.contains('has-canvas'))) loader.style.opacity = 1 - easeInOut(k);
    if (k >= 1) finish();
    else requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
