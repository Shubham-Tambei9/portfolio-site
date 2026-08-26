import { useEffect, useState, useRef } from 'react';
import { PROFILE } from './data/profile.js';
import Backdrop from './components/Backdrop.jsx';
import ScrollRail from './components/ScrollRail.jsx';
import Nav from './components/Nav.jsx';
import Feedback from './components/Feedback.jsx';
import Home from './pages/Home.jsx';

const NAV = [
  { id: 'focus', label: 'Focus' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

const RAIL_SECTIONS = [
  { id: 'glance', label: 'At a glance' },
  { id: 'focus', label: 'Focus' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'activity', label: 'Activity' },
  { id: 'contact', label: 'Contact' },
];

/* Hash routing: "#/route#section". Splitting route from section keeps section
   links deep-linkable while one place decides scroll behaviour.
 *
 * Two things stop the page reopening half way down:
 *   - scroll restoration is set to manual, so the browser does not put a
 *     reloaded SPA back where it was before the content had rendered
 *   - once a section scroll has run, the section is stripped from the URL with
 *     replaceState. A shared "#/#research" link still lands on Research, but the
 *     address bar settles back to "#/" so opening or reloading the site later
 *     always starts at the top. replaceState fires no hashchange, so this cannot
 *     loop. */
function parseHash(h) {
  const raw = (h || '#/').replace(/^#/, '');
  const [route, section] = raw.split('#');
  return { route: route || '/', section: section || null };
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  // Remembers which page we were on, so clearing a section never counts as
  // navigation and therefore never yanks the view back to the top.
  const prevRoute = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const onChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const { route, section } = parseHash(hash);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const routeChanged = prevRoute.current !== route;
      prevRoute.current = route;

      if (section) {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Drop the section so a later reload starts at the top again, and keep
          // React in step: replaceState fires no hashchange, so without this the
          // stored hash would stay stale and clicking the same link twice would
          // produce no state change, and no scroll.
          const clean = `#${route}`;
          window.history.replaceState(null, '', clean);
          setHash(clean);
          return;
        }
      }

      // Only reset on a real page change. Without this guard the cleanup above
      // re-enters here with section === null and cancels the scroll it just did.
      if (routeChanged) window.scrollTo({ top: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(id);
  }, [route, section]);

  return { route, section };
}

export default function App() {
  useHashRoute();

  return (
    <>
      <Backdrop />
      <Feedback />
      <ScrollRail sections={RAIL_SECTIONS} />
      <Nav
        links={NAV}
        brand={{ name: PROFILE.first.toUpperCase(), logo: '/assets/avatar.jpg' }}
        cta={{ href: `mailto:${PROFILE.email}`, label: 'Hire me' }}
      />

      <Home />

      <footer className="footer">
        <div className="wrap">
          <div className="footer-inner">
            <div className="footer-brand">
              <a className="brand" href="#/">
                <img src="/assets/avatar.jpg" alt="" />
                {PROFILE.first.toUpperCase()}
              </a>
              <p className="section-sub" style={{ fontSize: 13.5 }}>
                {PROFILE.title} · {PROFILE.location}
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-col">
                <span className="footer-col-title">Site</span>
                {NAV.map((n) => (
                  <a key={n.id} href={`#/#${n.id}`}>
                    {n.label}
                  </a>
                ))}
              </div>
              <div className="footer-col">
                <span className="footer-col-title">Elsewhere</span>
                <a href={PROFILE.githubUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href={PROFILE.studio.url} target="_blank" rel="noreferrer">
                  Arcadly (game studio)
                </a>
                <a href={`mailto:${PROFILE.email}`}>Email</a>
              </div>
            </div>
          </div>

          <p className="footer-note">© 2026 {PROFILE.name}</p>
        </div>
      </footer>
    </>
  );
}
