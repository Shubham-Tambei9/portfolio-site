import { useEffect, useRef, useState } from 'react';
import { FEEDBACK_ENDPOINT, FEEDBACK_EMAIL, FEEDBACK_TOPICS, FEEDBACK_COPY } from '../data/config.js';

/* Site-wide feedback widget.
 *
 * Two delivery modes, and the UI is explicit about which one is active so a
 * visitor is never told "sent" when nothing was sent:
 *   - endpoint configured -> POST, with real success and failure states
 *   - no endpoint        -> opens the visitor's mail client, pre-filled, and the
 *                            confirmation says exactly that
 *
 * Nothing is stored or transmitted anywhere else. The email field is optional
 * and only exists so a reply is possible. */

const MAX = 1200;

export default function Feedback() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(FEEDBACK_TOPICS[0].id);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent | mail | error
  const [error, setError] = useState('');
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);

  const usesMail = !FEEDBACK_ENDPOINT;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    firstFieldRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const reset = () => {
    setState('idle');
    setError('');
    setMessage('');
    setEmail('');
    setRating(0);
  };

  const submit = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) {
      setError('Please write a message first.');
      return;
    }

    setError('');
    const topicLabel = FEEDBACK_TOPICS.find((t) => t.id === topic)?.label ?? topic;
    const payload = {
      topic: topicLabel,
      rating: rating || null,
      message: text,
      email: email.trim() || null,
      page: window.location.hash || '#/',
      sentAt: new Date().toISOString(),
    };

    if (usesMail) {
      const body = [
        `Topic: ${payload.topic}`,
        payload.rating ? `Rating: ${payload.rating}/5` : null,
        `Page: ${payload.page}`,
        '',
        text,
        '',
        payload.email ? `Reply to: ${payload.email}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
        `Portfolio — ${payload.topic}`
      )}&body=${encodeURIComponent(body)}`;
      setState('mail');
      return;
    }

    setState('sending');
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
    } catch {
      setState('error');
      setError('That did not go through. You can email it instead.');
    }
  };

  return (
    <>
      <button
        className="fb-launch"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="fb-launch-dot" aria-hidden="true" />
        {FEEDBACK_COPY.launch}
      </button>

      {open && (
        <div className="fb-overlay" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div
            className="fb-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Send feedback"
          >
            <div className="fb-head">
              <div>
                <h2 className="fb-title">{FEEDBACK_COPY.title}</h2>
                <p className="fb-sub">{FEEDBACK_COPY.sub}</p>
              </div>
              <button className="fb-close" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            {state === 'sent' || state === 'mail' ? (
              <div className="fb-done">
                <span className="fb-done-mark" aria-hidden="true">
                  ✓
                </span>
                <h3 className="fb-done-title">
                  {state === 'sent' ? 'Message sent.' : 'Your mail app is opening.'}
                </h3>
                <p className="fb-done-body">
                  {state === 'sent'
                    ? 'Thanks — this lands in my inbox directly.'
                    : 'Your message is pre-filled and ready. It is only sent once you press send in your own mail app.'}
                </p>
                <div className="fb-done-actions">
                  <button className="btn btn-ghost" onClick={reset}>
                    Write another
                  </button>
                  <button className="btn btn-primary" onClick={() => setOpen(false)}>
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form className="fb-form" onSubmit={submit}>
                <div className="fb-field">
                  <label className="fb-label">What is this about?</label>
                  <div className="fb-topics">
                    {FEEDBACK_TOPICS.map((t, i) => (
                      <button
                        key={t.id}
                        type="button"
                        ref={i === 0 ? firstFieldRef : null}
                        className={`fb-topic ${topic === t.id ? 'fb-topic-on' : ''}`}
                        onClick={() => setTopic(t.id)}
                        aria-pressed={topic === t.id}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="fb-field">
                  <label className="fb-label">
                    {FEEDBACK_COPY.ratingLabel} <span className="fb-optional">optional</span>
                  </label>
                  <div className="fb-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`fb-star ${rating >= n ? 'fb-star-on' : ''}`}
                        onClick={() => setRating(rating === n ? 0 : n)}
                        aria-label={`${n} out of 5`}
                        aria-pressed={rating === n}
                      >
                        ★
                      </button>
                    ))}
                    {rating > 0 && <span className="fb-rating-val">{rating}/5</span>}
                  </div>
                </div>

                <div className="fb-field">
                  <label className="fb-label" htmlFor="fb-msg">
                    {FEEDBACK_COPY.messageLabel}
                  </label>
                  <textarea
                    id="fb-msg"
                    className="fb-textarea"
                    value={message}
                    maxLength={MAX}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={FEEDBACK_COPY.placeholder}
                    rows={5}
                  />
                  <span className="fb-count">
                    {message.length}/{MAX}
                  </span>
                </div>

                <div className="fb-field">
                  <label className="fb-label" htmlFor="fb-email">
                    Email <span className="fb-optional">optional — only if you want a reply</span>
                  </label>
                  <input
                    id="fb-email"
                    className="fb-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                {error && <p className="fb-error">{error}</p>}

                <div className="fb-actions">
                  <p className="fb-note">
                    {usesMail
                      ? 'This opens your mail app with the message ready — nothing is sent until you press send there.'
                      : 'Sent directly to the developer. Nothing else is collected.'}
                  </p>
                  <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
                    {state === 'sending' ? 'Sending…' : usesMail ? 'Open mail app' : FEEDBACK_COPY.cta}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
