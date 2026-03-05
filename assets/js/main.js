window.APP_CONFIG = {
  whatsapp: window.VITE_STORE_WHATSAPP_NUMBER || window.APP_CONFIG?.whatsapp || '5511958882556',
  googleReviewUrl: window.APP_CONFIG?.googleReviewUrl || '',
  supabaseUrl: window.APP_CONFIG?.supabaseUrl || '',
  supabaseAnonKey: window.APP_CONFIG?.supabaseAnonKey || '',
  WHATSAPP_ONLY_MODE: true,
  HIDE_LOJA_PAGE: true,
  HIDE_CARRINHO_PAGE: true
};

const STORE_WHATSAPP_NUMBER = String(window.APP_CONFIG.whatsapp).replace(/\D/g, '');

function buildWhatsAppMessage(item = {}) {
  return [
    'Olá! Vim pelo site da Soft Power Informática.',
    'Tenho interesse neste item:',
    '',
    `• Item: ${item.nome || '-'}`,
    `• Preço: ${item.precoLabel || (item.preco != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.preco || 0)) : 'Sob consulta')}`,
    `• Detalhes: ${item.short_description || item.descricao || '-'}`,
    `• ID: ${item.id || '-'}`,
    `• Link: ${item.url || window.location.href}`,
    '',
    'Pode me passar disponibilidade e formas de pagamento?'
  ].join('\n');
}

function openWhatsApp(message) {
  window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

function hidePageLinks() {
  const hideLoja = !!window.APP_CONFIG.HIDE_LOJA_PAGE;
  const hideCarrinho = !!window.APP_CONFIG.HIDE_CARRINHO_PAGE;

  if (hideLoja) {
    document.querySelectorAll('a[href*="loja.html"]').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('tabindex', '-1');
      el.classList.add('is-whatsapp-only-hidden');
    });
  }

  if (hideCarrinho) {
    document.querySelectorAll('a[href*="carrinho.html"]').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('tabindex', '-1');
      el.classList.add('is-whatsapp-only-hidden');
    });
  }
}

function applyWhatsAppOnlyMode() {
  if (!window.APP_CONFIG.WHATSAPP_ONLY_MODE) return;
  document.querySelectorAll('#pay-online,[data-buy],#buy-now').forEach((el) => {
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('tabindex', '-1');
    el.classList.add('is-whatsapp-only-hidden');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  hidePageLinks();
  applyWhatsAppOnlyMode();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuToggle?.addEventListener('click', () => nav?.classList.toggle('active'));

  const promoWrap = document.getElementById('promo-slider');
  if (promoWrap) {
    const [products, promotionsBase] = await Promise.all([
      fetch('data/products.json').then((r) => r.json()).catch(() => []),
      fetch('data/promotions.json').then((r) => r.json()).catch(() => [])
    ]);
    const promotionsOverride = (() => {
      try { return JSON.parse(localStorage.getItem('softpower_promotions_override_v1') || 'null'); } catch { return null; }
    })();
    const promotions = Array.isArray(promotionsOverride) ? promotionsOverride : promotionsBase;

    const map = new Map(products.map((p) => [p.id, p]));
    const promos = promotions
      .filter((p) => p.is_active)
      .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      .map((promo) => ({ ...promo, item: map.get(promo.item_id) }))
      .filter((promo) => promo.item)
      .slice(0, 6);

    if (promos.length) {
      let index = 0;
      promoWrap.innerHTML = `<div class="promo-track">${promos.map((promo) => {
        const p = promo.item;
        const label = p.tipo === 'servico' ? 'Quero esse serviço' : 'Quero esse item';
        return `<article class="promo-slide" data-item-id="${p.id}"><div class="promo-media"><img src="${p.imagem}" alt="${p.nome}"></div><div><span class="promo-seal">${promo.headline || p.badge || 'Promoção'}</span><h3>${p.nome}</h3><p>${promo.subtext || p.descricao}</p><button class="btn btn-glass promo-whatsapp" data-item-id="${p.id}" data-label="${label}">${label}</button></div></article>`;
      }).join('')}</div><div class="promo-nav"><button class="btn btn-outline" id="promo-prev">◀</button><button class="btn btn-outline" id="promo-next">▶</button></div><div class="promo-dots">${promos.map((_, i) => `<button class="promo-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></button>`).join('')}</div><p class="text-muted" id="promo-description">${promos[0].subtext || promos[0].item.descricao}</p>`;

      promoWrap.querySelectorAll('.promo-whatsapp').forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = map.get(btn.dataset.itemId);
          if (!p) return;
          openWhatsApp(buildWhatsAppMessage({ ...p, url: `${window.location.origin}/produto.html?id=${encodeURIComponent(p.id)}` }));
        });
      });

      const track = promoWrap.querySelector('.promo-track');
      const dots = [...promoWrap.querySelectorAll('.promo-dot')];
      const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        const active = promos[index];
        promoWrap.querySelector('#promo-description').textContent = active.subtext || active.item.descricao;
      };
      promoWrap.querySelector('#promo-prev').onclick = () => { index = (index - 1 + promos.length) % promos.length; update(); };
      promoWrap.querySelector('#promo-next').onclick = () => { index = (index + 1) % promos.length; update(); };
      dots.forEach((d) => d.onclick = () => { index = Number(d.dataset.dot); update(); });
      setInterval(() => { index = (index + 1) % promos.length; update(); }, 5000);
    }
  }

  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const text = link.dataset.message || '';
    if (text) link.href = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  });

  const budgetForm = document.getElementById('budget-form');
  const normalizeLabel = (v) => (!v ? '-' : String(v).replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  const buildMsg = (d, compact = false) => compact
    ? `Olá! Vim pelo site da Soft Power Informática.\nNome: ${d.nome}\nWhatsApp: ${d.whatsapp}\nServiço: ${normalizeLabel(d.servico)}\nResumo: ${d.descricao.slice(0, 140)}`
    : `Olá! Vim pelo site da Soft Power Informática.\nNome: ${d.nome}\nWhatsApp: ${d.whatsapp}\nEquipamento: ${normalizeLabel(d.tipo)}\nServiço: ${normalizeLabel(d.servico)}\nDescrição: ${d.descricao}\nUrgência: ${normalizeLabel(d.urgencia)}`;

  const openWa = (data) => {
    const full = buildMsg(data, false);
    let url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(full)}`;
    if (url.length > 1800) {
      navigator.clipboard?.writeText(full).catch(() => {});
      url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMsg(data, true))}`;
      alert('Mensagem longa: texto completo copiado para a área de transferência.');
    }
    window.location.href = url;
  };

  budgetForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      nome: document.getElementById('nome')?.value.trim(), whatsapp: document.getElementById('whatsapp')?.value.trim(), tipo: document.getElementById('tipo')?.value,
      servico: document.getElementById('servico')?.value, descricao: document.getElementById('descricao')?.value.trim(), urgencia: document.getElementById('urgencia')?.value || 'normal'
    };
    if (!data.nome || !data.whatsapp || !data.tipo || !data.servico || !data.descricao) return alert('Preencha os campos obrigatórios.');
    openWa(data);
  });
});
