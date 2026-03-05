import { loadProducts, formatBRL, getProductById } from './products.js';
import { addToCart, getCart } from './cart.js';
import { STORE_CONFIG } from './store.js';
import { applyWhatsAppOnlyMode, openWhatsApp, createWhatsAppCTA, addItemToWhatsAppCart, buildWhatsAppCartMessage, clearWhatsAppCart, getWhatsAppCartCount } from './whatsapp-mode.js';

const CONFIG = window.APP_CONFIG || {};
const GOOGLE_REVIEW_URL = CONFIG.googleReviewUrl || '';
const isService = (p) => p.tipo === 'servico';

const ReviewsProvider = {
  async list(productId) {
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return [];
    const url = `${CONFIG.supabaseUrl}/rest/v1/product_reviews?product_id=eq.${productId}&select=*&order=created_at.desc&limit=5`;
    const res = await fetch(url, { headers: { apikey: CONFIG.supabaseAnonKey, Authorization: `Bearer ${CONFIG.supabaseAnonKey}` } });
    return res.ok ? res.json() : [];
  },
  async create(payload) {
    if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return null;
    const url = `${CONFIG.supabaseUrl}/rest/v1/product_reviews`;
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CONFIG.supabaseAnonKey, Authorization: `Bearer ${CONFIG.supabaseAnonKey}`, Prefer: 'return=representation' }, body: JSON.stringify(payload) });
    return res.ok ? (await res.json())[0] : null;
  }
};

async function renderReviews(productId) {
  const listEl = document.getElementById('reviews-list'); if (!listEl) return;
  const reviews = await ReviewsProvider.list(productId);
  if (!reviews.length) return (listEl.innerHTML = '<p class="text-muted">Sem avaliações ainda.</p>');
  const avg = (reviews.reduce((a, r) => a + Number(r.rating || 0), 0) / reviews.length).toFixed(1);
  document.getElementById('reviews-summary').textContent = `Média ${avg} ★ (${reviews.length})`;
  listEl.innerHTML = reviews.map((r) => `<div class="review-item"><strong>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</strong> — ${r.name || 'Cliente'} <small>${new Date(r.created_at).toLocaleDateString('pt-BR')}</small><p>${r.comment || ''}</p></div>`).join('');
}

async function init() {
  const id = new URLSearchParams(window.location.search).get('id');
  const wrap = document.getElementById('product-detail'); if (!wrap || !id) return;
  try {
    const products = await loadProducts(); const p = getProductById(products, id);
    if (!p) return (wrap.innerHTML = '<p class="text-muted">Produto não encontrado.</p>');

    wrap.innerHTML = `<div class="product-layout" data-item-id="${p.id}"><img src="${p.imagem}" alt="${p.nome}"><div><span class="shop-cat">${p.categoria}</span>${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ''}<h1>${p.nome}</h1><p>${p.descricao}</p><p><strong>Estoque:</strong> ${p.estoque}</p><h2>${isService(p) ? 'Sob consulta' : formatBRL(p.preco)}</h2><div class="shop-actions" style="margin-top:16px;">${createWhatsAppCTA(p, isService(p) ? 'Quero esse serviço' : 'Quero esse item')}<button id="add-cart-product" class="btn btn-outline" type="button">Adicionar ao carrinho</button><button id="wa-clear-selection-product" class="btn btn-outline" type="button">Limpar seleção</button><span id="wa-selected-count-product" class="text-muted"></span>${GOOGLE_REVIEW_URL ? `<a class="btn btn-outline" target="_blank" rel="noopener" href="${GOOGLE_REVIEW_URL}">Avaliar no Google</a>` : ''}</div><div class="review-box"><h3>Avaliações</h3><p id="reviews-summary" class="text-muted"></p><form id="review-form"><input id="review-name" placeholder="Seu nome (opcional)"><select id="review-rating" required><option value="">Nota</option><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select><textarea id="review-comment" placeholder="Comentário" required></textarea><button class="btn btn-primary" type="submit">Enviar avaliação</button></form><div id="reviews-list"></div></div></div></div>`;

    const refreshCount = () => {
      const el = document.getElementById('wa-selected-count-product');
      if (el) el.textContent = `${getWhatsAppCartCount()} selecionado(s)`;
    };

    document.querySelector('.js-whatsapp-item')?.addEventListener('click', () => {
      const cart = addItemToWhatsAppCart({ ...p, short_description: p.short_description || p.descricao });
      refreshCount();
      openWhatsApp(buildWhatsAppCartMessage(cart));
    });

    document.getElementById('wa-clear-selection-product')?.addEventListener('click', () => {
      clearWhatsAppCart();
      refreshCount();
      alert('Seleção de itens limpa.');
    });

    document.getElementById('add-cart-product')?.addEventListener('click', () => {
      addToCart({ ...p, url: window.location.href }, 1);
      const countEl = document.getElementById('cart-count');
      if (countEl) countEl.textContent = String(getCart().reduce((a, i) => a + Number(i.quantity), 0));
      alert('Item adicionado ao carrinho.');
    });

    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = String(getCart().reduce((a, i) => a + Number(i.quantity), 0));
    refreshCount();

    document.getElementById('review-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = { product_id: p.id, name: document.getElementById('review-name').value.trim() || null, rating: Number(document.getElementById('review-rating').value), comment: document.getElementById('review-comment').value.trim(), created_at: new Date().toISOString() };
      if (!payload.rating || !payload.comment) return alert('Preencha nota e comentário.');
      const out = await ReviewsProvider.create(payload);
      if (!out) alert('Para gravar avaliações, configure Supabase.');
      e.target.reset();
      renderReviews(p.id);
    });

    if (STORE_CONFIG.WHATSAPP_ONLY_MODE) applyWhatsAppOnlyMode();
    await renderReviews(p.id);
  } catch (err) { wrap.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}

init();
