import { useState } from 'react';

// Replace FORM_ID with your Formspree form ID after creating one at formspree.io
const FORMSPREE = 'https://formspree.io/f/xpwzvkao';

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const send = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const r = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(r.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'ok') {
    return (
      <div className="cf-done">
        <span className="cf-done-icon">✓</span>
        <p className="cf-done-msg">Message sent! I'll reply within 24 hours.</p>
        <button className="btn btn-ghost" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); }}>Send another</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={send} noValidate>
      <div className="cf-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-name">Name</label>
          <input
            id="cf-name" className="cf-input" type="text" placeholder="Your name"
            value={form.name} onChange={set('name')} required
          />
        </div>
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-email">Email</label>
          <input
            id="cf-email" className="cf-input" type="email" placeholder="your@email.com"
            value={form.email} onChange={set('email')} required
          />
        </div>
      </div>
      <div className="cf-field">
        <label className="cf-label" htmlFor="cf-msg">Message</label>
        <textarea
          id="cf-msg" className="cf-input cf-textarea" placeholder="What would you like to discuss?"
          value={form.message} onChange={set('message')} rows={5} required
        />
      </div>
      {status === 'error' && (
        <p className="cf-error">Something went wrong. Please email me directly instead.</p>
      )}
      <button className="btn btn-primary cf-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message →'}
      </button>
    </form>
  );
}
