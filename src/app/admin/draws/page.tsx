'use client'

import { useState } from 'react'
import { simulateDraw, publishDraw } from './actions'

export default function DrawEnginePage() {
  const [loading, setLoading] = useState(false)
  const [simulation, setSimulation] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSimulate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    const type = formData.get('logic_type') as 'random' | 'algorithmic'
    
    try {
      const res = await simulateDraw(type)
      setSimulation(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!simulation) return
    setLoading(true)
    try {
      await publishDraw(JSON.stringify(simulation))
      setSuccess(true)
      setSimulation(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Draw Engine</h1>
      
      {success && (
        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '8px', marginBottom: '2rem' }}>
          Draw published successfully. Winners calculated and notifications queued.
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderRadius: '8px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2>Configure & Simulate</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Run a simulation before publishing final results. Draw cannot be undone.</p>
        
        <form onSubmit={handleSimulate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Draw Logic Type</label>
            <select name="logic_type" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border-color)' }}>
              <option value="random">Random Mode (Lottery Style)</option>
              <option value="algorithmic">Algorithmic Mode (Frequency Weighted)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn btn-outline" style={{ height: 'max-content' }}>
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </form>
      </div>

      {simulation && (
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--accent-color)' }}>
          <h2 style={{ color: 'var(--accent-color)', marginBottom: '1.5rem' }}>Simulation Results Review</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Drawn Numbers</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {simulation.drawNumbers.map((n: number, i: number) => (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{n}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Active Pool Base</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${simulation.pools.base_addition} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>from {simulation.activeSubs} users</span></p>
            </div>
          </div>

          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.5rem 0' }}>Match Tier</th>
                <th style={{ padding: '0.5rem 0' }}>Prize Pool</th>
                <th style={{ padding: '0.5rem 0' }}>Winners</th>
                <th style={{ padding: '0.5rem 0' }}>Payout per Winner</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem 0' }}>5 Matches (Jackpot)</td>
                <td style={{ padding: '0.75rem 0' }}>${simulation.pools.match5.toFixed(2)}</td>
                <td style={{ padding: '0.75rem 0' }}>{simulation.winners.match5.length}</td>
                <td style={{ padding: '0.75rem 0', color: 'var(--accent-color)' }}>
                  {simulation.winners.match5.length > 0 ? `$${(simulation.pools.match5 / simulation.winners.match5.length).toFixed(2)}` : 'Rollover'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.75rem 0' }}>4 Matches</td>
                <td style={{ padding: '0.75rem 0' }}>${simulation.pools.match4.toFixed(2)}</td>
                <td style={{ padding: '0.75rem 0' }}>{simulation.winners.match4.length}</td>
                <td style={{ padding: '0.75rem 0', color: simulation.winners.match4.length === 0 ? 'var(--accent-color)' : 'white' }}>
                  {simulation.winners.match4.length > 0 ? `$${(simulation.pools.match4 / simulation.winners.match4.length).toFixed(2)}` : 'Rollover'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 0' }}>3 Matches</td>
                <td style={{ padding: '0.75rem 0' }}>${simulation.pools.match3.toFixed(2)}</td>
                <td style={{ padding: '0.75rem 0' }}>{simulation.winners.match3.length}</td>
                <td style={{ padding: '0.75rem 0', color: simulation.winners.match3.length === 0 ? 'var(--accent-color)' : 'white' }}>
                  {simulation.winners.match3.length > 0 ? `$${(simulation.pools.match3 / simulation.winners.match3.length).toFixed(2)}` : 'Rollover'}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setSimulation(null)} disabled={loading} className="btn btn-outline">Discard</button>
            <button onClick={handlePublish} disabled={loading} className="btn btn-primary" style={{ background: '#ef4444', boxShadow: 'none' }}>Confirm & Publish Results</button>
          </div>
        </div>
      )}
    </div>
  )
}
