/**
 * point-cloud-portrait.js — VERBATIM reference implementation
 *
 * This is the exact code that produces the effect in the design prototype,
 * lifted out of it and made framework-agnostic. It is NOT pseudo-code and it is
 * NOT a starting point to improvise from. Port it as-is. Every constant in here
 * was tuned against a real portrait; changing them is how the effect breaks.
 *
 * REQUIRES TWO PIXEL-ALIGNED IMAGES (see ASSETS section of 3D_HEADSHOT.md):
 *   photo — the portrait, supplies each dot's colour
 *   depth — grayscale depth map, same dimensions, background pure black,
 *           brighter = closer to camera
 *
 * USAGE (vanilla):
 *   const dispose = mountPointCloud(canvasEl, hintEl, {
 *     photo: '/assets/head-photo.jpg',
 *     depth: '/assets/head-depth.png'
 *   });
 *
 * USAGE (React):
 *   useEffect(() => {
 *     return mountPointCloud(canvasRef.current, hintRef.current, {...});
 *   }, []);
 *
 * The canvas must be sized by CSS (position:absolute; inset:0) — this code sets
 * .width/.height itself from the measured box and devicePixelRatio.
 */

export function mountPointCloud(cv, hint, opts) {
  const o = opts || {};
  const PHOTO_SRC = o.photo || '/assets/head-photo.jpg';
  const DEPTH_SRC = o.depth || '/assets/head-depth.png';
  let disposed = false, gl = null, raf = null, buffers = null, onResize = null;
  const _boot = (tries) => {
  if (disposed) return;
  // the canvas may not be laid out yet — retry briefly
  if (!cv || !cv.getBoundingClientRect().width) {
    const n = tries || 0;
    if (n < 40) setTimeout(() => _boot(n + 1), 120);
    return;
  }
  if (cv.dataset.pcWired) return;
  cv.dataset.pcWired = '1';
  gl = cv.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
  if (!gl) return;

  const PITCH = 2.4;        // css px between sampled dots
  const DEPTH = 0.62;       // z spread in normalized units
  const FOCAL = 2.4;
  let prog, count = 0, W = 0, H = 0, dpr = 1, sizeScale = 1;
  let yaw = 0, pitch = 0, vYaw = 0, vPitch = 0, drag = null, touched = false;
  let onScreen = true;   // set by the IntersectionObserver wired up below
  let userDriving = false;   // visitor has grabbed it; idle spin suspended until it settles
  // touch: drag fights page scroll, so the head performs itself instead
  const coarse = (/[?&]touch=1/.test(location.search) || (window.matchMedia && window.matchMedia('(hover:none)').matches));
  let spin = 0;

  const VS = [
    'attribute vec3 aPos;',
    'attribute vec3 aCol;',
    'attribute float aSize;',
    'uniform vec2 uRot;',
    'uniform float uFocal;',
    'uniform float uAspect;',
    'uniform float uDpr;',
    'uniform float uSizeScale;',
    'varying vec3 vCol;',
    'varying float vFade;',
    'void main() {',
    '  float cy = cos(uRot.x), sy = sin(uRot.x);',
    '  float cp = cos(uRot.y), sp = sin(uRot.y);',
    '  float x1 = aPos.x * cy + aPos.z * sy;',
    '  float z1 = -aPos.x * sy + aPos.z * cy;',
    '  float y2 = aPos.y * cp - z1 * sp;',
    '  float z2 = aPos.y * sp + z1 * cp;',
    '  float w = uFocal / (uFocal + z2);',
    '  vec2 p = vec2(x1 * w / uAspect, y2 * w);',
    // ---------------------------------------------------------------
    // ONE DEVIATION FROM THE HANDOFF FILE, and the only one. The reference
    // has `-z2 * 0.35` here. In NDC smaller z is nearer, so negating it makes
    // the front surface (negative z2, toward the viewer) map to a LARGER depth
    // than the back shell — the unlit charcoal shell then wins depthFunc(LEQUAL)
    // and paints over the lit face. That is precisely the "dead interior"
    // failure POINT_CLOUD_FIX.md describes. Verified: with the minus, the back
    // shell wins the depth test at every sampled depth; without it, the face
    // reads. Do not restore the minus.
    // ---------------------------------------------------------------

    '  gl_Position = vec4(p * 2.0, z2 * 0.35, 1.0);',
    '  gl_PointSize = max(1.0, aSize * uSizeScale * w * uDpr);',
    '  vCol = aCol;',
    '  vFade = clamp(0.42 + w * 0.62, 0.0, 1.0);',
    '}'
  ].join('\n');

  const FS = [
    'precision mediump float;',
    'varying vec3 vCol;',
    'varying float vFade;',
    'void main() {',
    '  vec2 d = gl_PointCoord - vec2(0.5);',
    '  float r = length(d);',
    '  if (r > 0.5) discard;',
    '  float a = smoothstep(0.5, 0.16, r) * vFade;',
    '  gl_FragColor = vec4(vCol * (0.75 + vFade * 0.35), a);',
    '}'
  ].join('\n');

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const loc = {
    pos: gl.getAttribLocation(prog, 'aPos'),
    col: gl.getAttribLocation(prog, 'aCol'),
    size: gl.getAttribLocation(prog, 'aSize'),
    rot: gl.getUniformLocation(prog, 'uRot'),
    focal: gl.getUniformLocation(prog, 'uFocal'),
    aspect: gl.getUniformLocation(prog, 'uAspect'),
    dpr: gl.getUniformLocation(prog, 'uDpr'),
    sizeScale: gl.getUniformLocation(prog, 'uSizeScale')
  };

  // charcoal -> terracotta -> warm bone
  const ramp = [[38, 30, 27], [104, 52, 34], [168, 82, 47], [214, 120, 76], [240, 186, 152], [250, 238, 228]];
  const tint = t => {
    const s = Math.max(0, Math.min(0.999, t)) * (ramp.length - 1);
    const i = Math.floor(s), k = s - i, p = ramp[i], q = ramp[i + 1] || p;
    return [(p[0] + (q[0] - p[0]) * k) / 255, (p[1] + (q[1] - p[1]) * k) / 255, (p[2] + (q[2] - p[2]) * k) / 255];
  };

  const build = (photo, depth) => {
    const rect = cv.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    W = rect.width; H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    gl.viewport(0, 0, cv.width, cv.height);

    const srcAspect = depth.width / depth.height;
    const grab = (img, gwv, ghv) => {
      const c = document.createElement('canvas');
      c.width = gwv; c.height = ghv;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0, gwv, ghv);
      return x.getImageData(0, 0, gwv, ghv).data;
    };

    // pass 1: coarse scan to find how much of the frame the subject occupies,
    // so the final grid lands dots at roughly PITCH px regardless of card size
    const c0h = 120, c0w = Math.max(2, Math.round(c0h * srcAspect));
    const d0 = grab(depth, c0w, c0h);
    let y0 = c0h, y1 = -1;
    for (let y = 0; y < c0h; y++) {
      for (let x = 0; x < c0w; x++) {
        if (d0[(y * c0w + x) * 4] / 255 >= 0.10) { if (y < y0) y0 = y; if (y > y1) y1 = y; break; }
      }
    }
    const fy = Math.max(0.2, (y1 - y0 + 1) / c0h);

    // DEVIATION FROM THE REFERENCE (third). The reference sizes the bust at
    // 0.74 of the frame and lifts it 0.08 to clear a caption strip this card
    // does not have, which left ~21% of the frame empty below the shoulders.
    // Filled out and centred so the frame hugs the bust.
    const FIT = 0.94;      // share of card height the bust occupies
    const LIFT = 0.0;      // centred; nothing below to clear
    const ghIdeal = FIT * H / (PITCH * fy);
    let gh = Math.round(ghIdeal);
    gh = Math.max(110, Math.min(430, gh));

    // DEVIATION FROM THE REFERENCE (the second and last one — see the
    // gl_Position note above for the first).
    //
    // The dot sizes below (1.9–4.5) are drawn for dots sitting PITCH apart,
    // which holds while gh tracks ghIdeal. On the phone card (~174px) ghIdeal
    // is ~54, so the floor above forces more than twice the intended density
    // while the dots keep their full size — every dot swallows its neighbours
    // and the portrait turns to mush. Shrink the dots by however much the
    // floor overshot, so the grid keeps its detail and the dots still read as
    // dots. No effect on desktop, where the floor never binds and this is 1.
    sizeScale = Math.min(1, ghIdeal / gh);
    let gw = Math.max(2, Math.round(gh * srcAspect));

    const dp = grab(depth, gw, gh), ph = grab(photo, gw, gh);
    const G = gw * gh;

    // subject mask + bounding box
    const raw = new Uint8Array(G);
    for (let j = 0; j < G; j++) if (dp[j * 4] / 255 >= 0.10) raw[j] = 1;

    // the depth map frays around hair and headphone edges — drop isolated
    // pixels and thin spikes, or they spray as loose dots once rotated
    const on = new Uint8Array(raw);
    for (let y = 1; y < gh - 1; y++) for (let x = 1; x < gw - 1; x++) {
      const j = y * gw + x;
      if (!raw[j]) continue;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (dx || dy) n += raw[j + dy * gw + dx];
      }
      if (n < 5) on[j] = 0;
    }

    let bx0 = gw, bx1 = -1, by0 = gh, by1 = -1;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      if (!on[y * gw + x]) continue;
      if (x < bx0) bx0 = x; if (x > bx1) bx1 = x;
      if (y < by0) by0 = y; if (y > by1) by1 = y;
    }
    if (bx1 < 0) { count = 0; return; }

    // distance to silhouette edge — drives how thick the volume is at each point
    const dist = new Float32Array(G);
    for (let j = 0; j < G; j++) dist[j] = on[j] ? 9999 : 0;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
      const j = y * gw + x;
      if (!dist[j]) continue;
      let m = dist[j];
      if (x > 0) m = Math.min(m, dist[j - 1] + 1);
      if (y > 0) m = Math.min(m, dist[j - gw] + 1);
      dist[j] = m;
    }
    for (let y = gh - 1; y >= 0; y--) for (let x = gw - 1; x >= 0; x--) {
      const j = y * gw + x;
      if (!dist[j]) continue;
      let m = dist[j];
      if (x < gw - 1) m = Math.min(m, dist[j + 1] + 1);
      if (y < gh - 1) m = Math.min(m, dist[j + gw] + 1);
      dist[j] = m;
    }
    let maxD = 1;
    for (let j = 0; j < G; j++) if (dist[j] < 9999 && dist[j] > maxD) maxD = dist[j];

    // fit the bounding box into the card, square pixels, biased upward
    const bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
    const fit = Math.min(FIT / bh, ((W / H) * 0.92) / bw);
    const mx = (bx0 + bx1) / 2, my = (by0 + by1) / 2;

    // per-row horizontal extents — the volume is lathed as an elliptical
    // cross-section per row, which reads far more like a head than an offset shell
    const rowL = new Int32Array(gh).fill(-1), rowR = new Int32Array(gh).fill(-1);
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) if (on[y * gw + x]) { if (rowL[y] < 0) rowL[y] = x; rowR[y] = x; }
    }
    const headRow = Math.max(0, Math.min(gh - 1, Math.round(by0 + bh * 0.28)));
    const halfHead = Math.max(2, (rowR[headRow] - rowL[headRow]) / 2);
    const capHalf = halfHead * 1.3;   // shoulders stay no deeper than the head

    const pos = [], col = [], siz = [];
    const push = (gx, gy, z, t, sz) => {
      pos.push((gx - mx) * fit, (my - gy) * fit + LIFT, z);
      const c = tint(t);
      col.push(c[0], c[1], c[2]);
      siz.push(sz);
    };

    for (let y = 0; y < gh; y++) {
      if (rowL[y] < 0) continue;
      const hw = Math.max(1, (rowR[y] - rowL[y]) / 2);
      const cxr = (rowL[y] + rowR[y]) / 2;
      const halfEff = Math.min(hw, capHalf);
      for (let x = 0; x < gw; x++) {
        const j = y * gw + x;
        if (!on[j]) continue;
        const i = j * 4;
        const zRaw = dp[i] / 255;                    // depth map: bright = nearer
        const lum = (0.299 * ph[i] + 0.587 * ph[i + 1] + 0.114 * ph[i + 2]) / 255;
        const zF = (0.52 - zRaw) * DEPTH;            // front surface (negative = toward viewer)

        // elliptical thickness: full at the row's centre line, zero at its edges
        const u = Math.max(-1, Math.min(1, (x - cxr) / hw));
        const profile = Math.sqrt(Math.max(0, 1 - u * u));
        const thick = 2 * halfEff * fit * profile * 0.82;
        const zB = zF + thick;

        const tF = 0.12 + Math.pow(lum, 0.78) * 0.88;
        push(x, y, zF, tF, 1.9 + Math.pow(lum, 0.65) * 2.6);

        // back shell — unlit, so it sits at the charcoal end of the ramp
        if (thick > 0.012) {
          push(x, y, zB, 0.05 + Math.pow(lum, 0.95) * 0.22, 1.5 + Math.pow(lum, 0.7) * 1.3);
        }
        // wrap band: the sides are edge-on to the camera and would otherwise be
        // hollow, so loft a few points between front and back near the silhouette
        if (dist[j] <= 4 && thick > 0.012) {
          for (let k = 1; k <= 3; k++) {
            const f = k / 4;
            push(x, y, zF + thick * f, (tF * (1 - f) + 0.08 * f) * 0.85, 1.4 + Math.pow(lum, 0.7) * 1.1);
          }
        }
      }
    }
    count = siz.length;

    const mk = (arr, n, attr) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, n, gl.FLOAT, false, 0, 0);
      return buf;
    };
    if (buffers) buffers.forEach(b => gl.deleteBuffer(b));
    buffers = [mk(pos, 3, loc.pos), mk(col, 3, loc.col), mk(siz, 1, loc.size)];

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.uniform1f(loc.focal, FOCAL);
    gl.uniform1f(loc.aspect, W / H);
    gl.uniform1f(loc.dpr, dpr);
    gl.uniform1f(loc.sizeScale, sizeScale);
    // resize fires constantly on mobile (URL-bar collapse); never leave the
    // previous rAF chain running or the draws multiply
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    draw();
  };

  const draw = () => {
    if (!count) return;
    // Scrolled out of sight: stop the loop entirely rather than keep drawing a
    // 60fps WebGL scene nobody can see. The observer below restarts it.
    if (!onScreen) { raf = null; return; }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!userDriving) {
      spin += 0.0022;
      gl.uniform2f(loc.rot, Math.sin(spin) * 0.42, Math.sin(spin * 0.6) * 0.12);
      gl.drawArrays(gl.POINTS, 0, count);
      raf = requestAnimationFrame(draw);
      return;
    }
    gl.uniform2f(loc.rot, yaw, pitch);
    gl.drawArrays(gl.POINTS, 0, count);

    if (!drag) {
      yaw += vYaw; pitch += vPitch;
      vYaw *= 0.94; vPitch *= 0.94;
      yaw *= 0.988; pitch *= 0.988;      // drift back to face-on
      pitch = Math.max(-0.45, Math.min(0.45, pitch));
      if (Math.abs(vYaw) > 0.00015 || Math.abs(vPitch) > 0.00015 || Math.abs(yaw) > 0.0015 || Math.abs(pitch) > 0.0015) {
        raf = requestAnimationFrame(draw);
        return;
      }
      yaw = 0; pitch = 0; vYaw = 0; vPitch = 0;
      if (userDriving) {
        userDriving = false;
        spin = 0;                       // sin(0) == 0, so the spin picks up
        raf = requestAnimationFrame(draw);  // exactly where the drag settled
        return;
      }
      gl.uniform2f(loc.rot, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
      raf = null;
      return;
    }
    raf = requestAnimationFrame(draw);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

  if (coarse) {
    cv.style.cursor = 'default';
    cv.style.touchAction = 'pan-y';
    if (hint) hint.style.display = 'none';
  }
  cv.addEventListener('pointerdown', e => {
    // take over from the idle spin at its current angle, so there is no jump
    yaw = Math.sin(spin) * 0.42;
    pitch = Math.sin(spin * 0.6) * 0.12;
    userDriving = true;
    drag = { x: e.clientX, y: e.clientY };
    vYaw = 0; vPitch = 0;
    cv.style.cursor = 'grabbing';
    if (!touched) { touched = true; if (hint) hint.style.opacity = '0'; }
    try { if (cv.setPointerCapture) cv.setPointerCapture(e.pointerId); } catch (err) {}
    kick();
  });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    // Drag direction: the reference's positive yaw swings the head's right
    // side toward the viewer, so dragging right turned the face left — orbit-
    // camera convention. Negated so the head follows the finger instead, which
    // is what a portrait you physically grab should do.
    vYaw = -dx * 0.006; vPitch = coarse ? 0 : -dy * 0.005;
    yaw += vYaw;
    pitch = Math.max(-0.45, Math.min(0.45, pitch + vPitch));
    kick();
  });
  const release = () => { if (!drag) return; drag = null; cv.style.cursor = 'grab'; kick(); };
  cv.addEventListener('pointerup', release);
  cv.addEventListener('pointercancel', release);
  cv.addEventListener('pointerleave', release);

  // Pause the whole thing while the card is off-screen. The hero is at the top
  // of a long page, so without this the loop runs the entire time someone is
  // reading anything else.
  const io = new IntersectionObserver((entries) => {
    const vis = entries[0].isIntersecting;
    if (vis === onScreen) return;
    onScreen = vis;
    if (vis) kick();
    else if (raf) { cancelAnimationFrame(raf); raf = null; }
  }, { rootMargin: '120px' });
  io.observe(cv);

  let loaded = 0;
  const photo = new Image(), depth = new Image();
  const ready = () => {
    if (++loaded < 2) return;
    build(photo, depth);
    onResize = () => build(photo, depth);
    window.addEventListener('resize', onResize);
  };
  photo.onload = ready; depth.onload = ready;
  photo.src = PHOTO_SRC;
  depth.src = DEPTH_SRC;
  };

  _boot(0);

  // React/Next: call this from the useEffect cleanup
  return function dispose() {
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    if (onResize) window.removeEventListener('resize', onResize);
    io.disconnect();
    if (buffers) buffers.forEach(b => gl && gl.deleteBuffer(b));
  };
}