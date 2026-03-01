import crypto from 'crypto';

export default async (req) => {
  try {
    const secret = process.env.MP_WEBHOOK_SECRET || '';
    const signature = req.headers['x-signature'] || '';

    if (secret) {
      const expected = crypto.createHmac('sha256', secret).update(req.body || '').digest('hex');
      if (!signature.includes(expected)) {
        return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'invalid signature' }) };
      }
    }

    // Futuro: atualizar tabela orders no Supabase com status do pagamento
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
