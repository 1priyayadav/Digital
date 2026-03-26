'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function verifyWinner(formData: FormData) {
  const supabase = await createClient()
  
  const winningId = formData.get('winning_id') as string
  const action = formData.get('action') as string // 'verify' or 'pay'
  
  const newStatus = action === 'verify' ? 'verified' : 'paid'

  await supabase
    .from('winnings')
    .update({ status: newStatus })
    .eq('id', winningId)

  // System would trigger "Payout Approved" Email logic here.
  
  revalidatePath('/admin/winners')
}
