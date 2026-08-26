import { useEffect, useRef } from 'react';

/* A slow, organic blob on canvas.
 *
 * Built in layers so it reads as a volume rather than a flat radial fill:
 *   1. an outer aura that breathes slightly out of phase with the body
 *   2. two ghost silhouettes, offset and rotating slowly, for depth
 *   3. the body — a closed spline whose radius is perturbed by four sine
 *      octaves, so the outline never repeats exactly
 *   4. a specular highlight that drifts across the surface
 *   5. a thin rim light, brightest on the side nearest the pointer
 *
 * Drifts gently toward the cursor, pauses when scrolled out of view, and renders
 * one static frame under prefers-reduced-motion. */
export default function FluidOrb({ size = 300 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cx = size / 2;
    const cy = size / 2;
    const base = size * 0.27;

    let t = 0;
    let raf = 0;
    let visible = true;
    let tx = 0;
    let ty = 0;
    let ox = 0;
    let oy = 0;
    let pointerX = 0.5;
    let pointerY = 0.4;

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      tx = clamp(dx) * 18;
      ty = clamp(dy) * 18;
      pointerX = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      pointerY = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    };

    /* Radius at angle `a`, with `phase` letting ghost layers lag the body. */
    const radiusAt = (a, phase, scale) =>
      (base +
        Math.sin(a * 3 + t * 0.9 + phase) * 10 +
        Math.sin(a * 5 - t * 0.6 + phase) * 6 +
        Math.sin(a * 2 + t * 1.3 + phase) * 8 +
        Math.sin(a * 7 + t * 0.42 + phase) * 3.5) *
      scale;

    const tracePath = (phase, scale, dx, dy) => {
      const pts = 120;
      ctx.beginPath();
      for (let i = 0; i <= pts; i += 1) {
        const a = (i / pts) * Math.PI * 2;
        const r = radiusAt(a, phase, scale);
        const x = cx + ox + dx + Math.cos(a) * r;
        const y = cy + oy + dy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      ox += (tx - ox) * 0.05;
      oy += (ty - oy) * 0.05;

      const breathe = 1 + Math.sin(t * 0.7) * 0.02;

      // 1 — outer aura
      const aura = ctx.createRadialGradient(
        cx + ox,
        cy + oy,
        base * 0.5,
        cx + ox,
        cy + oy,
        base * 2.1
      );
      aura.addColorStop(0, 'rgba(34, 197, 94, 0.12)');
      aura.addColorStop(0.5, 'rgba(34, 197, 94, 0.05)');
      aura.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, size, size);

      // 2 — ghost silhouettes for depth
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      [
        { phase: 1.6, scale: 0.94, dx: -7, dy: 5, alpha: 0.1 },
        { phase: 3.1, scale: 0.88, dx: 8, dy: -6, alpha: 0.08 },
      ].forEach((g) => {
        tracePath(g.phase, g.scale * breathe, g.dx, g.dy);
        ctx.fillStyle = `rgba(74, 222, 128, ${g.alpha})`;
        ctx.fill();
      });
      ctx.restore();

      // 3 — body
      tracePath(0, breathe, 0, 0);
      const body = ctx.createRadialGradient(
        cx + ox - base * 0.35,
        cy + oy - base * 0.4,
        base * 0.08,
        cx + ox,
        cy + oy,
        base * 1.45
      );
      body.addColorStop(0, 'rgba(110, 240, 160, 0.5)');
      body.addColorStop(0.4, 'rgba(34, 197, 94, 0.26)');
      body.addColorStop(0.78, 'rgba(21, 128, 61, 0.16)');
      body.addColorStop(1, 'rgba(20, 83, 45, 0.02)');
      ctx.fillStyle = body;
      ctx.fill();

      // 4 — specular highlight, clipped to the body
      ctx.save();
      ctx.clip();
      const hx = cx + ox + Math.cos(t * 0.5) * base * 0.3 - base * 0.2;
      const hy = cy + oy + Math.sin(t * 0.4) * base * 0.24 - base * 0.28;
      const spec = ctx.createRadialGradient(hx, hy, 0, hx, hy, base * 0.85);
      spec.addColorStop(0, 'rgba(190, 255, 214, 0.3)');
      spec.addColorStop(0.45, 'rgba(134, 239, 172, 0.09)');
      spec.addColorStop(1, 'rgba(134, 239, 172, 0)');
      ctx.fillStyle = spec;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();

      // 5 — rim light, brightest toward the pointer
      tracePath(0, breathe, 0, 0);
      const rim = ctx.createLinearGradient(
        cx + ox - base,
        cy + oy - base,
        cx + ox + base,
        cy + oy + base
      );
      const lead = pointerX * 0.6 + pointerY * 0.4;
      rim.addColorStop(0, `rgba(134, 239, 172, ${0.14 + (1 - lead) * 0.3})`);
      rim.addColorStop(0.5, 'rgba(74, 222, 128, 0.18)');
      rim.addColorStop(1, `rgba(134, 239, 172, ${0.14 + lead * 0.3})`);
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    };

    if (reduce) {
      draw();
      return () => {};
    }

    const loop = () => {
      if (visible) {
        t += 0.011;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(canvas);

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [size]);

  return (
    <canvas
      ref={ref}
      className="fluid-orb"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
