import { loadProducts, formatBRL, getProductById } from './products.js';
import { addToCart, getCart } from './cart.js';
import { ReviewsProvider } from './reviewsProvider.js';
import { STORE_CONFIG } from './config.js';

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  countEl.textContent = String(getCart().reduce((acc, item) => acc + Number(item.quantity), 0));
}

async function init() {
  const id = new URLSearchParams(window.location.search).get('id');
  const wrap = document.getElementById('product-detail');
  if (!wrap || !id) return;

  try {
    const products = await loadProducts();
    const p = getProductById(products, id);
    if (!p) {
      wrap.innerHTML = '<p class="text-muted">Produto não encontrado.</p>';
      return;
    }

    wrap.innerHTML = `
      <div class="product-layout">
        <img src="${p.imagem}" alt="${p.nome}">
        <div>
          <span class="shop-cat">${p.categoria}</span>
          ${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ''}
          <h1>${p.nome}</h1>
          <p>${p.descricao}</p>
          <p><strong>Estoque:</strong> ${p.estoque}</p>
          <h2>${formatBRL(p.preco)}</h2>
          <div class="shop-actions" style="margin-top:16px;">
            <a class="btn btn-primary" id="buy-now" href="checkout.html?buy=${encodeURIComponent(p.id)}">Comprar</a>
            <button class="btn btn-outline" id="add-to-cart">Adicionar ao carrinho</button>
            <a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/5511958882556?text=${encodeURIComponent('Olá! Vim pelo site da Soft Power Informática e quero este produto: ' + p.nome)}">WhatsApp</a>
            <a class="btn btn-outline" id="google-review-btn" target="_blank" rel="noopener" style="display:none;">Avaliar no Google</a>
          </div>
        </div>
      </div>

      <section class="section" style="padding:24px 0 0;">
        <div class="card">
          <h3>Avaliações</h3>
          <p class="text-muted" id="reviews-summary">Carregando avaliações...</p>

          <form id="review-form" class="budget-form" style="margin-top:14px;">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="review-name">Nome (opcional)</label>
                <input id="review-name" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label" for="review-rating">Nota (1-5)</label>
                <select id="review-rating" class="form-select">
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="review-comment">Comentário</label>
              <textarea id="review-comment" class="form-textarea" required></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Enviar avaliação</button>
          </form>

          <div id="reviews-list" style="margin-top:16px;"></div>
        </div>
      </section>
    `;

    document.getElementById('add-to-cart').addEventListener('click', () => {
      addToCart(p, 1);
      updateCartCount();
      alert('Produto adicionado ao carrinho.');
    });

    const googleBtn = document.getElementById('google-review-btn');
    if (STORE_CONFIG.googleReviewUrl && googleBtn) {
      googleBtn.href = STORE_CONFIG.googleReviewUrl;
      googleBtn.style.display = 'inline-flex';
    }

    const summaryEl = document.getElementById('reviews-summary');
    const listEl = document.getElementById('reviews-list');

    const renderReviews = async () => {
      if (!ReviewsProvider.isEnabled()) {
        summaryEl.textContent = 'Avaliações internas em configuração. Use o botão "Avaliar no Google".';
        listEl.innerHTML = '';
        return;
      }

      const reviews = await ReviewsProvider.list(p.id, 5);
      if (!reviews.length) {
        summaryEl.textContent = 'Ainda não há avaliações para este produto.';
        listEl.innerHTML = '';
        return;
      }

      const avg = reviews.reduce((a, r) => a + Number(r.rating || 0), 0) / reviews.length;
      summaryEl.textContent = `Média: ${avg.toFixed(1)} ⭐ (${reviews.length} avaliação(ões))`;

      listEl.innerHTML = reviews.map((r) => `
        <article class="card" style="padding:14px; margin-top:10px;">
          <strong>${'⭐'.repeat(Number(r.rating || 0))}</strong>
          <p style="margin-top:6px;">${r.comment || ''}</p>
          <small class="text-muted">${r.name || 'Cliente'} • ${new Date(r.created_at).toLocaleDateString('pt-BR')}</small>
        </article>
      `).join('');
    };

    document.getElementById('review-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!ReviewsProvider.isEnabled()) {
        alert('Avaliações internas não configuradas ainda.');
        return;
      }

      const rating = Number(document.getElementById('review-rating')?.value || 5);
      const comment = document.getElementById('review-comment')?.value.trim();
      const name = document.getElementById('review-name')?.value.trim();
      if (!comment) {
        alert('Escreva um comentário para avaliar.');
        return;
      }

      await ReviewsProvider.create({ productId: p.id, rating, comment, name });
      document.getElementById('review-comment').value = '';
      renderReviews();
    });

    await renderReviews();
    updateCartCount();
  } catch (err) {
    wrap.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
}

init();
