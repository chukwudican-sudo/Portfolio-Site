/**
 * Rotatable point-cloud portrait, per design_handoff/3D_HEADSHOT.md.
 *
 * Two pixel-aligned inputs drive it: a portrait supplies each dot's colour, a
 * grayscale depth map supplies its Z (pure black = background = no dot). The
 * frame is walked on a fixed CSS-pixel grid so dot density is identical at any
 * card size, and the silhouette is lathed into an elliptical cross-section per
 * row so the result reads as a head rather than an offset shell.
 */

const PITCH = 2.4; // css px between sampled dots
const DEPTH = 0.62; // z spread, normalised — shallow on purpose; deep looks like a mask
const FOCAL = 2.4;
const FIT = 0.74; // share of card height the bust occupies
const LIFT = 0.08; // nudge up, clear of the caption strip
const DEPTH_CUTOFF = 0.1;

/** charcoal -> deep brown -> terracotta -> warm orange -> peach -> warm bone */
const RAMP: [number, number, number][] = [
  [38, 30, 27],
  [104, 52, 34],
  [168, 82, 47],
  [214, 120, 76],
  [240, 186, 152],
  [250, 238, 228],
];

function tint(t: number): [number, number, number] {
  const s = Math.max(0, Math.min(0.999, t)) * (RAMP.length - 1);
  const i = Math.floor(s);
  const k = s - i;
  const p = RAMP[i];
  const q = RAMP[i + 1] ?? p;
  return [
    (p[0] + (q[0] - p[0]) * k) / 255,
    (p[1] + (q[1] - p[1]) * k) / 255,
    (p[2] + (q[2] - p[2]) * k) / 255,
  ];
}

const VS = `
attribute vec3 aPos;
attribute vec3 aCol;
attribute float aSize;
uniform vec2 uRot;
uniform float uFocal;
uniform float uAspect;
uniform float uDpr;
varying vec3 vCol;
varying float vFade;
void main() {
  float cy = cos(uRot.x), sy = sin(uRot.x);
  float cp = cos(uRot.y), sp = sin(uRot.y);
  float x1 = aPos.x * cy + aPos.z * sy;
  float z1 = -aPos.x * sy + aPos.z * cy;
  float y2 = aPos.y * cp - z1 * sp;
  float z2 = aPos.y * sp + z1 * cp;
  float w = uFocal / (uFocal + z2);
  vec2 p = vec2(x1 * w / uAspect, y2 * w);
  gl_Position = vec4(p * 2.0, -z2 * 0.35, 1.0);
  gl_PointSize = max(1.0, aSize * w * uDpr);
  vCol = aCol;
  vFade = clamp(0.42 + w * 0.62, 0.0, 1.0);
}`;

const FS = `
precision mediump float;
varying vec3 vCol;
varying float vFade;
void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float r = length(d);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.16, r) * vFade;
  gl_FragColor = vec4(vCol * (0.75 + vFade * 0.35), a);
}`;

export type PointCloudHandle = { destroy: () => void };

type Options = {
  canvas: HTMLCanvasElement;
  photo: CanvasImageSource & { width: number; height: number };
  depth: CanvasImageSource & { width: number; height: number };
  /** called once, the first time the visitor drags */
  onFirstDrag?: () => void;
  /** touch devices sway on their own instead of capturing drags */
  autoSway: boolean;
  reducedMotion: boolean;
};

export function createPointCloud(opts: Options): PointCloudHandle | null {
  const { canvas, photo, depth, onFirstDrag, autoSway, reducedMotion } = opts;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, VS);
  const fs = compile(gl.FRAGMENT_SHADER, FS);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const loc = {
    pos: gl.getAttribLocation(prog, "aPos"),
    col: gl.getAttribLocation(prog, "aCol"),
    size: gl.getAttribLocation(prog, "aSize"),
    rot: gl.getUniformLocation(prog, "uRot"),
    focal: gl.getUniformLocation(prog, "uFocal"),
    aspect: gl.getUniformLocation(prog, "uAspect"),
    dpr: gl.getUniformLocation(prog, "uDpr"),
  };

  let buffers: WebGLBuffer[] = [];
  let count = 0;
  let W = 0;
  let H = 0;
  let dpr = 1;
  let raf: number | null = null;
  let yaw = 0;
  let pitch = 0;
  let vYaw = 0;
  let vPitch = 0;
  let spin = 0;
  let drag: { x: number; y: number } | null = null;
  let touched = false;
  let destroyed = false;

  const grab = (img: CanvasImageSource, gw: number, gh: number) => {
    const c = document.createElement("canvas");
    c.width = gw;
    c.height = gh;
    const x = c.getContext("2d");
    if (!x) return new Uint8ClampedArray(gw * gh * 4);
    x.drawImage(img, 0, 0, gw, gh);
    return x.getImageData(0, 0, gw, gh).data;
  };

  const build = () => {
    if (destroyed) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    W = rect.width;
    H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const srcAspect = depth.width / depth.height;

    // coarse pass: how much of the frame the subject occupies, so dot pitch
    // lands at ~PITCH css px regardless of card size
    const c0h = 120;
    const c0w = Math.max(2, Math.round(c0h * srcAspect));
    const d0 = grab(depth, c0w, c0h);
    let y0 = c0h;
    let y1 = -1;
    for (let y = 0; y < c0h; y++) {
      for (let x = 0; x < c0w; x++) {
        if (d0[(y * c0w + x) * 4] / 255 >= DEPTH_CUTOFF) {
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
          break;
        }
      }
    }
    const fy = Math.max(0.2, (y1 - y0 + 1) / c0h);

    let gh = Math.round((FIT * H) / (PITCH * fy));
    gh = Math.max(110, Math.min(430, gh));
    const gw = Math.max(2, Math.round(gh * srcAspect));

    const dp = grab(depth, gw, gh);
    const ph = grab(photo, gw, gh);
    const G = gw * gh;

    const raw = new Uint8Array(G);
    for (let j = 0; j < G; j++) if (dp[j * 4] / 255 >= DEPTH_CUTOFF) raw[j] = 1;

    // depth maps fray around hair edges — drop isolated pixels and thin spikes,
    // or they spray as loose dots once rotated
    const on = new Uint8Array(raw);
    for (let y = 1; y < gh - 1; y++) {
      for (let x = 1; x < gw - 1; x++) {
        const j = y * gw + x;
        if (!raw[j]) continue;
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) if (dx || dy) n += raw[j + dy * gw + dx];
        }
        if (n < 5) on[j] = 0;
      }
    }

    let bx0 = gw;
    let bx1 = -1;
    let by0 = gh;
    let by1 = -1;
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        if (!on[y * gw + x]) continue;
        if (x < bx0) bx0 = x;
        if (x > bx1) bx1 = x;
        if (y < by0) by0 = y;
        if (y > by1) by1 = y;
      }
    }
    if (bx1 < 0) {
      count = 0;
      return;
    }

    // distance to silhouette edge — drives volume thickness
    const dist = new Float32Array(G);
    for (let j = 0; j < G; j++) dist[j] = on[j] ? 9999 : 0;
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const j = y * gw + x;
        if (!dist[j]) continue;
        let m = dist[j];
        if (x > 0) m = Math.min(m, dist[j - 1] + 1);
        if (y > 0) m = Math.min(m, dist[j - gw] + 1);
        dist[j] = m;
      }
    }
    for (let y = gh - 1; y >= 0; y--) {
      for (let x = gw - 1; x >= 0; x--) {
        const j = y * gw + x;
        if (!dist[j]) continue;
        let m = dist[j];
        if (x < gw - 1) m = Math.min(m, dist[j + 1] + 1);
        if (y < gh - 1) m = Math.min(m, dist[j + gw] + 1);
        dist[j] = m;
      }
    }

    const bw = bx1 - bx0 + 1;
    const bh = by1 - by0 + 1;
    const fit = Math.min(FIT / bh, ((W / H) * 0.92) / bw);
    const mx = (bx0 + bx1) / 2;
    const my = (by0 + by1) / 2;

    // per-row horizontal extents: the volume is lathed as an elliptical
    // cross-section per row, which reads far more like a head than a shell
    const rowL = new Int32Array(gh).fill(-1);
    const rowR = new Int32Array(gh).fill(-1);
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        if (on[y * gw + x]) {
          if (rowL[y] < 0) rowL[y] = x;
          rowR[y] = x;
        }
      }
    }
    const headRow = Math.max(0, Math.min(gh - 1, Math.round(by0 + bh * 0.28)));
    const halfHead = Math.max(2, (rowR[headRow] - rowL[headRow]) / 2);
    const capHalf = halfHead * 1.3; // shoulders stay no deeper than the head

    const pos: number[] = [];
    const col: number[] = [];
    const siz: number[] = [];
    const push = (gx: number, gy: number, z: number, t: number, sz: number) => {
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
        const zRaw = dp[i] / 255; // bright = nearer
        const lum = (0.299 * ph[i] + 0.587 * ph[i + 1] + 0.114 * ph[i + 2]) / 255;
        const zF = (0.52 - zRaw) * DEPTH; // front surface, negative = toward viewer

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
        // wrap band: the sides are edge-on and would otherwise be hollow
        if (dist[j] <= 4 && thick > 0.012) {
          for (let k = 1; k <= 3; k++) {
            const f = k / 4;
            push(x, y, zF + thick * f, (tF * (1 - f) + 0.08 * f) * 0.85, 1.4 + Math.pow(lum, 0.7) * 1.1);
          }
        }
      }
    }
    count = siz.length;

    const mk = (arr: number[], n: number, attr: number) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, n, gl.FLOAT, false, 0, 0);
      return buf!;
    };
    buffers.forEach((b) => gl.deleteBuffer(b));
    buffers = [mk(pos, 3, loc.pos), mk(col, 3, loc.col), mk(siz, 1, loc.size)];

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.uniform1f(loc.focal, FOCAL);
    gl.uniform1f(loc.aspect, W / H);
    gl.uniform1f(loc.dpr, dpr);
    // resize fires constantly on mobile (URL-bar collapse); never leave the
    // previous rAF chain running or the draws multiply
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    draw();
  };

  const draw = () => {
    if (destroyed || !count) return;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (autoSway) {
      // touch: drag would fight page scroll, so the head performs itself
      if (reducedMotion) {
        gl.uniform2f(loc.rot, 0, 0);
        gl.drawArrays(gl.POINTS, 0, count);
        raf = null;
        return;
      }
      spin += 0.0022;
      gl.uniform2f(loc.rot, Math.sin(spin) * 0.42, Math.sin(spin * 0.6) * 0.12);
      gl.drawArrays(gl.POINTS, 0, count);
      raf = requestAnimationFrame(draw);
      return;
    }

    gl.uniform2f(loc.rot, yaw, pitch);
    gl.drawArrays(gl.POINTS, 0, count);

    if (!drag) {
      yaw += vYaw;
      pitch += vPitch;
      vYaw *= 0.94;
      vPitch *= 0.94;
      yaw *= 0.988; // drift back to face-on so it never rests at an odd angle
      pitch *= 0.988;
      pitch = Math.max(-0.45, Math.min(0.45, pitch));
      if (
        Math.abs(vYaw) > 0.00015 ||
        Math.abs(vPitch) > 0.00015 ||
        Math.abs(yaw) > 0.0015 ||
        Math.abs(pitch) > 0.0015
      ) {
        raf = requestAnimationFrame(draw);
        return;
      }
      // settled: draw one final frame face-on and stop burning frames
      yaw = 0;
      pitch = 0;
      vYaw = 0;
      vPitch = 0;
      gl.uniform2f(loc.rot, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
      raf = null;
      return;
    }
    raf = requestAnimationFrame(draw);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (autoSway) return;
    drag = { x: e.clientX, y: e.clientY };
    vYaw = 0;
    vPitch = 0;
    canvas.style.cursor = "grabbing";
    if (!touched) {
      touched = true;
      onFirstDrag?.();
    }
    try {
      canvas.setPointerCapture?.(e.pointerId);
    } catch {
      /* not fatal */
    }
    kick();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    vYaw = dx * 0.006;
    vPitch = -dy * 0.005;
    yaw += vYaw;
    pitch = Math.max(-0.45, Math.min(0.45, pitch + vPitch));
    kick();
  };
  const release = () => {
    if (!drag) return;
    drag = null;
    canvas.style.cursor = "grab";
    kick();
  };

  if (autoSway) {
    canvas.style.cursor = "default";
    canvas.style.touchAction = "auto";
  } else {
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    canvas.addEventListener("pointerleave", release);
  }

  // dot pitch is defined in css px, so a size change means a full rebuild
  const ro = new ResizeObserver(() => build());
  ro.observe(canvas);
  window.addEventListener("resize", build);
  build();

  return {
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", build);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", release);
      canvas.removeEventListener("pointerleave", release);
      buffers.forEach((b) => gl.deleteBuffer(b));
    },
  };
}

/**
 * Fallback for when only a cutout portrait is supplied (path 2 in the spec):
 * derive a depth map from the alpha mask plus luminance. Not a reconstruction,
 * but it parallaxes convincingly — and the engine lathes its own volume from
 * the silhouette anyway, so this mainly supplies front-surface relief.
 */
export function synthesiseDepth(photo: HTMLImageElement): HTMLCanvasElement | null {
  const h = Math.min(360, photo.naturalHeight || photo.height);
  const w = Math.max(2, Math.round(h * ((photo.naturalWidth || photo.width) / (photo.naturalHeight || photo.height))));
  const src = document.createElement("canvas");
  src.width = w;
  src.height = h;
  const sx = src.getContext("2d");
  if (!sx) return null;
  sx.drawImage(photo, 0, 0, w, h);
  const data = sx.getImageData(0, 0, w, h).data;
  const G = w * h;

  const mask = new Uint8Array(G);
  for (let j = 0; j < G; j++) if (data[j * 4 + 3] > 128) mask[j] = 1;

  // chamfer distance to the silhouette edge -> a dome that falls off at the rim
  const dist = new Float32Array(G);
  for (let j = 0; j < G; j++) dist[j] = mask[j] ? 9999 : 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const j = y * w + x;
      if (!dist[j]) continue;
      let m = dist[j];
      if (x > 0) m = Math.min(m, dist[j - 1] + 1);
      if (y > 0) m = Math.min(m, dist[j - w] + 1);
      dist[j] = m;
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const j = y * w + x;
      if (!dist[j]) continue;
      let m = dist[j];
      if (x < w - 1) m = Math.min(m, dist[j + 1] + 1);
      if (y < h - 1) m = Math.min(m, dist[j + w] + 1);
      dist[j] = m;
    }
  }
  let maxD = 1;
  for (let j = 0; j < G; j++) if (dist[j] < 9999 && dist[j] > maxD) maxD = dist[j];

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ox = out.getContext("2d");
  if (!ox) return null;
  const img = ox.createImageData(w, h);
  for (let j = 0; j < G; j++) {
    let v = 0;
    if (mask[j]) {
      const dome = Math.sqrt(Math.min(1, dist[j] / maxD));
      const i = j * 4;
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      v = Math.max(0, Math.min(1, 0.24 + dome * 0.54 + lum * 0.22));
    }
    const g = Math.round(v * 255);
    const i = j * 4;
    img.data[i] = g;
    img.data[i + 1] = g;
    img.data[i + 2] = g;
    img.data[i + 3] = 255;
  }
  ox.putImageData(img, 0, 0);
  return out;
}
