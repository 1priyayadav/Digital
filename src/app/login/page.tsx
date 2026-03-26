import { login } from '../auth/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</h2>
        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
            />
          </div>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Sign In</button>
          
          {message && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  )
}
