import { createClient } from '@/lib/supabase-server'

export default async function UsersManagementPage() {
  const supabase = await createClient()
  
  const { data: users } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>User Management</h1>
      
      <div className="glass-panel" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '1rem' }}>User ID</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Charity</th>
              <th style={{ padding: '1rem' }}>%</th>
              <th style={{ padding: '1rem' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.length === 0 && <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No users found</td></tr>}
            {users?.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace' }} title={u.id}>...{u.id.slice(-8)}</td>
                <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{u.role}</td>
                <td style={{ padding: '1rem' }}>
                   <span style={{ 
                     color: u.subscription_status === 'active' ? '#4ade80' : 'var(--text-muted)',
                     fontWeight: u.subscription_status === 'active' ? 'bold' : 'normal'
                   }}>
                    {u.subscription_status}
                   </span>
                </td>
                <td style={{ padding: '1rem' }}>{u.charities?.name || 'Unassigned'}</td>
                <td style={{ padding: '1rem' }}>{u.charity_percentage}%</td>
                <td style={{ padding: '1rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
