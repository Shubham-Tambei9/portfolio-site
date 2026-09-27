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

const parseUTCDate = (str) => {
  if (!str) return null;
  const parts = String(str).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
};

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

  // 1. Determine start day of week (0=Sun, 1=Mon, ..., 6=Sat) of the first real date
  const firstRealDate = parseUTCDate(days[0]?.date);
  const startDayOfWeek = firstRealDate ? firstRealDate.getUTCDay() : 0;

  // 2. Add leading padding so Row 0 is always Sunday
  const padded = [];
  for (let i = 0; i < startDayOfWeek; i += 1) {
    padded.push({ date: null, count: 0, isPadding: true });
  }
  padded.push(...days);

  // 3. Add trailing padding so the final week column ends on Saturday (row 6)
  const remainder = padded.length % 7;
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i += 1) {
      padded.push({ date: null, count: 0, isPadding: true });
    }
  }

  // 4. Chunk into 7-day week columns
  const allChunks = [];
  for (let i = 0; i < padded.length; i += 7) {
    allChunks.push(padded.slice(i, i + 7));
  }

  // Limit visible columns to `weeks` if requested
  const chunks = weeks ? allChunks.slice(-weeks) : allChunks;

  // Calculate max count for color levels (excluding padding)
  const max = Math.max(...days.map((d) => d.count || 0), 1);
  const colors = RAMPS[ramp] || RAMPS.green;

  /* A month label above the first week of each month. Columns are flexible, so
     reserve enough of them for a ~24px label at the narrowest column width and
     skip any month that would land too close to the previous label. */
  const MIN_GAP = 3;
  let lastLabelled = -MIN_GAP;
  const labels = chunks.map((w, i) => {
    const firstReal = w.find((d) => d.date && !d.isPadding);
    if (!firstReal?.date) return null;
    const d = parseUTCDate(firstReal.date);
    if (!d) return null;

    const prevReal = i > 0 ? chunks[i - 1].find((d) => d.date && !d.isPadding) : null;
    const prevD = prevReal?.date ? parseUTCDate(prevReal.date) : null;

    const startsMonth = !prevD || prevD.getUTCMonth() !== d.getUTCMonth();
    if (startsMonth && i - lastLabelled >= MIN_GAP) {
      lastLabelled = i;
      return MONTHS[d.getUTCMonth()];
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
                style={{
                  background: d.isPadding ? 'transparent' : colors[levelFor(d.count || 0, max)],
                  opacity: d.isPadding ? 0 : 1,
                  pointerEvents: d.isPadding ? 'none' : 'auto',
                }}
                title={d.isPadding || !d.date ? undefined : `${d.date}: ${d.count || 0} ${unit}`}
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

