import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImpactGolf | Play with Purpose",
  description: "Play, win, and give back to the community with our monthly subscription.",
};

import { createClient } from '@/lib/supabase-server'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let role = 'subscriber'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) role = profile.role
  }

  return (
    <html lang="en">
      <body>
        <nav className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
            <a href="/" style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>
              ImpactGolf
            </a>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Home</a>
            <a href="/pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Pricing</a>
            <a href="/charities" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Charities</a>
            <a href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Dashboard</a>
            {role === 'admin' && (
              <a href="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Admin</a>
            )}
            {!user ? (
              <a href="/login" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', marginLeft: '0.5rem' }}>Sign In</a>
            ) : (
              <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', marginLeft: '0.5rem' }}>Account</a>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
