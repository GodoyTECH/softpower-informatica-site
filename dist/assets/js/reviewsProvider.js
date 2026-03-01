const SUPABASE_URL = window.__ENV__?.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY || '';

const enabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function request(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });

  if (!res.ok) throw new Error('Falha na API de reviews');
  return res.status === 204 ? null : res.json();
}

export const ReviewsProvider = {
  isEnabled() {
    return enabled;
  },

  async list(productId, limit = 5) {
    if (!enabled) return [];
    const query = `product_reviews?product_id=eq.${encodeURIComponent(productId)}&select=*&order=created_at.desc&limit=${limit}`;
    return request(query);
  },

  async create({ productId, rating, comment, name }) {
    if (!enabled) throw new Error('Reviews desativado');
    const payload = [{
      product_id: productId,
      rating: Number(rating),
      comment: String(comment || '').trim(),
      name: String(name || '').trim() || null
    }];
    const out = await request('product_reviews', { method: 'POST', body: JSON.stringify(payload) });
    return out?.[0] || null;
  }
};
