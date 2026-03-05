import { getCart, getCartTotals, clearCart } from './cart.js';
import { formatBRL } from './products.js';
import { createCheckoutSession, redirectToPayment } from './payments.js';
import { STORE_CONFIG } from './store.js';

const STORE_WHATSAPP = window.APP_CONFIG?.whatsapp || STORE_CONFIG.STORE_WHATSAPP_NUMBER;

function buildOrderMessage(cart, customer) {
    const lines = [
      'Olá! Vim pelo site da Soft Power Informática.',
      'Tenho interesse nestes itens:',
      ''
    ];

    cart.forEach((item, i) => {
      lines.push(`${i + 1}) ${item.nome}`);
      lines.push(`• Qtd: ${item.quantity}`);
      lines.push(`• Preço: ${formatBRL(item.preco)}`);
      lines.push(`• Detalhes: ${item.descricao || '-'}`);
      lines.push(`• ID: ${item.id || '-'}`);
      lines.push(`• Link: ${item.url || '-'}`);
      lines.push('');
    });

    const totals = getCartTotals(cart);
    lines.push(`Total estimado dos itens: ${formatBRL(totals.total)}`);
    lines.push('');
    lines.push('Dados para contato:');
    lines.push(`• Nome: ${customer.nome}`);
    lines.push(`• WhatsApp: ${customer.whatsapp}`);
    lines.push(`• Entrega/Retirada: ${customer.entrega}`);
    if (customer.entrega === 'entrega') lines.push(`• Endereço: ${customer.endereco}`);
    if (customer.observacoes) lines.push(`• Observações: ${customer.observacoes}`);
    lines.push('');
    lines.push('Pode me passar disponibilidade e formas de pagamento?');

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
    el.innerHTML = `<ul>${cart.map(i => `<li>${i.nome} — ${i.quantity}x (${formatBRL(i.preco * i.quantity)})</li>`).join('')}</ul><p><strong>Total: ${formatBRL(totals.total)}</strong></p>`;
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
    if (err) return alert(err);

    const message = buildOrderMessage(cart, customer);
    const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
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
    if (!session?.url && !session?.pix_qr) {
      alert('Pagamento online indisponível no momento. Finalize pelo WhatsApp por enquanto.');
      return;
    }
    if (session?.pix_qr) {
      const pixWrap = document.getElementById('pix-result');
      if (pixWrap) pixWrap.innerHTML = `<p><strong>PIX Copia e Cola:</strong></p><textarea readonly style="width:100%;min-height:90px">${session.pix_qr}</textarea>`;
    }
    if (session?.url) redirectToPayment(session.url);
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
