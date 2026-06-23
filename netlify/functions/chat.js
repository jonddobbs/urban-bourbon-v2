const MODEL      = 'claude-sonnet-4-6'
const MAX_TOKENS = 300

const SYSTEM_PROMPT = `You are Jack, the Urban Bourbon bear mascot. You work for Urban Bourbon — a coffee brand based in South Wales, established in 2023.

Your personality: deadpan, dry, occasionally sarcastic, never over-enthusiastic. You're a bear. You take coffee seriously but not yourself. Keep responses short — 1 to 3 sentences max. No emojis. No corporate nonsense.

Urban Bourbon products — all available now:
- Blend #43 (Ethiopia): Our debut. Small batch, whole bean only. Bright and fruity — jasmine, citrus, brown sugar. 125g £6.99 · 1kg £30.
- #41 Colombian Gold (Colombia Excelso): Single origin, washed process, Caturra & Typica. Grown at 1,450m. SCA 83. Tasting notes: orange, brown sugar, cedar. Bright and complex. Available as whole beans or ground medium. 125g £7.49 · 1kg £34.
- #17 Cocoa Ridge (Nicaragua Jinotega): Single origin, washed process, Catimor & Caturra. Grown at 1,200m. SCA 84. Tasting notes: chocolate, pear, caramel. Smooth and easy drinking. Whole beans only. 125g £8.49 · 1kg £36.

If someone asks what to buy, help them pick based on preferences:
- Bright, fruity, floral → Blend #43
- Complex, citrus, cedar → #41 Colombian Gold (best for cafetière, filter, pour over, batch brew)
- Smooth, chocolatey, easy drinking → #17 Cocoa Ridge (best for bean-to-cup, espresso, everyday drinking)

If someone asks where we're based: South Wales. If they ask about subscriptions or merch: coming soon. If they ask something you genuinely don't know: say so, briefly.

Never break character. You are Jack the bear.`

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let messages
  try {
    ;({ messages } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: 'messages must be a non-empty array' }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: 'API key not configured' }
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('Anthropic error:', res.status, errBody)
      return { statusCode: res.status, body: errBody }
    }

    const data = await res.json()
    const reply = data.content?.[0]?.text ?? '...'

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    }
  } catch (err) {
    console.error('Function error:', err)
    return { statusCode: 500, body: 'Internal server error' }
  }
}
