import { loadProducts, formatBRL, getCategoryList } from './products.js';
import { addToCart, getCart } from './cart.js';
import { STORE_CONFIG } from './store.js';
import { applyWhatsAppOnlyMode, openWhatsApp, createWhatsAppCTA, addItemToWhatsAppCart, buildWhatsAppCartMessage, clearWhatsAppCart, getWhatsAppCartCount } from './whatsapp-mode.js';

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

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  countEl.textContent = String(getCart().reduce((acc, item) => acc + Number(item.quantity), 0));
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
      updateSelectionUi();
      openWhatsApp(buildWhatsAppCartMessage(cart));
    });
  });

  document.querySelectorAll('[data-add-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = products.find((p) => p.id === btn.dataset.addCart);
      if (!product) return;
      addToCart({ ...product, url: `${window.location.origin}/produto.html?id=${encodeURIComponent(product.id)}` }, 1);
      updateCartCount();
      alert('Item adicionado ao carrinho.');
    });
  });
}

function updateSelectionUi() {
  const count = getWhatsAppCartCount();
  const el = document.getElementById('wa-selected-count');
  if (el) el.textContent = `${count} selecionado(s)`;
}

function bindSelectionControls() {
  const clearBtn = document.getElementById('wa-clear-selection');
  clearBtn?.addEventListener('click', () => {
    clearWhatsAppCart();
    updateSelectionUi();
    alert('Seleção de itens limpa.');
  });
  updateSelectionUi();
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
          <button class="btn btn-outline" data-add-cart="${p.id}">Adicionar ao carrinho</button>
        </div>
      </div>
    </article>`).join('');

  bindWhatsAppButtons(products);
}

(async function init() {
  try {
    if (window.APP_CONFIG?.HIDE_LOJA_PAGE) {
      const container = document.querySelector('.container');
      if (container) {
        container.innerHTML = `<div class="card" style="padding:24px; text-align:center;"><h1>Loja temporariamente indisponível</h1><p class="text-muted">No momento, os pedidos estão sendo feitos diretamente pelo WhatsApp.</p><a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/${STORE_CONFIG.STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Soft Power Informática e quero atendimento.')}">Falar no WhatsApp</a></div>`;
      }
      return;
    }

    const products = await loadProducts();
    renderFilters(products);
    renderProducts(products);
    bindSelectionControls();
    updateCartCount();
    if (STORE_CONFIG.WHATSAPP_ONLY_MODE) applyWhatsAppOnlyMode();
  } catch (err) {
    const grid = document.getElementById('product-grid'); if (grid) grid.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
})();
