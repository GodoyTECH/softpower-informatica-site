export async function handler(event) {
  const paymentId = event.queryStringParameters?.payment_id;
  if (!paymentId) return { statusCode: 400, body: JSON.stringify({ error: 'payment_id obrigatório' }) };
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return { statusCode: 503, body: JSON.stringify({ error: 'MP_ACCESS_TOKEN não configurado' }) };
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  const data = await res.json();
  return { statusCode: 200, body: JSON.stringify({ status: data.status || 'unknown', raw: data }) };
}
