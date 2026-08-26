import { useEffect, useRef, useState } from 'react';

/* One heatmap renderer for every source. Callers hand it a normalised day list
   — [{ date, count }] in chronological order — and it does the rest. Keeping the
   rendering in one place means GitHub, LeetCode and Monkeytype grids stay
   visually identical even though their APIs look nothing alike.

   Reveal: columns wipe in left to right, which for this grid is simply oldest to
   newest — the animation follows the data rather than decorating it. It starts
   when the grid scrolls into view, replays whenever the dataset changes, and is
   skipped under prefers-reduced-motion. */

const RAMPS = {
  green: [
    'rgba(255,255,255,0.05)',
    'rgba(34,197,94,0.28)',
    'rgba(34,197,94,0.5)',
    'rgba(34,197,94,0.72)',
    '#22c55e',
  ],
  amber: [
    'rgba(255,255,255,0.05)',
    'rgba(234,179,8,0.28)',
    'rgba(234,179,8,0.5)',
    'rgba(234,179,8,0.74)',
    '#eab308',
  ],
  violet: [
    'rgba(255,255,255,0.05)',
    'rgba(168,85,247,0.28)',
    'rgba(168,85,247,0.5)',
    'rgba(168,85,247,0.74)',
    '#a855f7',
  ],
};

function levelFor(count, max) {
  if (!count) return 0;
  const r = count / Math.max(max, 1);
  if (r > 0.66) return 4;
  if (r > 0.4) return 3;
  if (r > 0.15) return 2;
  return 1;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Heatmap({ days, ramp = 'green', weeks = 53, unit = 'contributions' }) {
  const ref = useRef(null);
  const [play, setPlay] = useState(false);

  // Restart whenever the dataset changes (tab or range switch).
  const signature = `${days?.length || 0}:${days?.[0]?.date || ''}:${ramp}`;

  useEffect(() => {
    setPlay(false);
    const node = ref.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlay(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [signature]);

  if (!days?.length) return null;

  const recent = days.slice(-(weeks * 7));
  const chunks = [];
  for (let i = 0; i < recent.length; i += 7) chunks.push(recent.slice(i, i + 7));

  const max = Math.max(...recent.map((d) => d.count || 0), 1);
  const colors = RAMPS[ramp] || RAMPS.green;

  /* A month label above the first week of each month. Columns are flexible, so
     reserve enough of them for a ~24px label at the narrowest column width and
     skip any month that would land too close to the previous label. */
  const MIN_GAP = 3;
  let lastLabelled = -MIN_GAP;
  const labels = chunks.map((w, i) => {
    const first = w[0];
    if (!first?.date) return null;
    const d = new Date(first.date);
    if (Number.isNaN(d.getTime())) return null;
    const prev = i > 0 ? new Date(chunks[i - 1][0]?.date) : null;
    const startsMonth =
      !prev || Number.isNaN(prev.getTime()) || prev.getMonth() !== d.getMonth();
    if (startsMonth && i - lastLabelled >= MIN_GAP) {
      lastLabelled = i;
      return MONTHS[d.getMonth()];
    }
    return null;
  });

  return (
    <div className={`hm ${play ? 'hm-play' : ''}`} ref={ref} key={signature}>
      <div className="hm-months" aria-hidden="true">
        {labels.map((l, i) => (
          <span className="hm-month" key={i} style={{ '--i': i }}>
            {l || ''}
          </span>
        ))}
      </div>

      <div className="hm-grid">
        {chunks.map((w, wi) => (
          <div className="hm-week" key={wi} style={{ '--i': wi }}>
            {w.map((d, di) => (
              <span
                key={di}
                className="hm-day"
                style={{ background: colors[levelFor(d.count || 0, max)] }}
                title={`${d.date}: ${d.count || 0} ${unit}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="hm-legend">
        <span>Less</span>
        {colors.map((c) => (
          <span key={c} className="hm-day" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
