export default function AboutPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>How it Works</h1>
      
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>1. The Subscription Concept</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-color)' }}>
          ImpactGolf is a modern golf tracking platform built with a charitable twist. By subscribing to our platform (Monthly or Yearly), you gain access to our premium score-tracking system where we diligently log and maintain your 5 most recent Stableford scores. But more importantly, a minimum of <strong>10% of every subscription</strong> is automatically routed to a registered charity of your choice!
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>2. The Monthly Draw Engine</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-color)' }}>
          Every month, the platform runs a highly anticipated draw. The system will algorithmically pull 5 winning numbers based on frequency algorithms (or pure random lottery). We instantly compare these 5 drawn numbers against your 5 saved scores.
        </p>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 1.6 }}>
          <li><strong>5 Matches:</strong> You win a share of the grand Jackpot Pool (40% of standard pool + rollovers)!</li>
          <li><strong>4 Matches:</strong> You win a share of the 35% secondary prize pool.</li>
          <li><strong>3 Matches:</strong> You win a share of the 25% tertiary prize pool.</li>
        </ul>
        <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>If nobody matches the required numbers for any tier, that money doesn't disappear—it rolls over into next month's Jackpot!</p>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#4ade80', marginBottom: '1rem' }}>3. Winner Verification</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--text-color)' }}>
          When our algorithm detects that your scores match the drawn numbers, your status upgrades to a Pending Winner! To keep the platform secure and fair, you simply upload a screenshot of your official handicap or scorecard as proof. Once our admins verify it, your payout is immediately queued!
        </p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <a href="/pricing" className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}>Start Your Impact Journey</a>
      </div>
    </div>
  )
}
