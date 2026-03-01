import { getCart, getCartTotals, clearCart } from './cart.js';
import { formatBRL } from './products.js';
import { createCheckoutSession, redirectToPayment } from './payments.js';

const STORE_WHATSAPP = '5511958882556';

function buildOrderMessage(cart, customer) {
  const lines = [
    'Olá! Vim pelo site da Soft Power Informática e quero finalizar meu pedido.',
    '',
    '🛒 Itens:'
  ];

  cart.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.nome} | Qtd: ${item.quantity} | Unit: ${formatBRL(item.preco)} | Total: ${formatBRL(item.preco * item.quantity)}`);
  });

  const totals = getCartTotals(cart);
  lines.push('');
  lines.push(`💳 Total do pedido: ${formatBRL(totals.total)}`);
  lines.push('');
  lines.push('👤 Dados do cliente:');
  lines.push(`Nome: ${customer.nome}`);
  lines.push(`WhatsApp: ${customer.whatsapp}`);
  lines.push(`Entrega/Retirada: ${customer.entrega}`);
  if (customer.entrega === 'entrega') lines.push(`Endereço: ${customer.endereco}`);
  if (customer.observacoes) lines.push(`Observações: ${customer.observacoes}`);
  lines.push('');
  lines.push('Obrigado!');

  return lines.join('\n');
}

function validate(customer, cart) {
  if (!cart.length) return 'Seu carrinho está vazio.';
  if (!customer.nome || !customer.whatsapp || !customer.entrega) return 'Preencha nome, WhatsApp e forma de entrega/retirada.';
  if (customer.entrega === 'entrega' && !customer.endereco) return 'Informe o endereço para entrega.';
  return '';
}

function renderOrderSummary() {
  const cart = getCart();
  const el = document.getElementById('checkout-items');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = '<p class="text-muted">Carrinho vazio.</p>';
    return;
  }

  const totals = getCartTotals(cart);
  el.innerHTML = `
    <ul>${cart.map(i => `<li>${i.nome} — ${i.quantity}x (${formatBRL(i.preco * i.quantity)})</li>`).join('')}</ul>
    <p><strong>Total: ${formatBRL(totals.total)}</strong></p>
  `;
}

document.getElementById('finalize-whatsapp')?.addEventListener('click', () => {
  const cart = getCart();
  const customer = {
    nome: document.getElementById('checkout-nome')?.value.trim(),
    whatsapp: document.getElementById('checkout-whatsapp')?.value.trim(),
    entrega: document.getElementById('checkout-entrega')?.value,
    endereco: document.getElementById('checkout-endereco')?.value.trim(),
    observacoes: document.getElementById('checkout-observacoes')?.value.trim()
  };

  const err = validate(customer, cart);
  if (err) {
    alert(err);
    return;
  }

  const message = buildOrderMessage(cart, customer);
  const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
});

document.getElementById('pay-online')?.addEventListener('click', async () => {
  const cart = getCart();
  const customer = {
    nome: document.getElementById('checkout-nome')?.value.trim(),
    whatsapp: document.getElementById('checkout-whatsapp')?.value.trim(),
    entrega: document.getElementById('checkout-entrega')?.value,
    endereco: document.getElementById('checkout-endereco')?.value.trim(),
    observacoes: document.getElementById('checkout-observacoes')?.value.trim()
  };

  const session = await createCheckoutSession(cart, customer);
  if (!session?.url) {
    alert('Pagamento online em breve. Finalize pelo WhatsApp por enquanto.');
    return;
  }

  redirectToPayment(session.url);
});

document.getElementById('checkout-entrega')?.addEventListener('change', (e) => {
  const addressWrap = document.getElementById('checkout-endereco-wrap');
  if (!addressWrap) return;
  addressWrap.style.display = e.target.value === 'entrega' ? 'block' : 'none';
});

document.getElementById('clear-cart')?.addEventListener('click', () => {
  if (!confirm('Limpar carrinho?')) return;
  clearCart();
  renderOrderSummary();
});

renderOrderSummary();
