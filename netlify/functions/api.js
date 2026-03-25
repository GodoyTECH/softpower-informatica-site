const crypto = require('crypto');

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  },
  body: JSON.stringify(body)
});

const toBase64Url = (value) => Buffer.from(value).toString('base64url');

const createToken = (payload, secret) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const decodeToken = (token, secret) => {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  if (payload.exp && Date.now() > payload.exp) return null;

  return payload;
};

const normalizePath = (path = '') => path
  .replace('/.netlify/functions/api', '')
  .replace('/api', '')
  .replace(/\/+$/, '') || '/';

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(204, {});
  }

  const rawPath = event.rawUrl ? new URL(event.rawUrl).pathname : event.path;
  const route = normalizePath(rawPath);
  const body = JSON.parse(event.body || '{}');

  const authSecret = process.env.AUTH_JWT_SECRET || process.env.ADMIN_JWT_SECRET || 'dev-auth-secret-change-me';
  const demoEmail = process.env.DEMO_USER_EMAIL || 'admin@luxe.com';
  const demoPassword = process.env.DEMO_USER_PASSWORD || process.env.ADMIN_PASS || '123456';
  const demoName = process.env.DEMO_USER_NAME || 'Administrador';

  if (event.httpMethod === 'POST' && route === '/auth/login') {
    const email = (body.email || body.username || '').toLowerCase().trim();
    const password = body.password || '';

    if (email !== demoEmail.toLowerCase() || password !== demoPassword) {
      return json(401, { success: false, message: 'Credenciais inválidas.' });
    }

    const user = {
      id: 'demo-admin',
      email: demoEmail,
      name: demoName,
      role: 'admin'
    };

    const token = createToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 * 24
    }, authSecret);

    return json(200, {
      success: true,
      token,
      accessToken: token,
      user
    });
  }

  if (event.httpMethod === 'GET' && route === '/me') {
    const authorization = event.headers.authorization || event.headers.Authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

    const decoded = decodeToken(token, authSecret);

    if (!decoded) {
      return json(401, { success: false, message: 'Sessão inválida.' });
    }

    return json(200, {
      success: true,
      user: {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        name: demoName
      }
    });
  }

  if (event.httpMethod === 'POST' && route === '/auth/register') {
    return json(200, {
      success: false,
      message: 'Cadastro desabilitado temporariamente. Use o usuário de teste para acessar o dashboard.'
    });
  }

  return json(404, { success: false, message: `Rota não encontrada: ${route}` });
};
