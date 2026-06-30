import Stripe from 'stripe'

export async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const sessionId = event.queryStringParameters?.session_id

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: false, error: 'invalid_session_id' }),
    }
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return { statusCode: 500, body: 'Stripe not configured' }
  }

  const stripe = new Stripe(stripeKey)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paid:          session.payment_status === 'paid',
        expired:       session.status === 'expired',
        total:         session.amount_total != null ? session.amount_total / 100 : null,
        customerEmail: session.customer_details?.email ?? null,
      }),
    }
  } catch (err) {
    // Stripe throws on unknown/malformed session IDs
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: false, error: err.message }),
    }
  }
}
