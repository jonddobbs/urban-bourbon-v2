const FROM_EMAIL = 'Jack at Urban Bourbon <hello@urbanbourbon.co.uk>'

function welcomeHtml() {
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
              YOU'RE IN.
            </p>
            <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;">
              Welcome to the crew. You'll hear from us when there's a new drop, a limited batch, or the occasional bit of nonsense. Nothing else.
            </p>
            <p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;">
              While you're here — Blend #43 is out now. Ethiopian origin, fair trade, small batch. Bright and fruity. £10.99 for 250g.
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

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let email
  try {
    ;({ email } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  if (!email) {
    return { statusCode: 400, body: 'email is required' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: 'RESEND_API_KEY not configured' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Welcome to Urban Bourbon ☕',
        html: welcomeHtml(),
      }),
    })

    const body = await res.text()
    if (!res.ok) {
      console.error('Resend error:', res.status, body)
      throw new Error(`Resend ${res.status}: ${body}`)
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('subscribe function error:', err.message)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
