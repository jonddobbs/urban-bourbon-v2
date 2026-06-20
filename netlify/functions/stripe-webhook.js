import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const sig        = event.headers['stripe-signature']
  const secret     = process.env.STRIPE_WEBHOOK_SECRET
  const stripeKey  = process.env.STRIPE_SECRET_KEY

  if (!sig || !secret || !stripeKey) {
    console.error('stripe-webhook: missing env — STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY')
    return { statusCode: 400, body: 'Configuration error' }
  }

  const stripe = new Stripe(stripeKey)

  // Netlify may base64-encode the body; Stripe signature verification needs the raw bytes
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    console.error('stripe-webhook: signature verification failed —', err.message)
    return { statusCode: 400, body: `Webhook Error: ${err.message}` }
  }

  // Acknowledge every event type immediately; only fulfil on completed checkout
  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: JSON.stringify({ received: true }) }
  }

  const session = stripeEvent.data.object

  // Guard against async payment methods (e.g. BACS) that complete later
  if (session.payment_status !== 'paid') {
    return { statusCode: 200, body: JSON.stringify({ received: true, skipped: 'payment_pending' }) }
  }

  // Retrieve the full session with expanded line items so we get product names + sizes
  let fullSession
  try {
    fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    })
  } catch (err) {
    console.error('stripe-webhook: failed to retrieve session —', err.message)
    return { statusCode: 500, body: 'Failed to retrieve session details' }
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('stripe-webhook: missing Supabase credentials')
    return { statusCode: 500, body: 'Database not configured' }
  }

  // Service-role client bypasses RLS — safe for server-side writes only
  const supabase = createClient(supabaseUrl, serviceKey)

  // Idempotency check — Stripe retries on 5xx, so a duplicate event must not create a second row
  const { data: existing, error: lookupError } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .maybeSingle()

  if (lookupError) {
    console.error('stripe-webhook: Supabase lookup error —', lookupError)
    return { statusCode: 500, body: 'Database lookup failed' }
  }

  if (existing) {
    console.log(`stripe-webhook: duplicate event for ${session.id} — skipping`)
    return { statusCode: 200, body: JSON.stringify({ received: true, duplicate: true }) }
  }

  // Map Stripe line items → orders.items shape
  // product.name  = item.name  (set in create-checkout-session.js via product_data.name)
  // product.description = item.size (set via product_data.description)
  const items = fullSession.line_items.data.map(li => ({
    name:     li.price.product.name,
    size:     li.price.product.description ?? null,
    price:    li.price.unit_amount / 100,
    quantity: li.quantity,
  }))

  const total = (fullSession.amount_total ?? 0) / 100

  // shipping_details shape: { name, address: { line1, line2, city, state, postal_code, country } }
  const shippingAddress = fullSession.shipping_details ?? null

  const { error: insertError } = await supabase.from('orders').insert({
    user_id:          null,   // guest checkout — no Supabase auth user linked at payment time
    items,
    total,
    stripe_session_id: session.id,
    status:           'paid',
    shipping_address: shippingAddress,
  })

  if (insertError) {
    console.error('stripe-webhook: Supabase insert error —', insertError)
    return { statusCode: 500, body: 'Database write failed' }
  }

  console.log(`stripe-webhook: order recorded — ${session.id} £${total.toFixed(2)}`)
  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}
