'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function uploadProof(formData: FormData) {
  const supabase = await createClient()
  
  const winningId = formData.get('winning_id') as string
  const proofUrl = formData.get('proof_url') as string
  
  await supabase
    .from('winnings')
    .update({ proof_url: proofUrl })
    .eq('id', winningId)

  revalidatePath('/dashboard/winnings')
  revalidatePath('/admin/winners')
}
