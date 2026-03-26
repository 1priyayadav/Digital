import { signup } from '../auth/actions'
import { createClient } from '@/lib/supabase-server'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;
  const supabase = await createClient()
  
  // Fetch available charities
  const { data: charities } = await supabase.from('charities').select('id, name').order('name')

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '4rem 1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--accent-color)' }}>Join the Movement</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Create an account to track scores and start playing with purpose.</p>
        
        <form action={signup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} 
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} 
            />
          </div>
          
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Your Impact Settings</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="charity_id" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Select Beneficiary Charity</label>
              <select 
                id="charity_id"
                name="charity_id" 
                defaultValue=""
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.8)', color: 'white' }}
              >
                <option value="" disabled>Choose an organization</option>
                {charities && charities.length > 0 ? (
                  charities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                ) : (
                  <option value="" disabled>No organizations listed yet</option>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="charity_percentage" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Contribution Percentage (Min 10%)</label>
              <input 
                id="charity_percentage"
                name="charity_percentage" 
                type="number" 
                min="10" 
                max="100" 
                defaultValue="10"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>Register Account</button>
          
          {message && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{message}</p>}
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--accent-color)' }}>Sign In</a>
        </p>
      </div>
    </div>
  )
}
