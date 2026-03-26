import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export default async function CharitiesManagementPage() {
  const supabase = await createClient()
  
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('name')

  async function addCharity(formData: FormData) {
    'use server'
    const supabaseAction = await createClient()
    
    await supabaseAction.from('charities').insert({
      name: formData.get('name'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      is_featured: formData.get('is_featured') === 'on'
    })
    revalidatePath('/admin/charities')
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Charity Management</h1>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Add New Charity</h2>
        <form action={addCharity} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
            <input name="name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL</label>
            <input type="url" name="image_url" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border-color)' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
            <textarea name="description" rows={3} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border-color)' }}></textarea>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
              <input type="checkbox" name="is_featured" />
              Feature on Homepage Splash
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Add Organization</button>
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Featured Status</th>
              <th style={{ padding: '1rem' }}>Date Listed</th>
            </tr>
          </thead>
          <tbody>
            {charities?.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.name}</td>
                <td style={{ padding: '1rem' }}>{c.is_featured ? <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>★ Yes</span> : 'No'}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
