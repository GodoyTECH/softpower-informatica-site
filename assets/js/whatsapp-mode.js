import { STORE_CONFIG, formatPriceBRL } from './store.js';

export function buildWhatsAppMessage(item = {}) {
  const url = item.url || window.location.href;
  return [
    'Olá! Vim pelo site da Soft Power Informática.',
    'Tenho interesse neste item:',
    '',
    `• Item: ${item.nome || item.name || '-'}`,
    `• Preço: ${item.preco != null ? formatPriceBRL(item.preco) : (item.precoLabel || 'Sob consulta')}`,
    `• Detalhes: ${item.short_description || item.descricao || '-'}`,
    `• ID: ${item.id || '-'}`,
    `• Link: ${url}`,
    '',
    'Pode me passar disponibilidade e formas de pagamento?'
  ].join('\n');
}

const WA_CART_KEY = 'softpower_whatsapp_cart_v1';

export function openWhatsApp(message) {
  const link = `https://wa.me/${STORE_CONFIG.STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(link, '_blank', 'noopener');
}

export function getWhatsAppCart() {
  try { return JSON.parse(localStorage.getItem(WA_CART_KEY) || '[]'); } catch { return []; }
}

export function clearWhatsAppCart() {
  localStorage.removeItem(WA_CART_KEY);
}

export function addItemToWhatsAppCart(item) {
  const cart = getWhatsAppCart();
  const found = cart.find((c) => c.id === item.id);
  if (found) found.quantity += 1;
  else cart.push({
    id: item.id,
    nome: item.nome,
    preco: item.preco,
    descricao: item.short_description || item.descricao || '-',
    url: item.url || window.location.href,
    quantity: 1
  });
  localStorage.setItem(WA_CART_KEY, JSON.stringify(cart));
  return cart;
}

export function buildWhatsAppCartMessage(cart = []) {
  const lines = [
    'Olá! Vim pelo site da Soft Power Informática.',
    'Tenho interesse nestes itens:',
    ''
  ];

  cart.forEach((item, idx) => {
    lines.push(`${idx + 1}) ${item.nome}`);
    lines.push(`• Qtd: ${item.quantity}`);
    lines.push(`• Preço: ${item.preco != null ? formatPriceBRL(item.preco) : 'Sob consulta'}`);
    lines.push(`• Detalhes: ${item.descricao || '-'}`);
    lines.push(`• ID: ${item.id || '-'}`);
    lines.push(`• Link: ${item.url || '-'}`);
    lines.push('');
  });

  lines.push('Pode me passar disponibilidade e formas de pagamento?');
  return lines.join('\n');
}

export function createWhatsAppCTA(item, label) {
  return `<button class="btn btn-primary js-whatsapp-item" data-item-id="${item.id}" aria-label="${label}">${label}</button>`;
}

export function applyWhatsAppOnlyMode() {
  if (!STORE_CONFIG.WHATSAPP_ONLY_MODE) return;

  const selectors = [
    'a[href*="carrinho.html"]',
    'a[href*="checkout.html"]',
    '#go-checkout',
    '#pay-online',
    '[data-add]',
    '[data-buy]',
    '#add-to-cart',
    '#buy-now'
  ];

  document.querySelectorAll(selectors.join(',')).forEach((el) => {
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('tabindex', '-1');
    el.classList.add('is-whatsapp-only-hidden');
    if ('disabled' in el) el.disabled = true;
    el.addEventListener('click', (ev) => ev.preventDefault(), true);
    el.addEventListener('keydown', (ev) => ev.preventDefault(), true);
  });
}

export function renderWhatsappOnlyNotice(container) {
  if (!STORE_CONFIG.WHATSAPP_ONLY_MODE || !container) return;
  container.innerHTML = `
    <div class="card" style="padding:24px; text-align:center; margin: 16px 0;">
      <h2>Compras online em breve</h2>
      <p>Faça seu pedido direto pelo WhatsApp da Soft Power Informática.</p>
      <a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/${STORE_CONFIG.STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Vim pelo site da Soft Power Informática e quero fazer um pedido.')}">
        Falar no WhatsApp
      </a>
    </div>`;
}
