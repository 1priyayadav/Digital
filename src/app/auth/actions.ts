'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const data = Object.fromEntries(formData)

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  })

  if (error) {
    console.error('Login error:', error);
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const data = Object.fromEntries(formData)

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email as string,
    password: data.password as string,
  })

  if (error) {
    console.error('Signup error:', error);
    redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  if (authData?.user) {
    const charityId = data.charity_id ? String(data.charity_id) : null;
    const charityPercentage = data.charity_percentage ? parseInt(String(data.charity_percentage)) : 10;
    
    await supabase.from('profiles').insert({
      id: authData.user.id,
      charity_id: charityId,
      charity_percentage: charityPercentage >= 10 ? charityPercentage : 10,
      subscription_status: 'lapsed'
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
