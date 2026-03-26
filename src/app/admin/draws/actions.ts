'use server'

import { createClient } from '@/lib/supabase-server'

export async function simulateDraw(logicType: 'random' | 'algorithmic') {
  const supabase = await createClient()
  
  // 1. Calculate Pool
  const { count: activeSubs } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')
    
  const POOL_CONTRIBUTION = 5 // Hypothetical contribution to pool from fee
  const currentPool = (activeSubs || 0) * POOL_CONTRIBUTION
  
  // Fetch current jackpot
  const { data: jackpotRow } = await supabase.from('jackpot').select('current_amount').single()
  const jackpotPool = (jackpotRow?.current_amount || 0) + (currentPool * 0.40)
  const match4Pool = currentPool * 0.35
  const match3Pool = currentPool * 0.25

  // 2. Generate Draw Numbers
  let drawNumbers: number[] = []
  
  if (logicType === 'random') {
    while(drawNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1
      if (!drawNumbers.includes(num)) drawNumbers.push(num)
    }
  } else {
    // Algorithmic: get all scores, find most frequent
    const { data: allScores } = await supabase.from('scores').select('score')
    if (!allScores || allScores.length === 0) {
       // Fallback to random if no scores
       while(drawNumbers.length < 5) {
         const num = Math.floor(Math.random() * 45) + 1
         if (!drawNumbers.includes(num)) drawNumbers.push(num)
       }
    } else {
      const frequencies: Record<number, number> = {}
      allScores.forEach(s => {
        frequencies[s.score] = (frequencies[s.score] || 0) + 1
      })
      // Sort descending by frequency
      const sorted = Object.entries(frequencies).sort((a,b) => b[1] - a[1])
      drawNumbers = sorted.slice(0, 5).map(arr => parseInt(arr[0]))
      
      // If less than 5 distinct scores exist, fill with random
      while(drawNumbers.length < 5) {
         const num = Math.floor(Math.random() * 45) + 1
         if (!drawNumbers.includes(num)) drawNumbers.push(num)
      }
    }
  }

  // 3. Find Winners
  const { data: usersWithScores } = await supabase
    .from('profiles')
    .select('id, scores(score)')
    .eq('subscription_status', 'active')
    
  const winners = { match5: [] as string[], match4: [] as string[], match3: [] as string[] }
  
  usersWithScores?.forEach(user => {
    if (!user.scores) return;
    const userScores = user.scores.map((s: any) => s.score)
    let matchCount = 0
    drawNumbers.forEach(num => {
      if (userScores.includes(num)) matchCount++
    })
    
    if (matchCount === 5) winners.match5.push(user.id)
    if (matchCount === 4) winners.match4.push(user.id)
    if (matchCount === 3) winners.match3.push(user.id)
  })

  return {
    logicType,
    drawNumbers,
    pools: { match5: jackpotPool, match4: match4Pool, match3: match3Pool, base_addition: currentPool },
    winners,
    activeSubs: activeSubs || 0
  }
}

export async function publishDraw(simulationResultStr: string) {
  const supabase = await createClient()
  const sim = JSON.parse(simulationResultStr)
  
  const d = new Date()
  
  // 1. Insert Draw
  const { data: draw, error: drawError } = await supabase.from('draws').insert({
    month: d.getMonth() + 1,
    year: d.getFullYear(),
    logic_type: sim.logicType,
    matching_numbers: sim.drawNumbers,
    total_pool_amount: sim.pools.base_addition,
    is_published: true
  }).select().single()
  
  if (drawError) throw new Error("Draw already published or error: " + drawError.message)
  
  const drawId = draw.id
  
  // 2. Insert Winnings
  const winningsToInsert: any[] = []
  
  if (sim.winners.match5.length > 0) {
    const payout = sim.pools.match5 / sim.winners.match5.length
    sim.winners.match5.forEach((uid: string) => {
      winningsToInsert.push({ draw_id: drawId, user_id: uid, match_type: '5', amount: payout })
    })
  }
  if (sim.winners.match4.length > 0) {
    const payout = sim.pools.match4 / sim.winners.match4.length
    sim.winners.match4.forEach((uid: string) => {
      winningsToInsert.push({ draw_id: drawId, user_id: uid, match_type: '4', amount: payout })
    })
  }
  if (sim.winners.match3.length > 0) {
    const payout = sim.pools.match3 / sim.winners.match3.length
    sim.winners.match3.forEach((uid: string) => {
      winningsToInsert.push({ draw_id: drawId, user_id: uid, match_type: '3', amount: payout })
    })
  }
  
  if (winningsToInsert.length > 0) {
    await supabase.from('winnings').insert(winningsToInsert)
  }
  
  // 3. Update Jackpot
  const rolloverAmount = 
    (sim.winners.match5.length > 0 ? 0 : sim.pools.match5) +
    (sim.winners.match4.length > 0 ? 0 : sim.pools.match4) +
    (sim.winners.match3.length > 0 ? 0 : sim.pools.match3)
  await supabase.from('jackpot').upsert({ id: true, current_amount: rolloverAmount, updated_at: new Date().toISOString() })
  
  // 4. Trigger email system here in future wrapper
  
  return { success: true }
}
