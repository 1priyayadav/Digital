import { addScore } from '../actions'
import Link from 'next/link'

export default async function NewScorePage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const { error } = await searchParams;

  return (
    <div className="container" style={{ paddingTop: '4rem', maxWidth: '600px' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Log New Score</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Enter your most recent Stableford score. Only your latest 5 scores are kept in our active rotation.</p>
        
        <form action={addScore} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="score" style={{ display: 'block', marginBottom: '0.5rem' }}>Stableford Score (1 - 45)</label>
            <input 
              id="score" 
              name="score" 
              type="number" 
              min="1" 
              max="45" 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
            />
          </div>
          <div>
            <label htmlFor="date" style={{ display: 'block', marginBottom: '0.5rem' }}>Date Played</label>
            <input 
              id="date" 
              name="date" 
              type="date" 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
            />
          </div>
          
          {error && <p style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</p>}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/dashboard" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>Cancel</Link>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Score</button>
          </div>
        </form>
      </div>
    </div>
  )
}
