import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signout } from '@/app/auth/actions'
import { updateCharityPreferences } from './actions'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string, session_id?: string }>
}) {
  const { success } = await searchParams;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(*)')
    .eq('id', user.id)
    .single()

  const { data: allCharities } = await supabase.from('charities').select('id, name').order('name')
  const isSubscribed = profile?.subscription_status === 'active'

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Dashboard</h1>
        <form action={signout}>
          <button type="submit" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Sign Out</button>
        </form>
      </header>
      
      {success && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
          <strong>Developer Mode:</strong> Stripe checkout bypassed successfully. Your subscription has been activated!
        </div>
      )}

      {!isSubscribed ? (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>Subscription Inactive</h2>
          <p style={{ marginBottom: '2rem' }}>You need an active subscription to track scores and participate in draws.</p>
          <Link href="/pricing" className="btn btn-primary" style={{ marginTop: '1rem' }}>View Plans</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Subscription Status</h3>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '4px', alignSelf: 'flex-start', fontWeight: 'bold' }}>ACTIVE</span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto-renews dynamically</p>
            
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/dashboard/draws" className="btn btn-outline" style={{ textAlign: 'center', padding: '0.5rem' }}>View Past Draws</Link>
              <Link href="/dashboard/winnings" className="btn btn-outline" style={{ textAlign: 'center', padding: '0.5rem' }}>My Winnings</Link>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', gridRow: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>My Scores (Latest 5)</h3>
              <Link href="/scores/new" className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>+ Add</Link>
            </div>
            {!scores || scores.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>No scores recorded yet.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {scores.map((s) => (
                  <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>{new Date(s.date).toLocaleDateString()}</span>
                    <strong style={{ color: 'var(--accent-color)', fontSize: '1.1rem' }}>{s.score} pts</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Charity Preferences</h3>
            <form action={updateCharityPreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <div>
                <label htmlFor="charity_id" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Supported Organization</label>
                <select 
                  name="charity_id" 
                  defaultValue={profile?.charity_id || ''}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border-color)' }}
                >
                  <option value="" disabled>Select a charity</option>
                  {allCharities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="charity_percentage" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contribution % (Min 10%)</label>
                <input 
                  type="number" 
                  name="charity_percentage" 
                  min="10" 
                  max="100" 
                  defaultValue={profile?.charity_percentage || 10}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border-color)' }}
                />
              </div>
              <button type="submit" className="btn btn-outline" style={{ marginTop: 'auto', padding: '0.5rem' }}>Update Preferences</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
