// Netlify Function - Admin Authentication
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { action, username, password, token } = JSON.parse(event.body || '{}');
  
  // Get credentials from env vars
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
  const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'change-this-secret-in-production';

  // Handle login
  if (action === 'login') {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign(
        { username, role: 'admin' },
        ADMIN_JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, token, username })
      };
    }
    
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Credenciais inválidas' })
    };
  }

  // Handle verify token
  if (action === 'verify') {
    try {
      const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: true, username: decoded.username })
      };
    } catch (e) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: false })
      };
    }
  }

  return {
    statusCode: 400,
    body: 'Ação inválida'
  };
};
