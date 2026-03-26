import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FallbackImage from '@/components/FallbackImage'

export default async function CharityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient()
  
  const { data: charity } = await supabase
    .from('charities')
    .select('*')
    .eq('id', id)
    .single()

  if (!charity) {
    notFound()
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link href="/charities" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        &larr; Back to Directory
      </Link>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <FallbackImage 
          src={charity.image_url || `https://picsum.photos/seed/${charity.id}/1200/400`}
          fallbackSrc={`https://picsum.photos/seed/${charity.name.replace(/\s/g, '')}/1200/400`}
          alt={charity.name}
          style={{ height: '300px', width: '100%', objectFit: 'cover', background: 'var(--border-color)' }}
        />
        <div style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: '1 1 500px' }}>
              <h1 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>{charity.name}</h1>
              <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-color)', whiteSpace: 'pre-wrap' }}>
                {charity.description}
              </div>
            </div>
            <div style={{ flex: '0 0 300px', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Support this Cause</h3>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                You can select this organization as your primary beneficiary when you subscribe, or make a direct one-off donation today.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/pricing" className="btn btn-outline">Subscribe & Support</Link>
                <Link href={`/donate?charity=${charity.id}`} className="btn btn-accent">Donate directly</Link>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{ marginBottom: '2rem' }}>Upcoming Events</h2>
            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No upcoming golf days or events currently scheduled for {charity.name}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
