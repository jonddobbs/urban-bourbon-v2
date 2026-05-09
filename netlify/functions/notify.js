const ADMIN_EMAIL = 'hello@urbanbourbon.co.uk'
const FROM_EMAIL  = 'Jack at Urban Bourbon <hello@urbanbourbon.co.uk>'

const BLEND_DISPLAY = {
  'b12':      'Blend #12 — The Winter Roast',
  'bbs':      'Butterscotch Bourbon Macchiato',
  'bvm':      'Velvet Mocha',
  'waitlist': 'Free Sample (Blend #43)',
}

function customerHtml(blendName, isWaitlist) {
  const bodyText = isWaitlist
    ? `Good call. We'll get your free 30g sample of Blend #43 sorted — Ethiopian origin, bright and fruity, fair trade. Just cover the postage and it's yours.<br><br>We'll be in touch shortly with the details.`
    : `You're first in line for ${blendName}. We'll drop you an email the moment it's available — before anyone else hears about it.`

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="padding-bottom:32px;border-bottom:1px solid #1a1a1a;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:4px;color:#39FF14;text-transform:uppercase;">
              URBAN BOURBON
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 0;">
            <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;letter-spacing:3px;color:#ffffff;text-transform:uppercase;line-height:1.1;">
              YOU'RE ON<br>THE LIST.
            </p>
            <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;">
              ${bodyText}
            </p>
            <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;">
              In the meantime, Blend #43 is available now — Ethiopian origin, fair trade, small batch. £10.99 for 250g.
            </p>
            <a href="https://urbanbourbon.co.uk/coffee"
              style="display:inline-block;background:#39FF14;color:#000000;font-family:Arial,sans-serif;font-size:14px;font-weight:900;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 32px;">
              SHOP BLEND #43
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:32px;border-top:1px solid #1a1a1a;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.25);letter-spacing:2px;text-transform:uppercase;">
              — Jack, Urban Bourbon · South Wales
            </p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.15);">
              You're receiving this because you signed up at urbanbourbon.co.uk.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function notificationHtml(email, blendName) {
  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#111;padding:24px;">
  <p><strong>New waitlist signup</strong></p>
  <p>Email: ${email}</p>
  <p>Blend: ${blendName}</p>
</body></html>`
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let email, blendId
  try {
    ;({ email, blendId } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  if (!email || !blendId) {
    return { statusCode: 400, body: 'email and blendId are required' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: 'RESEND_API_KEY not configured' }
  }

  const blendName  = BLEND_DISPLAY[blendId] ?? blendId
  const isWaitlist = blendId === 'waitlist'

  async function send(payload) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const body = await res.text()
    if (!res.ok) {
      console.error('Resend error:', res.status, body)
      throw new Error(`Resend ${res.status}: ${body}`)
    }
    return JSON.parse(body)
  }

  try {
    await Promise.all([
      send({
        from: FROM_EMAIL,
        to: [email],
        subject: isWaitlist
          ? "Your free sample is on its way (almost) — Urban Bourbon"
          : `You're on the list for ${blendName} — Urban Bourbon`,
        html: customerHtml(blendName, isWaitlist),
      }),
      send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `New signup: ${blendName}`,
        html: notificationHtml(email, blendName),
      }),
    ])

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('notify function error:', err.message)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
