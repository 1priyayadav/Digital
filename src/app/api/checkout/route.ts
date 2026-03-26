import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover',
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const plan = searchParams.get('plan') // 'monthly' or 'yearly'
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const priceId = plan === 'yearly' 
      ? process.env.STRIPE_PRICE_ID_YEARLY 
      : process.env.STRIPE_PRICE_ID_MONTHLY

    // Bypass Stripe if prices aren't configured (allows local testing)
    if (!priceId || priceId.startsWith('dummy_')) {
      const { createClient: createAdminClient } = require('@supabase/supabase-js')
      const adminSupabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error: updateError } = await adminSupabase.from('profiles').update({ subscription_status: 'active' }).eq('id', user.id)
      if (updateError) {
        console.error('Failed to update profile to active:', updateError)
        return new NextResponse('Internal Server Error: ' + updateError.message, { status: 500 })
      }
      
      const { revalidatePath } = require('next/cache')
      revalidatePath('/dashboard', 'page')
      
      return NextResponse.redirect(new URL('/dashboard?success=true', request.url))
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      client_reference_id: user.id,
      customer_email: user.email,
    })

    if (!session.url) {
        return new NextResponse('Failed to create checkout session', { status: 500 })
    }

    return NextResponse.redirect(new URL(session.url))
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
