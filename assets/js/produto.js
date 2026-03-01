import { loadProducts, formatBRL, getProductById } from './products.js';
import { addToCart, getCart } from './cart.js';

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
            <button class="btn btn-primary" id="add-to-cart">Adicionar ao carrinho</button>
            <a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/5511958882556?text=${encodeURIComponent('Olá! Vim pelo site da Soft Power Informática e quero este produto: ' + p.nome)}">WhatsApp</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('add-to-cart').addEventListener('click', () => {
      addToCart(p, 1);
      updateCartCount();
      alert('Produto adicionado ao carrinho.');
    });

    updateCartCount();
  } catch (err) {
    wrap.innerHTML = `<p class="text-muted">${err.message}</p>`;
  }
}

init();
