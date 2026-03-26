import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MyDrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const { data: pastDraws } = await supabase
    .from('draws')
    .select('*')
    .eq('is_published', true)
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  const isSubscribed = profile?.subscription_status === 'active'

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link href="/dashboard" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        &larr; Back to Dashboard
      </Link>
      
      <h1 style={{ marginBottom: '2rem', color: 'var(--accent-color)' }}>My Draw Participation</h1>
      
      {isSubscribed ? (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent-color)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Upcoming Draw</h2>
          <p style={{ color: 'var(--text-muted)' }}>
             You are actively enrolled in this month's upcoming draw. Keep your 5 Stableford scores updated to maximize your chances!
          </p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Not Enrolled</h2>
          <p style={{ color: 'var(--text-muted)' }}>
             Your subscription is not active. Subscribe to gain entry into the next monthly algorithmic draw.
          </p>
        </div>
      )}

      <h2 style={{ marginBottom: '1.5rem' }}>Past Draws</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pastDraws?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No past draws available.</p>
        ) : pastDraws?.map(d => (
          <div key={d.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>{d.month}/{d.year}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Total Pool: ${d.total_pool_amount}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {d.matching_numbers?.map((n: number, i: number) => (
                <span key={i} style={{ display: 'inline-block', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', textAlign: 'center', lineHeight: '30px', fontSize: '0.875rem' }}>{n}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
