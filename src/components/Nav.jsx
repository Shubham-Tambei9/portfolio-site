import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Floating capsule nav. Detached from the top edge, glass-blurred, with an
   indicator that slides between links via a shared layoutId. Condenses once the
   page is scrolled. */
/* Clicking a link whose hash is already current fires no hashchange, so the
   router never runs. Handle that case directly. */
function sectionClick(id) {
  return (e) => {
    const target = `#/#${id}`;
    if (window.location.hash === target) {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
}

export default function Nav({ links, cta, brand, extra = null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(links[0]?.id ?? null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);

      // The active section is the one whose top sits closest ABOVE the line —
      // decided by position on the page, never by order in the links array.
      const line = window.innerHeight * 0.35;
      let current = null;
      let best = -Infinity;
      links.forEach((l) => {
        const el = document.getElementById(l.id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          current = l.id;
        }
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [links]);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  return (
    <header className={`navx ${scrolled ? 'navx-scrolled' : ''}`}>
      <div className="navx-inner">
        <a className="navx-brand" href="#/">
          <img src={brand.logo} alt="" />
          <span>{brand.name}</span>
        </a>

        <nav className="navx-pill">
          {links.map((l) => {
            const on = active === l.id;
            return (
              <a
                key={l.id}
                href={`#/#${l.id}`}
                onClick={sectionClick(l.id)}
                className={`navx-link ${on ? 'navx-link-on' : ''}`}
              >
                {on && !reduce && (
                  <motion.span
                    layoutId="navx-indicator"
                    className="navx-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {on && reduce && <span className="navx-indicator" />}
                <span className="navx-link-text">{l.label}</span>
              </a>
            );
          })}
          {extra && (
            <a href={extra.href} className="navx-link">
              <span className="navx-link-text">{extra.label}</span>
            </a>
          )}
        </nav>

        <div className="navx-right">
          {cta && (
            <a className="navx-cta" href={cta.href} target="_blank" rel="noreferrer">
              <span className="navx-cta-dot" />
              {cta.label}
            </a>
          )}
          <button
            className="navx-burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`burger-bar ${menuOpen ? 'b1' : ''}`} />
            <span className={`burger-bar ${menuOpen ? 'b2' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="navx-drawer">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#/#${l.id}`}
              onClick={(e) => {
                sectionClick(l.id)(e);
                setMenuOpen(false);
              }}
            >
              {l.label}
            </a>
          ))}
          {extra && (
            <a href={extra.href} onClick={() => setMenuOpen(false)}>
              {extra.label}
            </a>
          )}
          {cta && (
            <a className="navx-drawer-cta" href={cta.href} target="_blank" rel="noreferrer">
              {cta.label}
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
