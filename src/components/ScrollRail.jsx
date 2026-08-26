import { useEffect, useRef, useState } from 'react';

/* Vertical reading rail pinned to the right edge.
   - the track fills as you scroll
   - a glowing head rides the fill
   - one dot per section, lit once you have reached it, clickable to jump
   - a live percentage readout
   All driven by one rAF-throttled scroll listener. Hidden on narrow screens and
   under prefers-reduced-motion the travel is instant rather than eased. */
export default function ScrollRail({ sections = [] }) {
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState(null);
  const [hidden, setHidden] = useState(true);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0;
      setPct(p);
      setHidden(doc.scrollTop < 120);

      // The section whose top sits closest ABOVE the 40% line — chosen by
      // position on the page, not by order in the sections array.
      const line = window.innerHeight * 0.4;
      let current = null;
      let best = -Infinity;
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          current = s.id;
        }
      });
      setActive(current);
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sections]);

  if (!sections.length) return null;

  const passedIndex = sections.findIndex((s) => s.id === active);

  return (
    <aside className={`rail ${hidden ? 'rail-hidden' : ''}`} aria-hidden="true">
      <span className="rail-pct">{Math.round(pct)}</span>

      <div className="rail-track">
        <div className="rail-fill" style={{ height: `${pct}%` }} />
        <div className="rail-head" style={{ top: `${pct}%` }}>
          <span className="rail-head-core" />
          <span className="rail-head-ring" />
        </div>

        {sections.map((s, i) => (
          <button
            key={s.id}
            className={`rail-dot ${i <= passedIndex ? 'rail-dot-on' : ''}`}
            style={{ top: `${(i / Math.max(sections.length - 1, 1)) * 100}%` }}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
            tabIndex={-1}
          >
            <span className="rail-dot-mark" aria-hidden="true" />
            <span className="rail-dot-label">{s.label}</span>
          </button>
        ))}
      </div>

      <span className="rail-cap">%</span>
    </aside>
  );
}
