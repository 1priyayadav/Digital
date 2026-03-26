import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import FallbackImage from '@/components/FallbackImage'

export default async function CharitiesDirectory({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const supabase = await createClient()
  const { query } = await searchParams;

  let dbQuery = supabase.from('charities').select('*').order('name')
  
  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }
  
  const { data: charities } = await dbQuery

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--accent-color)' }}>Our Charity Partners</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Explore the amazing causes supported by the ImpactGolf community.</p>
      </header>
      
      <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        <form style={{ display: 'flex', gap: '1rem' }} action="/charities">
          <input 
            type="text" 
            name="query" 
            placeholder="Search charities..." 
            defaultValue={query || ''}
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'white' }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {charities?.map(charity => (
          <div key={charity.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <FallbackImage 
              src={charity.image_url || `https://picsum.photos/seed/${charity.id}/800/500`}
              fallbackSrc={`https://picsum.photos/seed/${charity.name.replace(/\s/g, '')}/800/500`}
              alt={charity.name}
              style={{ height: '200px', width: '100%', objectFit: 'cover', background: 'var(--border-color)' }}
            />
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{charity.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{charity.description}</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href={`/charities/${charity.id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.875rem' }}>Learn More</Link>
                <Link href={`/donate?charity=${charity.id}`} className="btn btn-accent" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.875rem' }}>Donate</Link>
              </div>
            </div>
          </div>
        ))}
        {charities?.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>No charities found matching "{query}".</p>
        )}
      </div>
    </div>
  )
}
