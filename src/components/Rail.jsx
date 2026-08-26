import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* The travelling-packet rail, shared by the pipeline, the approach strip and the
   developer journey.

   Alignment note: the packet used to be placed at an even percentage of the
   track (step / (count - 1)). That only lines up with the nodes if the nodes are
   themselves evenly spread edge-to-edge, which they never are — grid cells centre
   their node inside the cell, and stacked cards have different heights. So the
   geometry is measured instead: we read each node's real centre and place both
   the line and the packet against those numbers. */

export function useSequence(ref, count, { dwell = 1150, gap = 700 } = {}) {
  const [head, setHead] = useState(-1);

  useEffect(() => {
    const node = ref.current;
    if (!node || !count) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHead(count - 1);
      return;
    }

    let timer = 0;
    let i = -1;

    const tick = () => {
      i = (i + 1) % (count + 1);
      const next = i >= count ? -1 : i;
      setHead(next);
      timer = window.setTimeout(tick, next === -1 ? gap : dwell);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          tick();
        } else if (!e.isIntersecting && timer) {
          clearTimeout(timer);
          timer = 0;
          i = -1;
          setHead(-1);
        }
      },
      { threshold: 0.2 }
    );

    io.observe(node);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [ref, count, dwell, gap]);

  return head;
}

/* Measures each node's centre relative to the rail container. Re-measures on
   resize and whenever the container's own box changes (font loading, wrapping,
   images settling). */
export function useRailGeometry(containerRef, nodeSelector) {
  const [points, setPoints] = useState([]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = el.getBoundingClientRect();
      const nodes = Array.from(el.querySelectorAll(nodeSelector));
      const next = nodes
        .filter((n) => n.offsetParent !== null) // skip nodes hidden at this breakpoint
        .map((n) => {
          const r = n.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - box.left,
            y: r.top + r.height / 2 - box.top,
          };
        });
      setPoints((prev) =>
        prev.length === next.length &&
        prev.every((p, i) => Math.abs(p.x - next[i].x) < 0.5 && Math.abs(p.y - next[i].y) < 0.5)
          ? prev
          : next
      );
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    Array.from(el.querySelectorAll(nodeSelector)).forEach((n) => ro.observe(n));
    window.addEventListener('resize', schedule);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef, nodeSelector]);

  return points;
}

/* Draws the track between the first and last node, and the packet exactly on the
   active node. Renders nothing until geometry is known, so it can never flash in
   the wrong place. */
export function RailLine({ head, points, orientation = 'horizontal' }) {
  if (!points || points.length < 2) return null;

  const vertical = orientation === 'vertical';
  const axis = vertical ? 'y' : 'x';
  const cross = vertical ? 'x' : 'y';

  const first = points[0][axis];
  const last = points[points.length - 1][axis];
  const crossPos = points[0][cross];
  const active = head >= 0 && head < points.length ? points[head] : null;

  const lineStyle = vertical
    ? { top: first, height: Math.max(last - first, 0), left: crossPos, transform: 'translateX(-50%)' }
    : { left: first, width: Math.max(last - first, 0), top: crossPos, transform: 'translateY(-50%)' };

  const packetStyle = active
    ? vertical
      ? { top: active.y, left: active.x, opacity: 1 }
      : { left: active.x, top: active.y, opacity: 1 }
    : vertical
      ? { top: first, left: crossPos, opacity: 0 }
      : { left: first, top: crossPos, opacity: 0 };

  return (
    <div className={`rl rl-${orientation}`} aria-hidden="true">
      <div className="rl-line" style={lineStyle} />
      <div className="rl-packet" style={packetStyle} />
    </div>
  );
}

export function RailNode({ state, className = '' }) {
  return (
    <span className={`rl-node rl-node-${state} ${className}`} aria-hidden="true">
      <span className="rl-node-core" />
    </span>
  );
}

export function nodeState(index, head) {
  if (head === index) return 'hot';
  if (head > index) return 'done';
  return 'idle';
}

export default useSequence;
