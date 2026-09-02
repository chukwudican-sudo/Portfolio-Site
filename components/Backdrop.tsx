"use client";

import { useEffect, useRef } from "react";

/**
 * Page backdrop, in two layers with different anchoring:
 *
 *  - the beam is absolute, so it belongs to the top of the document and
 *    scrolls away like any other element
 *  - the particle field is fixed, so it stays behind the page as you scroll
 *
 * Both are pointer-events:none and sit under the content.
 */
export function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let raf = 0;

    type P = {
      x: number;
      y: number;
      px: number;
      py: number;
      r: number;
      a: number;
      /** constant drift */
      vx: number;
      vy: number;
      /** impulse from the cursor, decays under drag */
      ix: number;
      iy: number;
      /** twinkle: phase offset and rate, in radians and radians per ms */
      ph: number;
      pr: number;
      /** frames left in a dash; 0 means drifting normally */
      zap: number;
      zvx: number;
      zvy: number;
    };
    let parts: P[] = [];

    const pointer = { x: -1, y: -1 };
    // The disturbance trails the cursor instead of being pinned to it. Move
    // fast and the pointer arrives first, the scatter catching up along the
    // path; move slowly and the probe sits on the cursor, so the lag never
    // shows. Chasing the cursor exactly made a flick scatter a whole stripe at
    // once, which reads as a swipe rather than a touch.
    const probe = { x: -1, y: -1 };
    const FOLLOW = 0.09;
    const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

    // Surface-tension scatter: the cursor is the drop of soap. Particles it
    // reaches take a real impulse outward and keep the ground they gained,
    // leaving a clearing behind that only refills as they drift back.
    // The beam is the only light source. Particles are lit by how close they
    // are to it *in document space* — the beam scrolls away with the page, so
    // lighting by screen position would leave the top of the viewport bright
    // long after the beam was gone. Reading scroll into the falloff means the
    // field simply darkens as you leave the light, which is the honest result.
    let scrollY = 0;
    // The beam brightens what it reaches; it never dims anything. Away from it
    // the field keeps its own brightness, so the whole page stays populated.
    const LIGHT_BOOST = 3.4;

    const TOUCH_R = 128;  // how far the disturbance reaches
    const PUSH = 2.4;     // impulse per frame at the centre
    const DRAG = 0.93;    // how quickly the scatter settles

    // Bloom sprite: one radial gradient rasterised once, then scaled per
    // particle. Filling a plain circle gives a visible rim; building a gradient
    // per particle per frame would be far too expensive for a few hundred.
    const SP = 64;
    const sprite = document.createElement("canvas");
    sprite.width = SP;
    sprite.height = SP;
    {
      const sctx = sprite.getContext("2d");
      if (sctx) {
        const g = sctx.createRadialGradient(SP / 2, SP / 2, 0, SP / 2, SP / 2, SP / 2);
        g.addColorStop(0, "rgba(255,244,232,0.95)");
        g.addColorStop(0.18, "rgba(255,232,208,0.42)");
        g.addColorStop(0.45, "rgba(250,205,170,0.13)");
        g.addColorStop(1, "rgba(240,180,132,0)");
        sctx.fillStyle = g;
        sctx.fillRect(0, 0, SP, SP);
      }
    }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(260, Math.max(70, (w * h) / 7600)));
      parts = Array.from({ length: count }, () => {
        // three speed classes so the field never reads as one uniform drift
        const tier = Math.random();
        const speed = tier < 0.55 ? rand(0.06, 0.2) : tier < 0.9 ? rand(0.2, 0.55) : rand(0.55, 1.15);
        const dir = Math.random() * Math.PI * 2;
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          px: x,
          py: y,
          r: rand(0.35, 0.95),
          a: rand(0.14, 0.5),
          vx: Math.cos(dir) * speed,
          vy: Math.sin(dir) * speed,
          ix: 0,
          iy: 0,
          // random phase so the field never pulses in unison, and a range of
          // rates so some breathe slowly while others flicker
          ph: Math.random() * Math.PI * 2,
          pr: rand(0.0007, 0.0032),
          zap: 0,
          zvx: 0,
          zvy: 0,
        };
      });
    };

    // every so often, one particle bolts across the screen and then settles
    let nextZap = 0;
    const scheduleZap = (now: number) => {
      nextZap = now + rand(420, 1900);
    };

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // beam source: above the fold, horizontally centred
      const bx = w * 0.5;
      const by = -0.16 * h;
      const RX = w * 0.78;
      const RY = h * 1.05;

      // ease the probe toward the cursor
      if (pointer.x >= 0) {
        if (probe.x < 0) {
          probe.x = pointer.x;
          probe.y = pointer.y;
        } else {
          probe.x += (pointer.x - probe.x) * FOLLOW;
          probe.y += (pointer.y - probe.y) * FOLLOW;
        }
      }

      if (now > nextZap && parts.length) {
        const p = parts[(Math.random() * parts.length) | 0];
        if (p.zap === 0) {
          const dir = Math.random() * Math.PI * 2;
          const speed = rand(7, 15);
          p.zvx = Math.cos(dir) * speed;
          p.zvy = Math.sin(dir) * speed;
          p.zap = Math.round(rand(7, 16));
        }
        scheduleZap(now);
      }

      for (const p of parts) {
        p.px = p.x;
        p.py = p.y;

        // the probe breaks the surface: everything it reaches is kicked away
        if (probe.x >= 0) {
          const ox = p.x - probe.x;
          const oy = p.y - probe.y;
          const d2 = ox * ox + oy * oy;
          if (d2 < TOUCH_R * TOUCH_R) {
            const d = Math.sqrt(d2) || 0.001;
            const t = 1 - d / TOUCH_R;
            const f = t * t * PUSH;
            p.ix += (ox / d) * f;
            p.iy += (oy / d) * f;
          }
        }
        p.ix *= DRAG;
        p.iy *= DRAG;

        if (p.zap > 0) {
          p.x += p.zvx + p.ix;
          p.y += p.zvy + p.iy;
          // ease out of the dash so it decelerates into a stop rather than
          // snapping back to its drift
          p.zvx *= 0.9;
          p.zvy *= 0.9;
          p.zap -= 1;
        } else {
          p.x += p.vx + p.ix;
          p.y += p.vy + p.iy;
        }

        if (p.x < -8) { p.x = w + 8; p.px = p.x; }
        else if (p.x > w + 8) { p.x = -8; p.px = p.x; }
        if (p.y < -8) { p.y = h + 8; p.py = p.y; }
        else if (p.y > h + 8) { p.y = -8; p.py = p.y; }

        // a particle still carrying its kick reads brighter, the way scattering
        // pepper catches the light
        const scatter = Math.abs(p.ix) + Math.abs(p.iy);
        const lift = Math.min(0.45, scatter * 0.12);
        // dim -> bright -> dim, each on its own clock
        const twinkle = 0.34 + 0.66 * (0.5 + 0.5 * Math.sin(now * p.pr + p.ph));

        // distance from the beam, measured down the document rather than the
        // screen, on an ellipse because the beam is wider than it is tall
        const ndx = (p.x - bx) / RX;
        const ndy = (p.y + scrollY - by) / RY;
        const falloff = Math.max(0, 1 - Math.sqrt(ndx * ndx + ndy * ndy));
        const glow = falloff * falloff;
        const illum = 1 + LIGHT_BOOST * glow;
        const x = p.x;
        const y = p.y;

        // a dashing particle draws its streak; a drifting one is just a speck
        if (p.zap > 0) {
          ctx.globalAlpha = Math.min(1, p.a * twinkle * illum + 0.4);
          ctx.strokeStyle = "#FFF6EC";
          ctx.lineWidth = Math.max(0.5, p.r);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          // under the beam they also swell slightly and pick up its warmth,
          // so "lit" reads as more than just a higher alpha
          const rr = p.r * (1 + 0.85 * glow);
          if (glow > 0.015) {
            // continuous, so the bloom fades in with distance instead of
            // switching on at a threshold
            const size = rr * (5 + 16 * glow);
            ctx.globalAlpha = Math.min(0.85, glow * 0.95);
            ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
          }
          ctx.globalAlpha = Math.min(1, p.a * twinkle * illum + lift);
          ctx.fillStyle = lift > 0.05 ? "#F0C6A8" : glow > 0.4 ? "#FFF3E4" : "#F2EDE4";
          ctx.beginPath();
          ctx.arc(x, y, rr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -1;
      pointer.y = -1;
      probe.x = -1;
      probe.y = -1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    onScroll();

    build();
    scheduleZap(performance.now());
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", build);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Beam — absolute, so it belongs to the top of the page and scrolls out
          of view rather than following the viewport. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[74vh] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.58]"
          style={{
            background:
              "radial-gradient(120% 100% at 50% -22%, rgba(240,180,132,0.30) 0%, rgba(224,138,92,0.13) 32%, rgba(194,96,58,0.05) 52%, transparent 72%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[46%] opacity-[0.5]"
          style={{
            background:
              "radial-gradient(52% 100% at 50% -12%, rgba(255,238,222,0.24) 0%, rgba(240,180,132,0.08) 46%, transparent 74%)",
          }}
        />
      </div>

      {/* Particles — fixed, so the field stays behind the page while scrolling. */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0" />
    </>
  );
}
