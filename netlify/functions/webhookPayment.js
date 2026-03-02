export async function handler(event) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  const signature = event.headers['x-signature'] || event.headers['X-Signature'];
  if (secret && signature !== secret) return { statusCode: 401, body: 'invalid signature' };
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}
