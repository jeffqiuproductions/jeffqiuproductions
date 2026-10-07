/* Backdrop — fine white dust on the black that gathers into bright, curling
   filaments and drifts slowly, drawn in WebGL behind the screen. Each pixel
   is a grain; how likely it is to be lit follows two slowly moving noise
   fields, brightest where they cross zero (the filaments) and where the
   filaments meet. Without WebGL the page stays plain black. */

(() => {
  const OPACITY = 0.32;     // how strongly the dust shows through
  const SPEED = 0.018;      // how fast the filaments change
  const SCALE = 0.7;        // a filament loop spans this much of the screen's long side
  const FPS = 30;           // it moves slowly; 30 frames a second is plenty

  const canvas = document.querySelector('.backdrop');
  const gl = canvas && canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return;

  const VERTEX = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;

  const FRAGMENT = `
    precision highp float;
    uniform float uDpr;
    uniform float uTime;
    uniform float uAlpha;
    uniform float uScale;

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

    void main() {
      vec2 p = gl_FragCoord.xy / uDpr / uScale;
      float t = uTime;

      // Warp the plane so the filaments curl and drift.
      vec2 q = vec2(snoise(vec3(p * 0.8, t)), snoise(vec3(p * 0.8 + 7.3, t + 3.1)));
      vec2 w = p + 0.55 * q;

      // Filaments where two noise fields cross zero; knots where they meet.
      float a = 1.0 - abs(snoise(vec3(w, t * 0.7)));
      float b = 1.0 - abs(snoise(vec3(w * 1.2 + 2.7, 5.0 - t * 0.5)));
      float lines = pow(a, 46.0) + 0.55 * pow(b, 60.0);
      float glow = 0.16 * pow(a, 7.0) + 0.08 * pow(b, 9.0);
      float knots = 1.6 * pow(a * b, 26.0);
      float density = 0.012 + glow + lines + knots;

      // Each pixel is a grain lit at that density. The grains ride the warp,
      // so the dust drifts with the filaments instead of sitting still.
      vec2 grain = floor(gl_FragCoord.xy + q * 90.0 * uDpr);
      float lit = step(hash(grain), density);
      float core = clamp(lines + knots, 0.0, 1.0);
      float alpha = lit * (0.35 + 0.65 * hash(grain + 17.0)) * (1.0 + 0.8 * core) * uAlpha;
      gl_FragColor = vec4(vec3(alpha), alpha);
    }
  `;

  function shader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

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

  const u = (name) => gl.getUniformLocation(program, name);
  const uDpr = u('uDpr');
  const uTime = u('uTime');
  const uScale = u('uScale');
  gl.uniform1f(u('uAlpha'), OPACITY);

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // Start a little way in, so the first frame already has its filaments.
  const start = performance.now() - 40000;
  const root = document.documentElement;
  let last = -Infinity;
  let running = false;

  function paint(now) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.uniform1f(uDpr, dpr);
    gl.uniform1f(uScale, Math.max(canvas.clientWidth, canvas.clientHeight) * SCALE);
    gl.uniform1f(uTime, ((now - start) / 1000) * SPEED);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.classList.add('is-ready');
  }

  function frame(now) {
    if (reduceMotion.matches) {
      running = false;
      return;
    }
    // Nothing to draw while the loader covers the screen, and the dust holds
    // still while the reel moves (reel.js), so the cards get the frames.
    const resting = !root.classList.contains('is-loading') && !root.classList.contains('is-moving');
    if (now - last >= 1000 / FPS - 2 && resting) {
      last = now;
      paint(now);
    }
    requestAnimationFrame(frame);
  }

  function run() {
    paint(performance.now());
    if (running || reduceMotion.matches) return;
    running = true;
    requestAnimationFrame(frame);
  }

  run();
  reduceMotion.addEventListener('change', run);
  addEventListener('resize', () => reduceMotion.matches && paint(performance.now()));
  canvas.addEventListener('webglcontextlost', () => canvas.classList.remove('is-ready'));
})();
