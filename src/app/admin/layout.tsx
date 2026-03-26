import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard') // Normal users blocked from admin routes
  }

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', gap: '2rem', paddingTop: '2rem', paddingBottom: '4rem', minHeight: '100vh' }}>
      <aside className="glass-panel" style={{ flex: '0 0 250px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'max-content' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Admin Control</h3>
        <Link href="/admin" className="btn btn-outline" style={{ textAlign: 'left', border: 'none', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>Dashboard</Link>
        <Link href="/admin/users" className="btn btn-outline" style={{ textAlign: 'left', border: 'none', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>User Mgt</Link>
        <Link href="/admin/draws" className="btn btn-outline" style={{ textAlign: 'left', border: 'none', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>Draw Engine</Link>
        <Link href="/admin/charities" className="btn btn-outline" style={{ textAlign: 'left', border: 'none', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>Charities</Link>
        <Link href="/admin/winners" className="btn btn-outline" style={{ textAlign: 'left', border: 'none', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>Verification</Link>
      </aside>
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  )
}
