const crypto = require('crypto');

exports.handler = async (event) => {
  try {
    const secret = process.env.MP_WEBHOOK_SECRET || '';
    const signature = event.headers['x-signature'] || event.headers['X-Signature'] || '';

    if (secret) {
      const expected = crypto.createHmac('sha256', secret).update(event.body || '').digest('hex');
      if (!String(signature).includes(expected)) {
        return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'invalid signature' }) };
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
