import { useEffect, useState, useRef } from 'react';
import { PROFILE } from './data/profile.js';
import Backdrop from './components/Backdrop.jsx';
import ScrollRail from './components/ScrollRail.jsx';
import Nav from './components/Nav.jsx';
import Feedback from './components/Feedback.jsx';
import BackToTop from './components/BackToTop.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

/* #9 — Added Skills and Journey to nav */
const NAV = [
  { id: 'focus', label: 'Focus' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Skills' },
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

/* Hash routing: "#/route#section". */
function parseHash(h) {
  const raw = (h || '#/').replace(/^#/, '');
  const [route, section] = raw.split('#');
  return { route: route || '/', section: section || null };
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
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
          const clean = `#${route}`;
          window.history.replaceState(null, '', clean);
          setHash(clean);
          return;
        }
      }

      if (routeChanged) window.scrollTo({ top: 0, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(id);
  }, [route, section]);

  return { route, section };
}

export default function App() {
  const { route } = useHashRoute();

  /* #11 — Dynamic copyright year */
  const year = new Date().getFullYear();

  return (
    <>
      <Backdrop />
      <Feedback />
      <ScrollRail sections={RAIL_SECTIONS} />
      <Nav
        links={NAV}
        brand={{ name: PROFILE.first.toUpperCase(), logo: '/assets/avatar.jpg' }}
        cta={{ href: `mailto:${PROFILE.email}`, label: 'Hire me' }}
        /* #13 — ThemeToggle passed as extra slot */
        extra={null}
      />

      {/* #13 — Theme toggle floats in top-right */}
      <ThemeToggle />

      {/* #17 — 404 routing */}
      {route === '/' ? <Home /> : <NotFound />}

      {/* #14 — Back to top */}
      <BackToTop />

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
                <a href={PROFILE.figma} target="_blank" rel="noreferrer">
                  Figma
                </a>
                <a href={PROFILE.studio.url} target="_blank" rel="noreferrer">
                  Arcadly (game studio)
                </a>
                <a href={`mailto:${PROFILE.email}`}>Email</a>
              </div>
            </div>
          </div>

          {/* #11 — Dynamic year */}
          <p className="footer-note">© {year} {PROFILE.name}</p>
        </div>
      </footer>
    </>
  );
}
