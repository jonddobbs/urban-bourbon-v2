import Stripe from 'stripe'

// Shipping figures from Urban Bourbon Price List.xlsx — updated 18 Jun 26
const FREE_SHIPPING_THRESHOLD_PENCE = 2500  // £25.00
const STANDARD_SHIPPING_PENCE       = 350   // £3.50

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let items, customerEmail
  try {
    ;({ items, customerEmail } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { statusCode: 400, body: 'items must be a non-empty array' }
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return { statusCode: 500, body: 'Stripe key not configured' }
  }

  const stripe = new Stripe(secretKey)

  // Confirm which Stripe account this key belongs to — critical for env-var auditing
  try {
    const acct = await stripe.accounts.retrieve()
    console.log(`create-checkout-session: Stripe account ${acct.id} (${acct.email ?? 'no email'})`)
  } catch (acctErr) {
    console.error('create-checkout-session: could not retrieve Stripe account —', acctErr.message)
  }

  // Derive origin: prefer Netlify's deploy URL env var, fall back to the request header
  const origin =
    process.env.URL ||
    process.env.DEPLOY_URL ||
    (event.headers.origin ?? 'http://localhost:5173')

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.size,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    // Subtotal in pence — avoids floating-point drift when comparing against threshold
    const subtotalPence = items.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0
    )

    // Internal test orders always get free shipping — sentinel is the item name prefix
    const isTestOrder = items.every(i => i.name.startsWith('[INTERNAL TEST]'))

    const shippingOption = isTestOrder || subtotalPence >= FREE_SHIPPING_THRESHOLD_PENCE
      ? {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'gbp' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        }
      : {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: STANDARD_SHIPPING_PENCE, currency: 'gbp' },
            display_name: 'Standard shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      payment_intent_data: { capture_method: 'automatic' },
      allow_promotion_codes: true,
      customer_email: customerEmail || undefined,
      shipping_address_collection: { allowed_countries: ['GB'] },
      shipping_options: [shippingOption],
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    })

    console.log(`create-checkout-session: session created — ${session.id} subtotal=${subtotalPence}p shipping=${shippingOption.shipping_rate_data.fixed_amount.amount}p`)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    }
  } catch (err) {
    console.error('Stripe error:', err)
    return { statusCode: 500, body: err.message }
  }
}
