import crypto from 'crypto';

export default async (req) => {
  if (req.method !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(req.body || '{}');
    const { cart = [], customer = {} } = body;

    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, mode: 'placeholder', message: 'MP_ACCESS_TOKEN não configurado.' })
      };
    }

    const items = cart.map((item) => ({
      title: item.nome,
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.preco || 0),
      currency_id: 'BRL'
    }));

    const extRef = `softpower_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const webhookUrl = process.env.MP_WEBHOOK_URL || '';

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items,
        external_reference: extRef,
        payer: {
          name: customer.nome || undefined,
          email: customer.email || undefined
        },
        notification_url: webhookUrl || undefined,
        metadata: {
          whatsapp: customer.whatsapp || '',
          entrega: customer.entrega || '',
          endereco: customer.endereco || ''
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || 'Erro Mercado Pago');

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        mode: 'mercado_pago',
        paymentUrl: data?.init_point || null,
        sandboxUrl: data?.sandbox_init_point || null,
        preferenceId: data?.id || null,
        qrCode: null,
        pixCopyPaste: null
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
