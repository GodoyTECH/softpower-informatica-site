import { loadProducts, formatBRL, getCategoryList } from './products.js';
import { STORE_CONFIG } from './store.js';
import { applyWhatsAppOnlyMode, openWhatsApp, createWhatsAppCTA, addItemToWhatsAppCart, buildWhatsAppCartMessage } from './whatsapp-mode.js';

function isService(p) { return p.tipo === 'servico'; }

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return { q: (params.get('q') || '').trim().toLowerCase(), category: (params.get('categoria') || '').trim() };
}

function renderFilters(products) {
  const wrap = document.getElementById('category-filters'); if (!wrap) return;
  const categories = getCategoryList(products); const current = getParams().category; wrap.innerHTML = '';
  const allBtn = document.createElement('a'); allBtn.href = 'loja.html'; allBtn.className = `filter-chip ${!current ? 'active' : ''}`; allBtn.textContent = 'Todos'; wrap.appendChild(allBtn);
  categories.forEach((cat) => { const a = document.createElement('a'); a.href = `loja.html?categoria=${encodeURIComponent(cat)}`; a.className = `filter-chip ${current === cat ? 'active' : ''}`; a.textContent = cat; wrap.appendChild(a); });
}

function bindWhatsAppButtons(products) {
  document.querySelectorAll('.js-whatsapp-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = products.find((p) => p.id === btn.dataset.itemId);
      if (!product) return;
      const cart = addItemToWhatsAppCart({
        ...product,
        short_description: product.short_description || product.descricao,
        url: `${window.location.origin}/produto.html?id=${encodeURIComponent(product.id)}`
      });
      openWhatsApp(buildWhatsAppCartMessage(cart));
    });
  });
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid'); if (!grid) return;
  const { q, category } = getParams();
  const filtered = products.filter((p) => (!category || p.categoria === category) && (!q || `${p.nome} ${p.descricao} ${p.categoria}`.toLowerCase().includes(q)));
  document.getElementById('results-count').textContent = `${filtered.length} item(ns)`;
  if (!filtered.length) return (grid.innerHTML = '<p class="text-muted">Nenhum produto encontrado para esse filtro.</p>');

  grid.innerHTML = filtered.map((p) => `
    <article class="shop-card" data-item-id="${p.id}">
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      <div class="shop-body">
        <span class="shop-cat">${p.categoria}</span>${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ''}
        <h3>${p.nome}</h3><p>${p.descricao}</p>
        <strong>${isService(p) ? 'Sob consulta' : formatBRL(p.preco)}</strong>
        <div class="shop-actions">
          <a class="btn btn-outline" href="produto.html?id=${encodeURIComponent(p.id)}">Ver detalhes</a>
          ${createWhatsAppCTA(p, isService(p) ? 'Quero esse serviço' : 'Quero esse item')}
        </div>
      </div>
    </article>`).join('');

  bindWhatsAppButtons(products);
}

(async function init() {
  try {
    const products = await loadProducts();
    renderFilters(products);
    renderProducts(products);
    if (STORE_CONFIG.WHATSAPP_ONLY_MODE) applyWhatsAppOnlyMode();
  } catch (err) {
    const grid = document.getElementById('product-grid'); if (grid) grid.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
})();
