import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { uploadProof } from './actions'

export default async function MyWinningsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: winnings } = await supabase
    .from('winnings')
    .select('*, draws(month, year)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link href="/dashboard" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        &larr; Back to Dashboard
      </Link>
      
      <h1 style={{ marginBottom: '2rem', color: 'var(--accent-color)' }}>My Winnings</h1>
      
      {winnings?.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>No winnings yet!</h3>
          <p style={{ color: 'var(--text-muted)' }}>Keep your scores updated to maximize your chances in the next draw.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {winnings?.map(w => (
            <div key={w.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{w.draws?.month}/{w.draws?.year} Draw — <span style={{ color: 'var(--primary-color)' }}>{w.match_type} Matches</span></h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '1rem' }}>${w.amount.toFixed(2)}</p>
                
                <p>Status: <strong style={{ color: w.status === 'paid' ? '#4ade80' : 'white', textTransform: 'uppercase' }}>{w.status}</strong></p>
              </div>
              
              <div style={{ flex: '0 0 300px', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px' }}>
                {w.proof_url ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#4ade80', marginBottom: '1rem', fontWeight: 'bold' }}>✓ Proof Uploaded</p>
                    <a href={w.proof_url} target="_blank" className="btn btn-outline" style={{ fontSize: '0.875rem', width: '100%', display: 'block' }}>View Attached Screenshot</a>
                  </div>
                ) : (
                  <form action={uploadProof} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <input type="hidden" name="winning_id" value={w.id} />
                     <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upload platform screenshot matching your scores to claim this prize.</p>
                     <input type="url" name="proof_url" placeholder="Screenshot URL (imgur, etc)" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'var(--card-bg)', color: 'white', border: '1px solid var(--border-color)' }} />
                     <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', fontWeight: 'bold' }}>Submit Proof</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
