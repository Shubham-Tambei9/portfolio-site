import { useEffect, useMemo, useState } from 'react';
import Heatmap from './Heatmap.jsx';
import { PROFILE } from '../data/profile.js';
import monkeytypeData from '../assets/monkeytype-activity.json';

/* Three activity sources, three very different APIs, one presentation.
 *
 *   GitHub     — community mirror of the contribution graph (no official API).
 *                Year-scoped, so a year change means another request; results
 *                are cached so switching back is instant.
 *   LeetCode   — community API; submissionCalendar arrives as a JSON *string*
 *                of unix-second keys, so it needs parsing and date expansion.
 *                Covers several years at once, so years filter client-side.
 *   Monkeytype — a static file in this repo, refreshed every 2h by the GitHub
 *                Action in .github/workflows/update-monkeytype.yml.
 *
 * Range options are derived from each source's own data — a year is only
 * offered once we know it actually contains activity, so the filter can never
 * lead to an empty grid. Each tab also fails independently. */

const GH = (u, y) => `https://github-contributions-api.jogruber.de/v4/${u}?y=${y}`;
const LC = (u) => `https://alfa-leetcode-api.onrender.com/${u}/calendar`;
const LC_SOLVED = (u) => `https://alfa-leetcode-api.onrender.com/${u}/solved`;

const dayKey = (d) => d.toISOString().slice(0, 10);
const yearOf = (iso) => Number(String(iso).slice(0, 4));
const total = (days) => days.reduce((s, d) => s + (d.count || 0), 0);

/* Expand a sparse {unixSeconds: count} map into a continuous day list. */
function expandCalendar(map, days = 371) {
  const byDate = {};
  Object.entries(map || {}).forEach(([ts, count]) => {
    const d = new Date(Number(ts) * 1000);
    if (!Number.isNaN(d.getTime())) byDate[dayKey(d)] = (byDate[dayKey(d)] || 0) + Number(count);
  });
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = dayKey(d);
    out.push({ date: k, count: byDate[k] || 0 });
  }
  return out;
}

/* Build a full calendar year of days from a sparse map. */
function yearDays(map, year) {
  const byDate = {};
  Object.entries(map || {}).forEach(([ts, count]) => {
    const d = new Date(Number(ts) * 1000);
    if (!Number.isNaN(d.getTime())) byDate[dayKey(d)] = (byDate[dayKey(d)] || 0) + Number(count);
  });
  const out = [];
  const cur = new Date(Date.UTC(year, 0, 1));
  while (cur.getUTCFullYear() === year) {
    const k = dayKey(cur);
    out.push({ date: k, count: byDate[k] || 0 });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/* Parse Monkeytype's sparse array into a date-keyed count map. */
function getMonkeytypeMap(data) {
  const arr = data?.testsByDays;
  const last = data?.lastDay;
  if (!Array.isArray(arr) || !last) return {};
  const byDate = {};
  arr.forEach((v, i) => {
    const d = new Date(last - (arr.length - 1 - i) * 86400000);
    if (!Number.isNaN(d.getTime())) {
      byDate[dayKey(d)] = (byDate[dayKey(d)] || 0) + (Number(v) || 0);
    }
  });
  return byDate;
}

/* Build a continuous list of days from earliest recorded date up to today. */
function expandMonkeytype(data) {
  const arr = data?.testsByDays;
  const last = data?.lastDay;
  if (!Array.isArray(arr) || !last) return [];

  const byDate = getMonkeytypeMap(data);
  const today = new Date();
  const lastDate = new Date(last);
  const endDate = today > lastDate ? today : lastDate;
  const earliestDate = new Date(last - (arr.length - 1) * 86400000);

  const out = [];
  const cur = new Date(earliestDate);
  while (cur <= endDate) {
    const k = dayKey(cur);
    out.push({ date: k, count: byDate[k] || 0 });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/* Build a full calendar year of days from a { "YYYY-MM-DD": count } map. */
function yearDaysByDate(byDate, year) {
  const out = [];
  const cur = new Date(Date.UTC(year, 0, 1));
  while (cur.getUTCFullYear() === year) {
    const k = dayKey(cur);
    out.push({ date: k, count: byDate[k] || 0 });
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

function RangePicker({ options, value, onChange }) {
  if (options.length < 2) return null;
  return (
    <div className="range-picker" role="group" aria-label="Time range">
      {options.map((o) => (
        <button
          key={o.id}
          className={`range-btn ${value === o.id ? 'range-btn-on' : ''}`}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Panel({ status, profileUrl, children }) {
  if (status === 'loading') return <div className="gh-skeleton" aria-hidden="true" />;
  if (status === 'error') {
    return (
      <div className="gh-fallback">
        <p>That service is not responding right now.</p>
        <a className="btn btn-ghost" href={profileUrl} target="_blank" rel="noreferrer">
          Open the profile ↗
        </a>
      </div>
    );
  }
  return children;
}

export default function Activity() {
  const [tab, setTab] = useState('github');

  /* ---------- GitHub ---------- */
  const [ghCache, setGhCache] = useState({});
  const [ghYears, setGhYears] = useState([]);
  const [ghRange, setGhRange] = useState('last');
  const [ghStatus, setGhStatus] = useState('loading');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(GH(PROFILE.github, 'last'));
        if (!r.ok) throw new Error();
        const j = await r.json();
        if (!Array.isArray(j?.contributions)) throw new Error();
        const last = j.contributions.map((d) => ({ date: d.date, count: d.count || 0 }));
        if (!alive) return;
        setGhCache({ last });
        setGhStatus('ok');

        // Probe the calendar years this span touches; keep the ones with activity.
        const years = [...new Set(last.map((d) => yearOf(d.date)))].sort((a, b) => b - a);
        const probes = await Promise.all(
          years.map(async (y) => {
            try {
              const rr = await fetch(GH(PROFILE.github, y));
              if (!rr.ok) return null;
              const jj = await rr.json();
              const days = (jj?.contributions || []).map((d) => ({
                date: d.date,
                count: d.count || 0,
              }));
              return total(days) > 0 ? { y, days } : null;
            } catch {
              return null;
            }
          })
        );
        if (!alive) return;
        const good = probes.filter(Boolean);
        setGhCache((c) => ({ ...c, ...Object.fromEntries(good.map((g) => [String(g.y), g.days])) }));
        setGhYears(good.map((g) => g.y));
      } catch {
        if (alive) setGhStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- LeetCode ---------- */
  const [lc, setLc] = useState({ status: 'loading', map: {}, solved: null, meta: {} });
  const [lcRange, setLcRange] = useState('last');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [calRes, solvedRes] = await Promise.all([
          fetch(LC(PROFILE.leetcode)),
          fetch(LC_SOLVED(PROFILE.leetcode)),
        ]);
        if (!calRes.ok) throw new Error();
        const cal = await calRes.json();
        const raw = cal?.submissionCalendar;
        const map = typeof raw === 'string' ? JSON.parse(raw) : raw || {};
        const solved = solvedRes.ok ? await solvedRes.json() : null;
        if (!alive) return;
        setLc({
          status: 'ok',
          map,
          solved,
          meta: { streak: cal?.streak, activeDays: cal?.totalActiveDays, years: cal?.activeYears || [] },
        });
      } catch {
        if (alive) setLc((s) => ({ ...s, status: 'error' }));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- Monkeytype ---------- */
  const mtMap = useMemo(() => getMonkeytypeMap(monkeytypeData), []);
  const mtAll = useMemo(() => expandMonkeytype(monkeytypeData), []);
  const [mtRange, setMtRange] = useState('last');

  // Options, built only from years that actually contain activity.
  const ghOptions = [
    { id: 'last', label: 'Last 12 months' },
    ...ghYears.map((y) => ({ id: String(y), label: String(y) })),
  ];

  const lcYears = (lc.meta.years || [])
    .filter((y) => total(yearDays(lc.map, y)) > 0)
    .sort((a, b) => b - a);
  const lcOptions = [
    { id: 'last', label: 'Last 12 months' },
    ...lcYears.map((y) => ({ id: String(y), label: String(y) })),
  ];

  const mtYears = [...new Set(mtAll.filter((d) => d.count > 0).map((d) => yearOf(d.date)))].sort(
    (a, b) => b - a
  );
  const mtOptions = [
    { id: 'last', label: 'Last 12 months' },
    ...mtYears.map((y) => ({ id: String(y), label: String(y) })),
  ];

  const ghDays = ghCache[ghRange] || [];
  const lcDays = lcRange === 'last' ? expandCalendar(lc.map) : yearDays(lc.map, Number(lcRange));
  const mtDays =
    mtRange === 'last' ? mtAll.slice(-371) : yearDaysByDate(mtMap, Number(mtRange));

  const rangeLabel = (id) => (id === 'last' ? 'last 12 months' : `in ${id}`);

  const TABS = [
    { id: 'github', label: 'GitHub' },
    { id: 'leetcode', label: 'LeetCode' },
    { id: 'monkeytype', label: 'Monkeytype' },
  ];

  return (
    <section className="section" id="activity">
      <div className="wrap">
        <span className="eyebrow">Activity</span>
        <h2 className="section-title">Still building, still practising.</h2>
        <p className="section-sub">
          Pulled live wherever an API exists — these are whatever the graphs say today, not
          screenshots.
        </p>

        <div className="tabs" role="tablist" aria-label="Activity sources">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`tab ${tab === t.id ? 'tab-on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="act-card">
          {tab === 'github' && (
            <Panel status={ghStatus} profileUrl={PROFILE.githubUrl}>
              <>
                <div className="act-head">
                  <div className="act-stats">
                    <span className="act-figure">{total(ghDays)}</span>
                    <span className="act-label">contributions · {rangeLabel(ghRange)}</span>
                  </div>
                  <div className="act-right">
                    <RangePicker options={ghOptions} value={ghRange} onChange={setGhRange} />
                    <a className="act-link" href={PROFILE.githubUrl} target="_blank" rel="noreferrer">
                      @{PROFILE.github} ↗
                    </a>
                  </div>
                </div>
                <Heatmap days={ghDays} ramp="green" unit="contributions" />
              </>
            </Panel>
          )}

          {tab === 'leetcode' && (
            <Panel status={lc.status} profileUrl={PROFILE.leetcodeUrl}>
              <>
                <div className="act-head">
                  <div className="act-stats">
                    <span className="act-figure">{lc.solved?.solvedProblem ?? '—'}</span>
                    <span className="act-label">problems solved · all time</span>
                  </div>
                  <div className="act-right">
                    <RangePicker options={lcOptions} value={lcRange} onChange={setLcRange} />
                    <a className="act-link" href={PROFILE.leetcodeUrl} target="_blank" rel="noreferrer">
                      @{PROFILE.leetcode} ↗
                    </a>
                  </div>
                </div>

                {lc.solved && (
                  <div className="act-split">
                    <span className="act-chip act-easy">Easy {lc.solved.easySolved}</span>
                    <span className="act-chip act-med">Medium {lc.solved.mediumSolved}</span>
                    <span className="act-chip act-hard">Hard {lc.solved.hardSolved}</span>
                    <span className="act-chip">
                      {total(lcDays)} submissions {rangeLabel(lcRange)}
                    </span>
                    {lc.meta.activeDays != null && (
                      <span className="act-chip">{lc.meta.activeDays} active days</span>
                    )}
                  </div>
                )}

                <Heatmap days={lcDays} ramp="amber" unit="submissions" />
              </>
            </Panel>
          )}

          {tab === 'monkeytype' && (
            <Panel status="ok" profileUrl={PROFILE.monkeytypeUrl || `https://monkeytype.com/profile/${PROFILE.monkeytype || PROFILE.github}`}>
              <>
                <div className="act-head">
                  <div className="act-stats">
                    <span className="act-figure">{total(mtDays)}</span>
                    <span className="act-label">typing tests · {rangeLabel(mtRange)}</span>
                  </div>
                  <div className="act-right">
                    <RangePicker options={mtOptions} value={mtRange} onChange={setMtRange} />
                    <a
                      className="act-link"
                      href={PROFILE.monkeytypeUrl || `https://monkeytype.com/profile/${PROFILE.monkeytype || PROFILE.github}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{PROFILE.monkeytype || PROFILE.github} ↗
                    </a>
                  </div>
                </div>
                <Heatmap days={mtDays} ramp="violet" unit="tests" />
                <p className="act-note">
                  Refreshed every two hours by a GitHub Action that commits the data into this repo.
                </p>
              </>
            </Panel>
          )}
        </div>
      </div>
    </section>
  );
}
