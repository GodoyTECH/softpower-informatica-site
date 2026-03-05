import { getCart, updateItemQuantity, removeFromCart, getCartTotals } from './cart.js';
import { formatBRL } from './products.js';

if (window.APP_CONFIG?.HIDE_CARRINHO_PAGE) {
  const main = document.querySelector('main, .container, body');
  if (main) {
    main.innerHTML = `<div class="card" style="padding:24px; text-align:center; margin:16px;"><h1>Carrinho temporariamente indisponível</h1><p class="text-muted">Para pedidos, fale direto com a Soft Power no WhatsApp.</p><a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/${(window.APP_CONFIG?.whatsapp || '5511958882556').replace(/\D/g,'')}?text=${encodeURIComponent('Olá! Vim pelo site da Soft Power Informática e quero fazer um pedido.')}">Falar no WhatsApp</a></div>`;
  }
} else {
  function render() {
    const cart = getCart();
    const tbody = document.getElementById('cart-rows');
    const summary = document.getElementById('cart-summary');
    if (!tbody || !summary) return;

    if (!cart.length) {
      tbody.innerHTML = '<tr><td colspan="5">Seu carrinho está vazio.</td></tr>';
      summary.innerHTML = `<strong>Total: ${formatBRL(0)}</strong>`;
      return;
    }

    tbody.innerHTML = cart.map((item) => `
      <tr>
        <td>${item.nome}</td>
        <td>${formatBRL(item.preco)}</td>
        <td><input type="number" min="1" value="${item.quantity}" data-qty="${item.id}" style="width:80px"></td>
        <td>${formatBRL(item.preco * item.quantity)}</td>
        <td><button class="btn btn-outline" data-remove="${item.id}">Remover</button></td>
      </tr>
    `).join('');

    const totals = getCartTotals(cart);
    summary.innerHTML = `<strong>Subtotal: ${formatBRL(totals.subtotal)} | Total: ${formatBRL(totals.total)}</strong>`;

    tbody.querySelectorAll('[data-qty]').forEach((input) => {
      input.addEventListener('change', () => {
        updateItemQuantity(input.dataset.qty, Number(input.value || 1));
        render();
      });
    });

    tbody.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.remove);
        render();
      });
    });
  }

  document.getElementById('go-checkout')?.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });

  render();
}
