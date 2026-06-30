import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const FROM_EMAIL   = 'Jon at Urban Bourbon <hello@urbanbourbon.co.uk>'
const ADMIN_EMAILS = ['hello@urbanbourbon.co.uk', 'jonnydd4@googlemail.com']

function customerEmailHtml({ orderRef, items, total, shippingPaid, shippingAddress }) {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:8px 0;font-size:13px;color:rgba(255,255,255,0.7);border-bottom:1px solid #1e1e1e;">
        ${item.name}${item.size ? ` &middot; ${item.size}` : ''}
      </td>
      <td style="padding:8px 0;font-size:13px;color:rgba(255,255,255,0.4);text-align:center;border-bottom:1px solid #1e1e1e;">
        &times; ${item.quantity}
      </td>
      <td style="padding:8px 0;font-size:13px;color:rgba(255,255,255,0.7);text-align:right;border-bottom:1px solid #1e1e1e;">
        &pound;${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>`).join('')

  const shippingLine = shippingPaid > 0 ? `&pound;${shippingPaid.toFixed(2)}` : 'Free'

  const addr = shippingAddress?.address
  const addrLines = [
    shippingAddress?.name,
    addr?.line1,
    addr?.line2,
    addr?.city,
    addr?.postal_code,
  ].filter(Boolean).join('<br>')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <tr>
          <td style="padding-bottom:28px;border-bottom:1px solid #1a1a1a;">
            <p style="margin:0;font-size:22px;font-weight:900;letter-spacing:4px;
                      color:#39FF14;text-transform:uppercase;">URBAN BOURBON</p>
          </td>
        </tr>

        <tr>
          <td style="padding:40px 0 24px;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:4px;
                      color:#39FF14;text-transform:uppercase;">Order Confirmed</p>
            <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:3px;
                      color:#ffffff;text-transform:uppercase;line-height:1.05;">
              THANK<br>YOU.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding-bottom:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;">
              Your order is in. We'll get it packed and out to you shortly &mdash;
              we'll be in touch once it's on its way.
            </p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;">
              In the meantime, if anything looks wrong here just reply to this
              email and I'll sort it.
            </p>
          </td>
        </tr>

        <tr>
          <td style="border:1px solid #1e1e1e;padding:24px 28px;background:#111;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:3px;
                      color:rgba(255,255,255,0.3);text-transform:uppercase;">Order Summary</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemRows}
              <tr>
                <td style="padding:12px 0 6px;font-size:13px;color:rgba(255,255,255,0.4);">
                  Shipping
                </td>
                <td></td>
                <td style="padding:12px 0 6px;font-size:13px;color:rgba(255,255,255,0.4);text-align:right;">
                  ${shippingLine}
                </td>
              </tr>
              <tr>
                <td style="padding-top:10px;font-size:16px;font-weight:700;letter-spacing:1px;
                           color:#ffffff;border-top:1px solid #1e1e1e;">Total</td>
                <td style="border-top:1px solid #1e1e1e;"></td>
                <td style="padding-top:10px;font-size:22px;font-weight:900;letter-spacing:2px;
                           color:#39FF14;text-align:right;border-top:1px solid #1e1e1e;">
                  &pound;${total.toFixed(2)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 0 0;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:3px;
                      color:rgba(255,255,255,0.3);text-transform:uppercase;">Shipping to</p>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.8;">
              ${addrLines}
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 0 32px;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;
                      color:rgba(255,255,255,0.2);text-transform:uppercase;">Ref: ${orderRef}</p>
          </td>
        </tr>

        <tr>
          <td style="padding-bottom:40px;">
            <a href="https://urbanbourbon.co.uk/coffee"
               style="display:inline-block;background:#39FF14;color:#000000;
                      font-size:13px;font-weight:900;letter-spacing:3px;
                      text-transform:uppercase;text-decoration:none;padding:14px 32px;">
              SHOP AGAIN
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding-top:28px;border-top:1px solid #1a1a1a;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;">
                  <img src="https://urbanbourbon.co.uk/images/bear-nobg.png"
                       alt="" width="36" style="display:block;opacity:0.5;" />
                </td>
                <td style="vertical-align:middle;padding-left:12px;">
                  <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);
                             letter-spacing:2px;text-transform:uppercase;">
                    &mdash; Jon, Urban Bourbon
                  </p>
                  <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.15);">
                    urbanbourbon.co.uk
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function adminEmailHtml({ customerName, customerEmail, orderRef, paymentIntent, items, total, shippingAddress }) {
  const addr = shippingAddress?.address
  const addrLines = [
    shippingAddress?.name,
    addr?.line1,
    addr?.line2,
    addr?.city,
    addr?.postal_code,
  ].filter(Boolean).join('<br>')

  const itemsText = items.map(i =>
    `${i.name}${i.size ? ` &middot; ${i.size}` : ''} &times; ${i.quantity} &mdash; &pound;${(i.price * i.quantity).toFixed(2)}`
  ).join('<br>')

  const stripeLink = paymentIntent
    ? `<a href="https://dashboard.stripe.com/payments/${paymentIntent}"
          style="font-size:13px;font-weight:700;color:#635bff;text-decoration:none;">View in Stripe &rarr;</a>`
    : ''

  return `<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#111;padding:24px;background:#f9f9f9;">
  <table cellpadding="0" cellspacing="0"
         style="max-width:520px;background:#fff;padding:28px 32px;border:1px solid #e5e5e5;">
    <tr>
      <td>
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;
                  color:#39FF14;text-transform:uppercase;background:#111;
                  display:inline-block;padding:4px 8px;">URBAN BOURBON</p>
        <h2 style="margin:16px 0 24px;font-size:22px;font-weight:900;color:#111;">
          New order placed
        </h2>

        <table width="100%" cellpadding="0" cellspacing="0"
               style="border-top:2px solid #111;margin-bottom:20px;">
          <tr>
            <td style="padding:10px 0;font-size:13px;color:#555;
                       border-bottom:1px solid #eee;width:40%;">Customer</td>
            <td style="padding:10px 0;font-size:13px;font-weight:600;color:#111;
                       border-bottom:1px solid #eee;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:13px;color:#555;
                       border-bottom:1px solid #eee;">Email</td>
            <td style="padding:10px 0;font-size:13px;color:#111;
                       border-bottom:1px solid #eee;">${customerEmail}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:13px;color:#555;
                       border-bottom:1px solid #eee;vertical-align:top;">Ship to</td>
            <td style="padding:10px 0;font-size:13px;color:#111;
                       border-bottom:1px solid #eee;line-height:1.6;">${addrLines}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:13px;color:#555;
                       border-bottom:1px solid #eee;vertical-align:top;">Items</td>
            <td style="padding:10px 0;font-size:13px;color:#111;
                       border-bottom:1px solid #eee;line-height:1.7;">${itemsText}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:13px;color:#555;
                       border-bottom:1px solid #eee;">Total</td>
            <td style="padding:10px 0;font-size:16px;font-weight:900;color:#111;
                       border-bottom:1px solid #eee;">&pound;${total.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:13px;color:#555;">Ref</td>
            <td style="padding:10px 0;font-size:12px;color:#888;
                       font-family:monospace;">${orderRef}</td>
          </tr>
        </table>

        <p style="margin:0 0 8px;">${stripeLink}</p>
        <p style="margin:0;">
          <a href="https://supabase.com/dashboard/project/hvpzfjfvzaxiprhdqatl/editor"
             style="font-size:13px;font-weight:700;color:#3ecf8e;text-decoration:none;">
            View orders in Supabase &rarr;
          </a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend ${res.status}: ${body}`)
  }
}

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
  // Prefer the retrieved fullSession; fall back to the event payload's session copy since
  // the expand call can occasionally omit shipping_details even when it's present on the event.
  const shippingAddress = fullSession.shipping_details ?? session.shipping_details ?? null

  if (!shippingAddress) {
    console.warn('stripe-webhook: shipping_details missing on both fullSession and event session for', session.id)
  }

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

  // Send order emails — a failure here must not return 5xx to Stripe (would trigger a retry
  // that would hit the idempotency check, but still cleaner to keep emails non-fatal)
  const resendKey     = process.env.RESEND_API_KEY
  const customerEmail = fullSession.customer_details?.email
  const customerName  = fullSession.customer_details?.name ?? 'Customer'
  const orderRef      = session.id.slice(-12).toUpperCase()
  const paymentIntent = fullSession.payment_intent ?? null
  const shippingPaid  = ((fullSession.amount_total ?? 0) - (fullSession.amount_subtotal ?? 0)) / 100

  if (resendKey && customerEmail) {
    try {
      await Promise.all([
        sendEmail(resendKey, {
          from:    FROM_EMAIL,
          to:      [customerEmail],
          subject: 'Order confirmed — Urban Bourbon',
          html:    customerEmailHtml({ orderRef, items, total, shippingPaid, shippingAddress }),
        }),
        sendEmail(resendKey, {
          from:    FROM_EMAIL,
          to:      ADMIN_EMAILS,
          subject: `New order — £${total.toFixed(2)} — ${customerName}`,
          html:    adminEmailHtml({ customerName, customerEmail, orderRef, paymentIntent, items, total, shippingAddress }),
        }),
      ])
      console.log(`stripe-webhook: emails sent for ${session.id}`)
    } catch (emailErr) {
      console.error('stripe-webhook: email error (order still recorded) —', emailErr.message)
    }
  } else {
    console.warn('stripe-webhook: skipping emails — RESEND_API_KEY missing or no customer email on session')
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}
