import { useState, useEffect } from 'react';
import { PROFILE, ROLES, STATS, LINKS } from '../data/profile.js';
import { PROJECTS, CATEGORY_META, CATEGORIES } from '../data/projects.js';
import { RESEARCH_PAPERS } from '../data/research.js';
import { SKILLS } from '../data/skills.js';
import { COURSEWORK_GROUPS } from '../data/education.js';
import { ThinkingOrb } from 'thinking-orbs';
import Activity from '../components/Activity.jsx';
import Journey from '../components/Journey.jsx';
import Focus from '../components/Focus.jsx';
import { Reveal, Stagger, StaggerItem } from '../components/Motion.jsx';

/* Counted from the data files, so these can never drift from the sections below. */
const KPIS = [
  { value: String(PROJECTS.length), label: 'Projects built' },
  { value: String(RESEARCH_PAPERS.length), label: 'Papers published' },
  { value: String(SKILLS.reduce((n, s) => n + s.items.length, 0)), label: 'Technologies used' },
  { value: '1', label: 'Game live on Play' },
];

function ProjectCard({ p }) {
  const meta = CATEGORY_META[p.category] || {};
  return (
    <article className="game spot">
      {p.image ? (
        <div className="proj-shot">
          <img src={p.image} alt="" loading="lazy" />
          <span
            className="proj-badge"
            style={{ background: `${meta.color}22`, borderColor: `${meta.color}55`, color: meta.color }}
          >
            {meta.label || p.domain}
          </span>
        </div>
      ) : (
        <div className="proj-shot proj-shot-empty">
          <span
            className="proj-badge"
            style={{ background: `${meta.color}22`, borderColor: `${meta.color}55`, color: meta.color }}
          >
            {meta.label || p.domain}
          </span>
        </div>
      )}

      <div className="proj-body">
        <h3 className="game-name">{p.name}</h3>
        <span className="game-cat">{p.period}</span>
        <p className="game-desc">{p.description}</p>

        <div className="game-tags">
          {p.stack.slice(0, 5).map((s) => (
            <span className="pill" key={s}>
              {s}
            </span>
          ))}
        </div>

        <div className="game-actions">
          {p.github ? (
            <a className="game-cta-alt" href={p.github} target="_blank" rel="noreferrer">
              View source ↗
            </a>
          ) : (
            <span className="game-cta-off">Source not public</span>
          )}
          {p.website && (
            <a className="game-cta" href={p.website} target="_blank" rel="noreferrer">
              Live site ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

const HERO_ORB_STATES = ['solving', 'searching', 'listening'];

export default function Home() {
  const [cat, setCat] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [openPaper, setOpenPaper] = useState(null);
  const [heroOrbStateIdx, setHeroOrbStateIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroOrbStateIdx((prev) => (prev + 1) % HERO_ORB_STATES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const heroOrbState = HERO_ORB_STATES[heroOrbStateIdx];

  const toggleHeroOrb = () => {
    setHeroOrbStateIdx((prev) => (prev + 1) % HERO_ORB_STATES.length);
  };

  const filtered = PROJECTS.filter((p) => cat === 'all' || p.category === cat);
  const shown = showAll ? filtered : filtered.slice(0, 6);

  return (
    <main id="top">
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="wrap hero-inner">
          <span className="hero-badge">
            <span className="dot" aria-hidden="true" />
            Open to opportunities · graduating 2026
          </span>
          <span className="hero-kicker">{PROFILE.kicker}</span>
          <h1 className="hero-title">
            {PROFILE.first}
            <br />
            {PROFILE.last}
          </h1>
          <p className="hero-tagline">{PROFILE.tagline}</p>
          <p className="hero-blurb">{PROFILE.bio}</p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#/#projects">
              See the work
            </a>
            <a className="btn btn-ghost" href={`mailto:${PROFILE.email}`}>
              Get in touch
            </a>
          </div>

          <div
            className="hero-orb"
            onClick={toggleHeroOrb}
            title={`ThinkingOrb state: ${heroOrbState} (Click to toggle)`}
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            <ThinkingOrb state={heroOrbState} size={480} speed={1.55} />
          </div>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section className="section" id="glance">
        <div className="wrap">
          <div className="stats-head">
            <span className="stats-label">At a glance</span>
            <span className="stats-asof">as of {STATS.asOf}</span>
          </div>
          <div className="stats-grid">
            {KPIS.map((k) => (
              <div className="stat spot" key={k.label}>
                <span className="stat-value">{k.value}</span>
                <span className="stat-label">{k.label}</span>
              </div>
            ))}
          </div>
          <p className="stats-source">{STATS.source}</p>
        </div>
      </section>

      <Focus />

      {/* PROJECTS */}
      <section className="section" id="projects">
        <div className="wrap">
          <span className="eyebrow">The work</span>
          <h2 className="section-title">
            Nineteen projects,
            <br />
            four disciplines.
          </h2>
          <p className="section-sub">
            Machine learning, web, data analysis and interface design. Where a repo is public it is
            linked; where it is not, the card says so rather than shipping a dead button.
          </p>

          <div className="tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`tab ${cat === c.id ? 'tab-on' : ''}`}
                onClick={() => {
                  setCat(c.id);
                  setShowAll(false);
                }}
              >
                {c.label}
                <span className="tab-count">
                  {c.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === c.id).length}
                </span>
              </button>
            ))}
          </div>

          <Stagger className="games-grid" key={cat}>
            {shown.map((p) => (
              <StaggerItem key={p.n}>
                <ProjectCard p={p} />
              </StaggerItem>
            ))}
          </Stagger>

          {filtered.length > 6 && (
            <div className="more-row">
              <button className="btn btn-ghost" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show fewer' : `Show all ${filtered.length}`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* RESEARCH */}
      <section className="section" id="research">
        <div className="wrap">
          <span className="eyebrow">Published research</span>
          <h2 className="section-title">Five papers.</h2>
          <p className="section-sub">
            Across Springer Nature, IEEE Xplore, ICICC/SSRN and GRENZE. Each links to the
            publisher — the abstracts are the published text, not summaries.
          </p>

          <div className="papers">
            {RESEARCH_PAPERS.map((p, i) => {
              const open = openPaper === i;
              return (
                <article className={`paper spot ${open ? 'paper-open' : ''}`} key={p.title}>
                  <div className="paper-head">
                    <div className="paper-meta">
                      <span className="paper-venue">{p.journal}</span>
                      <span className="paper-date">{p.date}</span>
                      <span className="paper-status">{p.status}</span>
                    </div>
                    <h3 className="paper-title">{p.title}</h3>
                  </div>

                  {open && (
                    <div className="paper-body">
                      <div className="paper-abstract-col">
                        <span className="paper-sublabel">Abstract</span>
                        <p className="paper-abstract">{p.abstract}</p>
                      </div>

                      <aside className="paper-aside">
                        {p.authors && (
                          <div className="paper-aside-block">
                            <span className="paper-sublabel">Authors</span>
                            <p className="paper-aside-text">{p.authors}</p>
                          </div>
                        )}
                        <div className="paper-aside-block">
                          <span className="paper-sublabel">Published in</span>
                          <p className="paper-aside-text">{p.journal}</p>
                          <p className="paper-aside-dim">{p.date}</p>
                        </div>
                        {!!p.keywords?.length && (
                          <div className="paper-aside-block">
                            <span className="paper-sublabel">Keywords</span>
                            <div className="game-tags" style={{ marginTop: 10 }}>
                              {p.keywords.slice(0, 10).map((k) => (
                                <span className="pill" key={k}>
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </aside>
                    </div>
                  )}

                  <div className="paper-actions">
                    <button className="mini-btn" onClick={() => setOpenPaper(open ? null : i)}>
                      {open ? 'Hide abstract' : 'Read abstract'}
                    </button>
                    {p.url && (
                      <a className="mini-btn" href={p.url} target="_blank" rel="noreferrer">
                        View publication ↗
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Journey />

      {/* SKILLS */}
      <section className="section" id="skills">
        <div className="wrap">
          <span className="eyebrow">Toolkit</span>
          <h2 className="section-title">What I build with.</h2>
          <p className="section-sub">Grouped by what they are actually for.</p>
          <Stagger className="stack-groups">
            {SKILLS.map((g) => (
              <StaggerItem className="stack-group spot" key={g.label}>
                <span className="stack-group-title">{g.label}</span>
                <div className="stack-row" style={{ marginTop: 14 }}>
                  {g.items.map((i) => (
                    <span className="stack-chip" key={i}>
                      {i}
                    </span>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="coursework">
            <div className="coursework-head">
              <span className="stack-group-title">Relevant coursework</span>
              <span className="coursework-src">
                B.Tech Information Technology · VIT Pune
              </span>
            </div>

            <Stagger className="course-grid">
              {COURSEWORK_GROUPS.map((g) => (
                <StaggerItem className="course-group spot" key={g.label}>
                  <div className="course-group-head">
                    <span className="dot" aria-hidden="true" />
                    <span className="course-group-title">{g.label}</span>
                    <span className="course-count">{g.items.length}</span>
                  </div>
                  <ul className="course-list">
                    {g.items.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <Activity />

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
            <h2 className="section-title">
              Let’s build
              <br />
              something.
            </h2>
            <p className="section-sub">
              Open to internships, full-time roles and collaborations in AI/ML, software
              development and research.
            </p>
          </Reveal>

          <Stagger className="link-grid">
            <StaggerItem>
              <a className="link-card spot" href={`mailto:${PROFILE.email}`}>
                <span className="link-label">Email</span>
                <span className="link-handle">{PROFILE.email}</span>
                <span className="link-arrow">↗</span>
              </a>
            </StaggerItem>
            {LINKS.map((l) => (
              <StaggerItem key={l.label}>
                <a className="link-card spot" href={l.href} target="_blank" rel="noreferrer">
                  <span className="link-label">{l.label}</span>
                  <span className="link-handle">{l.handle}</span>
                  <span className="link-arrow">↗</span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </main>
  );
}
