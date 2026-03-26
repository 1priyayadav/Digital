import { createClient } from '@/lib/supabase-server'
import { verifyWinner } from './actions'

export default async function WinnersManagementPage() {
  const supabase = await createClient()
  
  const { data: winnings } = await supabase
    .from('winnings')
    .select('*, draws(month, year)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Verification & Payouts</h1>
      
      <div className="glass-panel" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '1rem' }}>Draw</th>
              <th style={{ padding: '1rem' }}>User ID</th>
              <th style={{ padding: '1rem' }}>Match Tier</th>
              <th style={{ padding: '1rem' }}>Prize ($)</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Proof</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {winnings?.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>No winners recorded yet.</td></tr>
            ) : winnings?.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{w.draws?.month}/{w.draws?.year}</td>
                <td style={{ padding: '1rem', fontFamily: 'monospace' }} title={w.user_id}>...{w.user_id?.slice(-6)}</td>
                <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{w.match_type} Matches</td>
                <td style={{ padding: '1rem' }}>${w.amount.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold',
                    background: w.status === 'paid' ? 'rgba(34, 197, 94, 0.2)' : w.status === 'verified' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: w.status === 'paid' ? '#4ade80' : w.status === 'verified' ? '#60a5fa' : '#fbbf24'
                  }}>
                    {w.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {w.proof_url ? (
                    <a href={w.proof_url} target="_blank" style={{ color: '#60a5fa', textDecoration: 'underline' }}>View</a>
                  ) : <span style={{ color: 'var(--text-muted)' }}>Pending</span>}
                </td>
                <td style={{ padding: '1rem' }}>
                  {w.status === 'pending' && w.proof_url && (
                    <form action={verifyWinner} style={{ display: 'inline-block' }}>
                      <input type="hidden" name="winning_id" value={w.id} />
                      <input type="hidden" name="action" value="verify" />
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Approve</button>
                    </form>
                  )}
                  {w.status === 'verified' && (
                    <form action={verifyWinner} style={{ display: 'inline-block' }}>
                      <input type="hidden" name="winning_id" value={w.id} />
                      <input type="hidden" name="action" value="pay" />
                      <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Mark Paid</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
