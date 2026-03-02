export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  try {
    const { cart = [], customer = {} } = JSON.parse(event.body || '{}');
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return { statusCode: 503, body: JSON.stringify({ error: 'MP_ACCESS_TOKEN não configurado' }) };

    const items = cart.map((i) => ({ title: i.nome, quantity: Number(i.quantity || 1), unit_price: Number(i.preco || 0), currency_id: 'BRL' }));
    const resp = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, payer: { name: customer.nome, phone: { number: customer.whatsapp } }, back_urls: { success: `${process.env.URL}/obrigado.html?status=paid`, failure: `${process.env.URL}/checkout.html?status=failed`, pending: `${process.env.URL}/checkout.html?status=pending` }, auto_return: 'approved' })
    });
    const data = await resp.json();
    return { statusCode: 200, body: JSON.stringify({ url: data.init_point || data.sandbox_init_point || null, payment_id: data.id || null }) };
  } catch (e) { return { statusCode: 500, body: JSON.stringify({ error: e.message }) }; }
}
