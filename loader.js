/* Loader — a film countdown leader drawn in dust on the black while the page
   loads: a crosshair, two rings and a hand that sweeps once round from 0 to
   100%, the swept part of the circle filling with grains. At 100 it reads
   PICTURE START and the circle opens like an iris onto the page, which comes
   in from under it. Without WebGL it is the count on the black, fading out. */

(() => {
  const MIN_TIME = 3200;    // ms the count takes at least, so it is seen
  const HOLD = 450;         // ms on PICTURE START before the iris opens
  const IRIS = 1400;        // ms for the iris to open
  const DRIFT = 0.018;      // how fast the grains drift (as the backdrop's)

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
     pictures and films — but no faster than a clock of MIN_TIME that moves in
     bursts and holds, the way a load does. It only ever goes up. */
  const CLOCK = [[0, 0], [0.1, 0.07], [0.2, 0.12], [0.34, 0.38], [0.46, 0.44], [0.62, 0.71], [0.74, 0.78], [0.88, 0.94], [1, 1]];
  const waits = [
    document.fonts.ready,
    new Promise((done) => (document.readyState === 'complete' ? done() : addEventListener('load', done, { once: true }))),
    ...[...document.querySelectorAll('.reel__media')].map((media) => new Promise((done) => {
      if (media.complete || media.readyState >= 2) return done();
      media.addEventListener(media.tagName === 'VIDEO' ? 'loadeddata' : 'load', done, { once: true });
      media.addEventListener('error', done, { once: true });
    })),
  ];
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

  const brand = document.createElement('div');
  brand.className = 'brand loader__brand loader__type';
  brand.textContent = 'Jeff.q Production';
  const number = document.createElement('div');
  number.className = 'loader__number loader__type';
  number.textContent = '0';
  const label = document.createElement('div');
  label.className = 'label loader__label loader__type';
  label.textContent = 'Loading';
  loader.append(brand, number, label);

  // Its type shows once Syne and Geist are in.
  Promise.all([
    document.fonts.load('800 100px Syne', '0123456789'),
    document.fonts.load('500 12px Geist', 'LOADING PICTURE START'),
  ]).catch(() => {}).then(() => loader.classList.add('has-fonts'));

  let radius = 0;
  function place() {
    radius = Math.min(innerWidth, innerHeight) * 0.3;
    number.style.fontSize = `${radius * 0.62}px`;
    label.style.top = `${innerHeight / 2 + radius + 28}px`;
  }
  place();
  addEventListener('resize', place);

  /* ---------- Leader ---------- */

  const VERTEX = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;

  const FRAGMENT = `
    precision highp float;
    uniform vec2 uRes;      // device px
    uniform float uDpr;
    uniform float uTime;
    uniform float uScale;   // css px per unit of the drift's warp
    uniform float uR;       // circle radius, css px
    uniform float uSweep;   // 0…1 of a turn
    uniform float uLines;   // the marks drawing in, 0…1
    uniform float uHole;    // iris radius, css px
    uniform float uCover;

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

    const vec3 BG = vec3(23.0) / 255.0;   // --color-bg
    const float TAU = 6.2831853;

    void main() {
      vec2 f = gl_FragCoord.xy;
      vec2 c = (f - 0.5 * uRes) / uDpr;   // css px from the centre, y up
      float r = length(c);

      // The grains drift on a slow warp, as the backdrop's do.
      vec2 p = f / uDpr / uScale;
      vec2 q = vec2(snoise(vec3(p * 0.8, uTime)), snoise(vec3(p * 0.8 + 7.3, uTime + 3.1)));
      vec2 cell = floor(f + q * 90.0 * uDpr);

      // Crosshair and two rings; the hand, and the circle filled behind it.
      float inside = 1.0 - smoothstep(uR - 1.0, uR, r);
      float ang = fract(atan(c.x, c.y) / TAU + 1.0);
      float swept = inside * step(ang, uSweep);
      float rings = (1.0 - smoothstep(0.5, 1.5, abs(r - uR))) + (1.0 - smoothstep(0.5, 1.5, abs(r - uR * 0.86)));
      float cross = (1.0 - smoothstep(0.5, 1.5, abs(c.x))) + (1.0 - smoothstep(0.5, 1.5, abs(c.y)));
      vec2 dir = vec2(sin(uSweep * TAU), cos(uSweep * TAU));
      float hand = step(0.0, dot(c, dir)) * inside * (1.0 - smoothstep(0.5, 2.0, abs(c.x * dir.y - c.y * dir.x)));
      float marks = (rings + cross) * uLines;
      hand *= uLines;

      // The iris: a hole from the centre, with a bright dusty rim.
      float open = step(0.5, uHole);
      float edge = (r - uHole) / 4.0;
      float rim = open * exp(-edge * edge);

      float lines = min(marks + hand + rim, 1.0);
      float density = swept * 0.16 + 0.6 * marks + 0.95 * hand + 0.8 * rim;
      float lit = step(hash(cell), density);
      float a = lit * (0.35 + 0.65 * hash(cell + 17.0)) * max(0.42 * swept, 0.85 * lines);
      float cover = uCover * mix(1.0, smoothstep(uHole - 1.0, uHole + 1.0, r), open);
      gl_FragColor = vec4(mix(BG, vec3(1.0), clamp(a, 0.0, 1.0)) * cover, cover);
    }
  `;

  function leader() {
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

    const where = {};
    const set = (name, ...v) => {
      if (!(name in where)) where[name] = gl.getUniformLocation(program, name);
      gl[`uniform${v.length}f`](where[name], ...v);
    };

    return {
      draw(values) {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const width = Math.round(canvas.clientWidth * dpr);
        const height = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
        set('uRes', width, height);
        set('uDpr', dpr);
        set('uScale', Math.max(canvas.clientWidth, canvas.clientHeight) * 0.7);
        for (const [name, value] of Object.entries(values)) set(name, value);
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
    scene = leader();
  } catch (error) {
    console.error(error);
    scene = null;
  }

  /* ---------- Page entrance ---------- */

  /* The page comes in from under the loader: the reel rises into place, the
     title and the meta values slide up through their boxes (as when the reel
     turns), the top bar and the timeline fade in. */
  function showPage() {
    root.classList.remove('is-loading');
    const quiet = reduceMotion.matches;
    const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
    const play = (el, frames, duration, delay) => {
      if (!el) return;
      if (quiet) frames = [{ opacity: 0 }, { opacity: 1 }];
      el.animate(frames, { duration: quiet ? 400 : duration, delay: quiet ? 0 : delay, easing: EASE, fill: 'backwards' });
    };
    const up = [{ transform: 'translateY(100%)' }, { transform: 'none' }];
    const fade = [{ opacity: 0 }, { opacity: 1 }];
    play(document.querySelector('.reel__stage'), [{ opacity: 0, transform: 'translateY(32px) scale(0.96)' }, { opacity: 1, transform: 'none' }], 1600, 0);
    play(document.querySelector('.title__text:last-child'), up, 1100, 140);
    document.querySelectorAll('.meta__row').forEach((row, i) => {
      play(row.querySelector('dt'), fade, 800, 300 + i * 50);
      play(row.querySelector('.meta__value:last-child'), up, 900, 300 + i * 50);
    });
    play(document.querySelector('.hero__bar'), fade, 1000, 200);
    play(document.querySelector('.timeline'), fade, 1000, 420);
  }

  /* ---------- Run ---------- */

  let doneAt = 0;
  let leaving = 0;
  let shown = -1;

  function finish() {
    removeEventListener('resize', place);
    if (scene) scene.release();
    loader.classList.remove('is-open');
    loader.hidden = true;
    loader.replaceChildren();
  }

  function frame(now) {
    const v = measure(now);
    const n = Math.round(v * 100);
    if (n !== shown) {
      shown = n;
      number.textContent = n;
      loader.setAttribute('aria-valuenow', n);
    }
    if (v >= 1 && !doneAt) {
      doneAt = now;
      label.textContent = 'Picture start';
    }
    if (doneAt && !leaving && now - doneAt >= HOLD) {
      leaving = now;
      const out = { duration: 350, fill: 'forwards' };
      number.animate([{ opacity: 1, transform: 'translate(-50%, -50%)' }, { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' }], out);
      label.animate([{ opacity: 1 }, { opacity: 0 }], out);
      loader.style.pointerEvents = 'none';
      showPage();
    }

    // The iris opens; with reduced motion (or no WebGL) the leader fades.
    const k = leaving ? clamp((now - leaving) / IRIS) : 0;
    const iris = scene && !reduceMotion.matches;
    if (scene) {
      scene.draw({
        uTime: 40 + ((now - began) / 1000) * DRIFT,
        uR: radius,
        uSweep: v,
        uLines: easeOut((now - began) / 900),
        uHole: iris ? easeInOut(k) * (Math.hypot(innerWidth, innerHeight) / 2 + 12) : 0,
        uCover: iris ? 1 : 1 - easeInOut(k),
      });
    } else {
      loader.style.opacity = 1 - easeInOut(k);
    }
    if (k >= 1) finish();
    else requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
