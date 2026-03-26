import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Choose Your Impact</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--text-muted)' }}>
        Get full access to score tracking, monthly draws, and support incredible charities.
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Monthly Plan */}
        <div className="glass-panel" style={{ padding: '3rem 2rem', width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column' }}>
          <h2>Monthly</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>$19<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '2rem', flexGrow: 1 }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>✓ Track latest 5 scores</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>✓ Entry into Monthly Draws</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>✓ 10% goes to your Charity</li>
          </ul>
          <Link href="/api/checkout?plan=monthly" className="btn btn-outline" style={{ width: '100%' }}>
            Select Monthly
          </Link>
        </div>

        {/* Yearly Plan */}
        <div className="glass-panel" style={{ padding: '3rem 2rem', width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-color)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-color)', color: '#000', padding: '0.2rem 1rem', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.8rem' }}>
            BEST VALUE
          </div>
          <h2>Yearly</h2>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>$199<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/yr</span></div>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '2rem', flexGrow: 1 }}>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>✓ Save $29 annually</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>✓ Track latest 5 scores</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>✓ Entry into Monthly Draws</li>
            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>✓ 10% goes to your Charity</li>
          </ul>
          <Link href="/api/checkout?plan=yearly" className="btn btn-primary" style={{ width: '100%' }}>
            Select Yearly
          </Link>
        </div>
      </div>
    </div>
  )
}
