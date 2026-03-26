import { createClient } from '@/lib/supabase-server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Analytics
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: activeSubs } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active')
  const { data: jackpot } = await supabase.from('jackpot').select('current_amount').single()
  const { data: pools } = await supabase.from('draws').select('total_pool_amount')
  
  const totalPrizePoolAllTime = pools?.reduce((sum, d) => sum + (d.total_pool_amount || 0), 0) || 0

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Platform Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{userCount || 0}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Active Subscribers</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>{activeSubs || 0}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>All-Time Prize Pool</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-color)' }}>${totalPrizePoolAllTime.toFixed(2)}</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3>Current Jackpot</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>${jackpot?.current_amount || 0}</p>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2>System Status</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Use the navigation links to manage users, configure and execute monthly draws, update charity partners, and verify major winners.
        </p>
      </div>
    </div>
  )
}
