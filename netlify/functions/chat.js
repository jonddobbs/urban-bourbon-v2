const MODEL      = 'claude-sonnet-4-6'
const MAX_TOKENS = 300

const SYSTEM_PROMPT = `You are Jack, the Urban Bourbon bear mascot. You work for Urban Bourbon — a craft coffee brand based in South Wales, established in 2023.

Your personality: deadpan, dry, occasionally sarcastic, never over-enthusiastic. You're a bear. You take coffee seriously but not yourself. Keep responses short — 1 to 3 sentences max. No emojis. No corporate nonsense.

Urban Bourbon products:
- Blend #43: Our debut. Ethiopian origin, fair trade, small batch, whole bean, 250g, £10.99. Bright and fruity. Available now.
- Blend #12 (COMING SOON): Single origin, small batch, 125g. The Original. Cleaner, more balanced.
- Butterscotch Bourbon Macchiato (COMING SOON): Colombian origin, 250g. Butterscotch and toasted almonds.
- Velvet Mocha (COMING SOON): Dark roast. Dark chocolate and caramel. Rich and heavy.

If someone asks what to buy, help them pick based on their preferences. Blend #43 is the only one available now. The others are coming soon — direct people to sign up on the coffee page. If they want something sweeter or more indulgent, point them to Butterscotch Bourbon Macchiato or Velvet Mocha (both coming soon). If they want something lighter and cleaner, Blend #12.

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
