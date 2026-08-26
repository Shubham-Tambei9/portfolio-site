import { useRef } from 'react';
import { useSequence, useRailGeometry, RailLine, nodeState } from './Rail.jsx';

/* What I actually work on, sequenced on the shared rail. Each strand links to
   the section of the site that backs it up, so nothing here is a bare claim. */
const STRANDS = [
  {
    title: 'AI evaluation',
    body: 'Containerized environments that benchmark autonomous coding agents — deciding what counts as a correct result, and proving it automatically.',
    href: '#/#journey',
    cue: 'See the role',
  },
  {
    title: 'Shipping games',
    body: 'Android titles under the Arcadly name. One live on Google Play, four in the pipeline, with solvers that verify a level is fair before anyone plays it.',
    href: 'https://arcadly-sky-hopper.vercel.app',
    cue: 'Visit the studio',
    external: true,
  },
  {
    title: 'Research',
    body: 'Five published papers across IoT, machine learning, code optimisation and brain–computer interfaces — in Springer Nature, IEEE Xplore and others.',
    href: '#/#research',
    cue: 'Read the papers',
  },
  {
    title: 'Building software',
    body: 'Full-stack web, data pipelines and analysis. Nineteen projects, spanning ML, web, data and UI/UX design.',
    href: '#/#projects',
    cue: 'Browse projects',
  },
];

export default function Focus() {
  const ref = useRef(null);
  const railRef = useRef(null);
  const head = useSequence(ref, STRANDS.length, { dwell: 1000 });
  const points = useRailGeometry(railRef, '.pipe-node');

  return (
    <section className="section" id="focus" ref={ref}>
      <div className="wrap">
        <span className="eyebrow">What I work on</span>
        <h2 className="section-title">
          Four strands,
          <br />
          one habit.
        </h2>
        <p className="section-sub">
          They look unrelated until you notice each one is about verifying a result rather than
          assuming it.
        </p>

        <div className="pipe" ref={railRef}>
          <RailLine head={head} points={points} />

          <ol className="pipe-stages approach-stages">
            {STRANDS.map((s, i) => (
              <li key={s.title} className={`pipe-stage pipe-stage-${nodeState(i, head)}`}>
                <div className="pipe-node" aria-hidden="true">
                  <span className="pipe-node-core" />
                </div>
                <div className="pipe-stage-inner">
                  <span className="pipe-stage-idx">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="pipe-stage-label">{s.title}</h3>
                  <p className="pipe-stage-note approach-note">{s.body}</p>
                  <a
                    className="pipe-cue"
                    href={s.href}
                    {...(s.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {s.cue} →
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
