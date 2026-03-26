import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import FallbackImage from '@/components/FallbackImage';

export default async function Home() {
  const supabase = await createClient()
  
  let featuredCharity = null;
  try {
    const { data } = await supabase
      .from('charities')
      .select('*')
      .eq('is_featured', true)
      .limit(1)
      .single()
    featuredCharity = data
  } catch (err) {
    console.warn('DB not connected yet')
  }

  return (
    <main className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <section style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          Play with <span style={{ color: 'var(--primary-color)' }}>Purpose</span>
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: 'var(--text-color)' }}>
          Join the modern golf revolution. Track your progress, participate in thrilling monthly draws, and support your favorite charities all from one platform.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/signup" className="btn btn-primary" style={{ fontSize: '1.25rem' }}>
            Subscribe Now
          </Link>
          <Link href="/about" className="btn btn-outline" style={{ fontSize: '1.25rem' }}>
            How it Works
          </Link>
        </div>
      </section>

      {featuredCharity && (
        <section className="glass-panel" style={{ padding: '3rem', margin: '0 auto 4rem auto', maxWidth: '900px', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', border: '1px solid var(--accent-color)' }}>
          <div style={{ flex: '1 1 300px', textAlign: 'left' }}>
            <span style={{ textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.875rem', letterSpacing: '0.05em' }}>Featured Partner</span>
            <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{featuredCharity.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{featuredCharity.description}</p>
            <Link href={`/charities/${featuredCharity.id}`} className="btn btn-accent">Learn More</Link>
          </div>
          <FallbackImage 
            src={featuredCharity.image_url || `https://picsum.photos/seed/${featuredCharity.id}/800/600`} 
            fallbackSrc={`https://picsum.photos/seed/${featuredCharity.name.replace(/\s/g, '')}/800/600`}
            style={{ flex: '1 1 300px', height: '250px', objectFit: 'cover', borderRadius: '12px', background: 'var(--border-color)', width: '100%' }}
            alt={featuredCharity.name}
          />
        </section>
      )}

      <section className="glass-panel" style={{ padding: '3rem', textAlign: 'left', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>01. Score tracking</h3>
          <p>We keep your latest 5 Stableford scores. Simple, transparent, and focused on current form.</p>
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>02. Monthly Draws</h3>
          <p>Match your scores to our monthly algorithmic draws. Win massive jackpots with a 5-number match.</p>
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>03. Charity Impact</h3>
          <p>At least 10% of every subscription goes directly to a registered charity of your choice.</p>
        </div>
      </section>
    </main>
  );
}
