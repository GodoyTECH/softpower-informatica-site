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

export function openWhatsApp(message) {
  const link = `https://wa.me/${STORE_CONFIG.STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(link, '_blank', 'noopener');
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
