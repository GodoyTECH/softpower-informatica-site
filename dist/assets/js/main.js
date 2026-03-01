/* ============================================
   SOFT POWER INFORMÁTICA - Main JavaScript
   ============================================ */

// ===== CONFIGURAÇÕES =====
const CONFIG = {
  whatsapp: '5511958882556',
  telefone: '551141837330',
  endereco: 'Av. Inocêncio Serafico, 129 - Carapicuíba/SP',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Av.+Inocêncio+Serafico+129+Carapicuiba+SP'
};

// ===== MENU MOBILE =====
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }

  // ===== SCROLL SUAVE COM OFFSET =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Fechar todos
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
      });
      
      // Abrir clicado
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ===== FILTRO DE ANÚNCIOS =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const adCards = document.querySelectorAll('.ad-card');

  if (filterBtns.length > 0 && adCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Atualizar botões
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Filtrar cards
        adCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== BOTÃO DE COMPRA NOS ANÚNCIOS =====
  async function injectBuyButtonsOnAds() {
    const cards = Array.from(document.querySelectorAll('.ad-card'));
    if (!cards.length) return;

    let products = [];
    try {
      const res = await fetch('data/products.json');
      if (!res.ok) return;
      products = await res.json();
    } catch {
      return;
    }

    const normalize = (v = '') => String(v)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    cards.forEach((card) => {
      const titleEl = card.querySelector('h3');
      const actionsWrap = card.querySelector('.ad-actions') || card.querySelector('.shop-actions') || card;
      if (!titleEl || !actionsWrap) return;

      // evita duplicar
      if (actionsWrap.querySelector('.btn-buy-now')) return;

      const title = normalize(titleEl.textContent || '');
      const match = products.find((p) => {
        const n1 = normalize(p.nome || '');
        return n1.includes(title) || title.includes(n1);
      });

      if (!match) return;

      const buy = document.createElement('a');
      buy.className = 'btn btn-primary btn-buy-now';
      buy.href = `checkout.html?buy=${encodeURIComponent(match.id)}`;
      buy.innerHTML = '<i class="fas fa-bolt"></i> Comprar';

      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'btn btn-outline btn-add-cart';
      add.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
      add.addEventListener('click', () => {
        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('softpower_cart_v1') || '[]'); } catch {}
        const existing = cart.find((i) => i.id === match.id);
        if (existing) existing.quantity += 1;
        else cart.push({ id: match.id, nome: match.nome, preco: Number(match.preco || 0), imagem: match.imagem, quantity: 1 });
        localStorage.setItem('softpower_cart_v1', JSON.stringify(cart));
        alert('Produto adicionado ao carrinho.');
      });

      actionsWrap.appendChild(buy);
      actionsWrap.appendChild(add);
    });
  }

  injectBuyButtonsOnAds();

  // ===== VALIDAÇÃO E ENVIO DE ORÇAMENTO NO WHATSAPP =====
  const budgetForm = document.getElementById('budget-form');

  function normalizeLabel(value) {
    if (!value) return '-';
    return String(value).replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function getBudgetPayload() {
    return {
      nome: document.getElementById('nome')?.value.trim() || '',
      whatsapp: document.getElementById('whatsapp')?.value.trim() || '',
      tipo: document.getElementById('tipo')?.value || '',
      servico: document.getElementById('servico')?.value || '',
      descricao: document.getElementById('descricao')?.value.trim() || '',
      urgencia: document.getElementById('urgencia')?.value || 'normal'
    };
  }

  function validateBudgetPayload(data) {
    const missing = [];
    if (!data.nome) missing.push('Nome');
    if (!data.whatsapp) missing.push('WhatsApp');
    if (!data.tipo) missing.push('Tipo de equipamento');
    if (!data.servico) missing.push('Serviço');
    if (!data.descricao) missing.push('Descrição');

    return missing;
  }

  function buildBudgetMessage(data, compact = false) {
    const lines = [
      'Olá! Vim pelo site da Soft Power Informática.',
      compact ? '' : '',
      `Nome: ${data.nome}`,
      `WhatsApp: ${data.whatsapp}`,
      `Equipamento: ${normalizeLabel(data.tipo)}`,
      `Serviço: ${normalizeLabel(data.servico)}`,
      `Descrição: ${data.descricao}`,
      `Urgência: ${normalizeLabel(data.urgencia)}`,
      'Obrigado!'
    ];

    if (compact) {
      return [
        'Olá! Vim pelo site da Soft Power Informática.',
        `Nome: ${data.nome}`,
        `WhatsApp: ${data.whatsapp}`,
        `Serviço: ${normalizeLabel(data.servico)}`,
        `Resumo: ${data.descricao.slice(0, 140)}${data.descricao.length > 140 ? '...' : ''}`,
        'Obrigado!'
      ].join('\n');
    }

    return lines.filter(Boolean).join('\n');
  }

  function openBudgetWhatsApp(data) {
    const full = buildBudgetMessage(data, false);
    let encoded = encodeURIComponent(full);
    let url = `https://wa.me/${CONFIG.whatsapp}?text=${encoded}`;

    if (url.length > 1800) {
      const compact = buildBudgetMessage(data, true);
      encoded = encodeURIComponent(compact);
      url = `https://wa.me/${CONFIG.whatsapp}?text=${encoded}`;

      const copyText = `${full}\n\n[Mensagem completa para copiar manualmente se necessário]`;
      navigator.clipboard?.writeText(copyText).catch(() => {});
      alert('A descrição ficou muito longa. Abrimos uma versão resumida e copiamos a mensagem completa para sua área de transferência.');
    }

    // Mais confiável em mobile/desktop do que popup
    window.location.href = url;
  }

  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = getBudgetPayload();
      const missing = validateBudgetPayload(payload);

      if (missing.length) {
        alert(`Por favor, preencha os campos obrigatórios: ${missing.join(', ')}.`);
        return;
      }

      openBudgetWhatsApp(payload);
    });

    const whatsappBtn = document.getElementById('whatsapp-submit');
    if (whatsappBtn) {
      whatsappBtn.style.display = 'inline-flex';
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const payload = getBudgetPayload();
        const missing = validateBudgetPayload(payload);

        if (missing.length) {
          alert(`Para enviar no WhatsApp, preencha: ${missing.join(', ')}.`);
          return;
        }

        openBudgetWhatsApp(payload);
      });
    }
  }

  // ===== LOGO TOPO COM FALLBACK =====
  function setupHeaderLogo() {
    document.querySelectorAll('.logo').forEach((logoLink) => {
      if (logoLink.querySelector('.brand-logo')) return;
      const text = logoLink.textContent?.trim() || 'Soft Power';
      logoLink.textContent = '';

      const img = document.createElement('img');
      img.src = 'logo.png';
      img.alt = 'Soft Power Informática';
      img.className = 'brand-logo';
      img.loading = 'eager';
      img.onerror = () => {
        img.remove();
        const fallback = document.createElement('span');
        fallback.className = 'brand-fallback';
        fallback.textContent = text;
        logoLink.appendChild(fallback);
      };
      logoLink.appendChild(img);
    });
  }

  setupHeaderLogo();

  // ===== SLIDER PROMOÇÕES (HOME/LOJA) =====
  async function setupPromoSlider() {
    const sliderRoot = document.getElementById('promo-slider');
    if (!sliderRoot) return;

    let products = [];
    try {
      const res = await fetch('data/products.json');
      if (!res.ok) return;
      products = await res.json();
    } catch {
      return;
    }

    const promos = products.filter((p) => (p.badge || '').toLowerCase().includes('promo') || p.destaque).slice(0, 6);
    if (!promos.length) return;

    let current = 0;
    const viewport = sliderRoot.querySelector('.promo-viewport');
    const dots = sliderRoot.querySelector('.promo-dots');
    const desc = sliderRoot.querySelector('.promo-description');
    const link = sliderRoot.querySelector('.promo-link');

    const render = () => {
      viewport.innerHTML = promos.map((p, i) => `
        <article class="promo-slide ${i === current ? 'active' : ''}">
          <img src="${p.imagem}" alt="${p.nome}">
          <div class="promo-meta">
            <span class="shop-badge">Promo</span>
            <h3>${p.nome}</h3>
            <strong>R$ ${Number(p.preco || 0).toFixed(2).replace('.', ',')}</strong>
          </div>
        </article>
      `).join('');

      dots.innerHTML = promos.map((_, i) => `<button type="button" class="promo-dot ${i === current ? 'active' : ''}" data-dot="${i}"></button>`).join('');
      desc.textContent = promos[current].descricao || '';
      link.href = `produto.html?id=${encodeURIComponent(promos[current].id)}`;
    };

    const next = () => { current = (current + 1) % promos.length; render(); };
    const prev = () => { current = (current - 1 + promos.length) % promos.length; render(); };

    sliderRoot.querySelector('.promo-next')?.addEventListener('click', next);
    sliderRoot.querySelector('.promo-prev')?.addEventListener('click', prev);
    dots.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dot]');
      if (!btn) return;
      current = Number(btn.dataset.dot || 0);
      render();
    });

    let startX = 0;
    viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) < 40) return;
      if (delta < 0) next(); else prev();
    }, { passive: true });

    render();
    setInterval(next, 5000);
  }

  setupPromoSlider();

  // ===== BOTÃO VOLTAR AO TOPO =====
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '↑';
  scrollBtn.className = 'whatsapp-float';
  scrollBtn.style.background = 'var(--primary)';
  scrollBtn.style.bottom = '100px';
  scrollBtn.title = 'Voltar ao topo';
  scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(scrollBtn);

  // Mostrar/ocultar botão ao scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
});

// ===== MONTAR MENSAGEM WHATSAPP =====
function getWhatsAppMessage(tipo, details = '') {
  const baseMsg = `Olá! Vim pelo site da Soft Power Informática.`;
  
  let msg = baseMsg;
  
  if (tipo === 'servico') {
    msg += `\n\nQuero informações sobre: ${details}`;
  } else if (tipo === 'anuncio') {
    msg += `\n\nQuero este anúncio: ${details}`;
  } else if (tipo === 'orcamento') {
    msg += `\n\nQuero orçamento.\n\nDetalhes: ${details}`;
  }
  
  msg += `\n\nDesde já, agradeço!`;
  
  return encodeURIComponent(msg);
}

// ===== LINKS WHATSAPP (auto-config) =====
document.addEventListener('DOMContentLoaded', () => {
  // Todos os links de WhatsApp
  document.querySelectorAll('.whatsapp-link').forEach(link => {
    const text = link.dataset.message || '';
    if (text) {
      link.href = `https://wa.me/${CONFIG.whatsapp}?text=${getWhatsAppMessage(link.dataset.type || 'servico', text)}`;
    }
  });
});
