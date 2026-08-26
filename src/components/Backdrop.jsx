import { useEffect } from 'react';

/* One pointer listener for the whole page, rAF-throttled, writing CSS custom
   properties. Nothing here triggers a React re-render — the effects are pure CSS
   reading --mx / --my, so moving the mouse costs a single style write per frame.
   Skipped entirely for pointer:coarse (touch) and prefers-reduced-motion. */
export default function Backdrop() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    document.body.classList.add('has-pointer-fx');

    let raf = 0;
    let px = 0;
    let py = 0;
    let card = null;
    let cardRect = null;

    const apply = () => {
      raf = 0;
      const root = document.documentElement;
      root.style.setProperty('--px', `${px}px`);
      root.style.setProperty('--py', `${py}px`);
      if (card && cardRect) {
        card.style.setProperty('--mx', `${px - cardRect.left}px`);
        card.style.setProperty('--my', `${py - cardRect.top}px`);
      }
    };

    const onMove = (e) => {
      px = e.clientX;
      py = e.clientY;

      const next = e.target instanceof Element ? e.target.closest('.spot') : null;
      if (next !== card) {
        if (card) card.classList.remove('spot-on');
        card = next;
        if (card) {
          card.classList.add('spot-on');
          cardRect = card.getBoundingClientRect();
        } else {
          cardRect = null;
        }
      } else if (card) {
        cardRect = card.getBoundingClientRect();
      }

      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (card) card.classList.remove('spot-on');
      card = null;
      cardRect = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove('has-pointer-fx');
    };
  }, []);

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-beam" aria-hidden="true" />
    </>
  );
}
