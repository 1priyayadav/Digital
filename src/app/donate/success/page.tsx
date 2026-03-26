import Link from 'next/link'

export default function DonationSuccess() {
  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ padding: '4rem 3rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 2rem auto' }}>
          ✓
        </div>
        <h2 style={{ marginBottom: '1rem' }}>Thank You!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Your generous donation has been processed successfully. Your support makes a real difference.
        </p>
        <Link href="/" className="btn btn-primary">Return Home</Link>
      </div>
    </div>
  )
}
