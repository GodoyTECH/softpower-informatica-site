import { loadProducts, formatBRL, getCategoryList } from './products.js';
import { addToCart, getCart } from './cart.js';

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    q: (params.get('q') || '').trim().toLowerCase(),
    category: (params.get('categoria') || '').trim()
  };
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  const totalItems = getCart().reduce((acc, item) => acc + Number(item.quantity), 0);
  countEl.textContent = String(totalItems);
}

function renderFilters(products) {
  const wrap = document.getElementById('category-filters');
  if (!wrap) return;
  const categories = getCategoryList(products);
  const current = getParams().category;

  wrap.innerHTML = '';

  const allBtn = document.createElement('a');
  allBtn.href = 'loja.html';
  allBtn.className = `filter-chip ${!current ? 'active' : ''}`;
  allBtn.textContent = 'Todos';
  wrap.appendChild(allBtn);

  categories.forEach((cat) => {
    const a = document.createElement('a');
    a.href = `loja.html?categoria=${encodeURIComponent(cat)}`;
    a.className = `filter-chip ${current === cat ? 'active' : ''}`;
    a.textContent = cat;
    wrap.appendChild(a);
  });
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const { q, category } = getParams();
  const filtered = products.filter((p) => {
    const matchesCategory = !category || p.categoria === category;
    const matchesSearch = !q || `${p.nome} ${p.descricao} ${p.categoria}`.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  document.getElementById('results-count').textContent = `${filtered.length} item(ns)`;

  if (!filtered.length) {
    grid.innerHTML = '<p class="text-muted">Nenhum produto encontrado para esse filtro.</p>';
    return;
  }

  grid.innerHTML = filtered.map((p) => `
    <article class="shop-card">
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      <div class="shop-body">
        <span class="shop-cat">${p.categoria}</span>
        ${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ''}
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <strong>${formatBRL(p.preco)}</strong>
        <div class="shop-actions">
          <a class="btn btn-primary" href="checkout.html?buy=${encodeURIComponent(p.id)}">Comprar</a>
          <button class="btn btn-outline" data-add="${p.id}">Adicionar ao carrinho</button>
          <a class="btn btn-outline" href="produto.html?id=${encodeURIComponent(p.id)}">Detalhes</a>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = products.find((p) => p.id === btn.dataset.add);
      if (!product) return;
      addToCart(product, 1);
      updateCartCount();
      alert('Produto adicionado ao carrinho.');
    });
  });
}

async function init() {
  try {
    const products = await loadProducts();
    renderFilters(products);
    renderProducts(products);
    updateCartCount();
  } catch (err) {
    const grid = document.getElementById('product-grid');
    if (grid) grid.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
}

init();
