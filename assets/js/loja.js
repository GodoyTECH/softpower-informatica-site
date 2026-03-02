import { loadProducts, formatBRL, getCategoryList } from './products.js';
import { addToCart, getCart, saveCart } from './cart.js';

const STORE_WHATSAPP = window.APP_CONFIG?.whatsapp || '5511958882556';

function isService(p) { return p.tipo === 'servico'; }

function buyNow(product) {
  saveCart([{ id: product.id, nome: product.nome, preco: Number(product.preco || 0), imagem: product.imagem, quantity: 1 }]);
  window.location.href = 'checkout.html?from=buy-now';
}

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return { q: (params.get('q') || '').trim().toLowerCase(), category: (params.get('categoria') || '').trim() };
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  countEl.textContent = String(getCart().reduce((acc, item) => acc + Number(item.quantity), 0));
}

function renderFilters(products) {
  const wrap = document.getElementById('category-filters'); if (!wrap) return;
  const categories = getCategoryList(products); const current = getParams().category; wrap.innerHTML = '';
  const allBtn = document.createElement('a'); allBtn.href = 'loja.html'; allBtn.className = `filter-chip ${!current ? 'active' : ''}`; allBtn.textContent = 'Todos'; wrap.appendChild(allBtn);
  categories.forEach((cat) => { const a = document.createElement('a'); a.href = `loja.html?categoria=${encodeURIComponent(cat)}`; a.className = `filter-chip ${current === cat ? 'active' : ''}`; a.textContent = cat; wrap.appendChild(a); });
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid'); if (!grid) return;
  const { q, category } = getParams();
  const filtered = products.filter((p) => (!category || p.categoria === category) && (!q || `${p.nome} ${p.descricao} ${p.categoria}`.toLowerCase().includes(q)));
  document.getElementById('results-count').textContent = `${filtered.length} item(ns)`;
  if (!filtered.length) return (grid.innerHTML = '<p class="text-muted">Nenhum produto encontrado para esse filtro.</p>');

  grid.innerHTML = filtered.map((p) => `
    <article class="shop-card">
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      <div class="shop-body">
        <span class="shop-cat">${p.categoria}</span>${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ''}
        <h3>${p.nome}</h3><p>${p.descricao}</p>
        <strong>${isService(p) ? 'Sob consulta' : formatBRL(p.preco)}</strong>
        <div class="shop-actions">
          <a class="btn btn-outline" href="produto.html?id=${encodeURIComponent(p.id)}">Ver detalhes</a>
          ${isService(p)
            ? `<a class="btn btn-glass" target="_blank" rel="noopener" href="https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent('Olá! Quero informações sobre o serviço: ' + p.nome)}">Solicitar serviço</a>`
            : `<button class="btn btn-glass" data-buy="${p.id}">Comprar</button><button class="btn btn-primary" data-add="${p.id}">Adicionar ao carrinho</button>`}
        </div>
      </div>
    </article>`).join('');

  grid.querySelectorAll('[data-add]').forEach((btn) => btn.addEventListener('click', () => { const product = products.find((p) => p.id === btn.dataset.add); if (!product) return; addToCart(product, 1); updateCartCount(); alert('Produto adicionado ao carrinho.'); }));
  grid.querySelectorAll('[data-buy]').forEach((btn) => btn.addEventListener('click', () => { const product = products.find((p) => p.id === btn.dataset.buy); if (product) buyNow(product); }));
}

(async function init() { try { const products = await loadProducts(); renderFilters(products); renderProducts(products); updateCartCount(); } catch (err) { const grid = document.getElementById('product-grid'); if (grid) grid.innerHTML = `<p class="text-muted">${err.message}</p>`; } })();
