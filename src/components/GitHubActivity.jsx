import { useEffect, useState } from 'react';

/* Live contribution heatmap. GitHub publishes no official API for the
   contribution graph, so this uses a public community mirror that sends CORS
   headers. If it is down or rate-limited we show a link to the profile rather
   than a fabricated grid. */
const ENDPOINT = (user) => `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;

const LEVELS = [
  'rgba(255,255,255,0.05)',
  'rgba(34,197,94,0.28)',
  'rgba(34,197,94,0.5)',
  'rgba(34,197,94,0.72)',
  '#22c55e',
];

export default function GitHubActivity({ user }) {
  const [state, setState] = useState('loading'); // loading | ok | error
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch(ENDPOINT(user))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((json) => {
        if (!alive) return;
        const days = json?.contributions;
        if (!Array.isArray(days) || !days.length) throw new Error('shape');

        // Trim to whole weeks so the grid has no ragged first column.
        const recent = days.slice(-182);
        const chunked = [];
        for (let i = 0; i < recent.length; i += 7) chunked.push(recent.slice(i, i + 7));

        setWeeks(chunked);
        setTotal(recent.reduce((s, d) => s + (d.count || 0), 0));
        setState('ok');
      })
      .catch(() => alive && setState('error'));
    return () => {
      alive = false;
    };
  }, [user]);

  if (state === 'loading') {
    return <div className="gh-skeleton" aria-hidden="true" />;
  }

  if (state === 'error') {
    return (
      <div className="gh-fallback">
        <p>Contribution data is unavailable right now.</p>
        <a className="btn btn-ghost" href={`https://github.com/${user}`} target="_blank" rel="noreferrer">
          View profile on GitHub
        </a>
      </div>
    );
  }

  return (
    <div className="gh">
      <div className="gh-head">
        <span className="gh-title">{total} contributions</span>
        <span className="gh-note">last 26 weeks</span>
      </div>
      <div className="gh-grid" role="img" aria-label={`${total} GitHub contributions in the last 26 weeks`}>
        {weeks.map((w, wi) => (
          <div className="gh-week" key={wi}>
            {w.map((d, di) => (
              <span
                key={di}
                className="gh-day"
                style={{ background: LEVELS[d.level ?? 0] }}
                title={`${d.date}: ${d.count || 0} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="gh-legend">
        <span>Less</span>
        {LEVELS.map((c) => (
          <span key={c} className="gh-day" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
