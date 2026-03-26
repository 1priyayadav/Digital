import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the Stripe event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      if (userId) {
        // Update user profile
        await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: customerId,
            subscription_status: 'active',
          })
          .eq('id', userId)
          
        await supabaseAdmin
          .from('subscriptions')
          .insert({
            user_id: userId,
            status: 'active',
            plan_id: subscriptionId,
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', subscription.customer)
        .single()
        
      if (profile) {
        await supabaseAdmin
          .from('profiles')
          .update({ subscription_status: 'lapsed' })
          .eq('id', profile.id)
          
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', profile.id)
      }
      break
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
          const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', subscription.customer)
          .single()
          
          if (profile) {
             await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: 'renewal_pending' })
            .eq('id', profile.id)
          }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
