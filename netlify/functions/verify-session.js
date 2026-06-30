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

  // Confirm which Stripe account this key belongs to — critical for env-var auditing
  try {
    const acct = await stripe.accounts.retrieve()
    console.log(`verify-session: Stripe account ${acct.id} (${acct.email ?? 'no email'})`)
  } catch (acctErr) {
    console.error('verify-session: could not retrieve Stripe account —', acctErr.message)
  }

  const idSuffix = sessionId.slice(-12).toUpperCase()

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log(`verify-session: ${idSuffix} — status=${session.status} payment_status=${session.payment_status}`)
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
    console.error(`verify-session: Stripe error for ${idSuffix} —`, err.message)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: false, error: err.message }),
    }
  }
}
