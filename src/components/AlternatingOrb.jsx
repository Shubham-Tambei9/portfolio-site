import { useState, useEffect } from 'react';
import { ThinkingOrb } from 'thinking-orbs';

const ORB_STATES = ['solving', 'searching', 'listening'];

/**
 * Renders ThinkingOrb alternating between 'solving', 'searching', and 'listening' states (size 64).
 * Supports click interaction to manually cycle state or auto-alternating timer.
 */
export default function AlternatingOrb({ size = 96, intervalMs = 3500, autoAlternate = true, showControls = true }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoAlternate) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ORB_STATES.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoAlternate, intervalMs]);

  const toggle = () => {
    setIndex((prev) => (prev + 1) % ORB_STATES.length);
  };

  const state = ORB_STATES[index];

  return (
    <div className="orb-alternating-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
      <div 
        onClick={toggle} 
        title="Click to alternate orb state" 
        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
      >
        <ThinkingOrb state={state} size={size} />
        {showControls && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-dim)' }}>
            state: <strong style={{ color: 'var(--green-bright)', fontWeight: 600 }}>{state}</strong>
          </span>
        )}
      </div>

      {showControls && (
        <div style={{ display: 'flex', gap: '6px' }}>
          {ORB_STATES.map((s, i) => (
            <button
              key={s}
              type="button"
              className={`mini-btn ${index === i ? 'range-btn-on' : ''}`}
              onClick={() => setIndex(i)}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '11px',
                padding: '3px 9px',
                borderRadius: '6px',
                border: '1px solid var(--line-strong)',
                background: index === i ? 'var(--green-dim)' : 'transparent',
                color: index === i ? 'var(--green-bright)' : 'var(--text-dim)',
                cursor: 'pointer'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
