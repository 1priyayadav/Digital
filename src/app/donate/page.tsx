import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ charity?: string }>
}) {
  const supabase = await createClient()
  const { charity: charityId } = await searchParams;
  
  const { data: charities } = await supabase.from('charities').select('id, name').order('name')
  
  async function processDonation(formData: FormData) {
    'use server'
    // Form actions simulate checkout session flow without blocking locally
    redirect('/donate/success')
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '4rem', maxWidth: '600px', paddingBottom: '4rem' }}>
      <div className="glass-panel" style={{ padding: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--accent-color)', textAlign: 'center' }}>Make a Direct Impact</h2>
        <p style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          100% of independent donations go directly to your chosen organization.
        </p>

        <form action={processDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="charity_id" style={{ display: 'block', marginBottom: '0.5rem' }}>Select Charity</label>
            <select 
              id="charity_id" 
              name="charity_id" 
              defaultValue={charityId || ''} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }}
            >
              <option value="" disabled>Choose an organization</option>
              {charities?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem' }}>Donation Amount ($)</label>
            <input 
              id="amount" 
              name="amount" 
              type="number" 
              min="5" 
              step="1"
              defaultValue="50"
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} 
            />
          </div>

          <button type="submit" className="btn btn-accent" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  )
}
