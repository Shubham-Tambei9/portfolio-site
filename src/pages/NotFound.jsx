export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '60px 24px', textAlign: 'center' }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>404</span>
      <h1 style={{ fontSize: 'clamp(32px,6vw,72px)', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>Page not found.</h1>
      <p style={{ color: 'var(--text-dim)', maxWidth: '38ch', lineHeight: 1.6, margin: 0 }}>That hash doesn't point anywhere. Head back to the home page.</p>
      <a href="#/" className="btn btn-primary" style={{ marginTop: 8 }}>Go home</a>
    </main>
  );
}
