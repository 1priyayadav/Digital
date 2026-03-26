'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function updateCharityPreferences(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  const charity_id = formData.get('charity_id') as string
  const percentageStr = formData.get('charity_percentage') as string
  const charity_percentage = parseInt(percentageStr, 10)

  if (isNaN(charity_percentage) || charity_percentage < 10 || charity_percentage > 100) {
    throw new Error('Percentage must be between 10 and 100')
  }

  await supabase
    .from('profiles')
    .update({
      charity_id: charity_id || null,
      charity_percentage
    })
    .eq('id', user.id)

  revalidatePath('/dashboard')
}
