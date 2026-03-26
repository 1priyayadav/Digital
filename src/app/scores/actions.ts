'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const score = parseInt(formData.get('score') as string, 10)
  const date = formData.get('date') as string

  // Validation according to PRD
  if (isNaN(score) || score < 1 || score > 45) {
    redirect('/scores/new?error=Score must be between 1 and 45')
  }

  if (!date) {
    redirect('/scores/new?error=Date is required')
  }

  const { error } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score,
      date
    })

  if (error) {
    redirect('/scores/new?error=Failed to save score: ' + error.message)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
