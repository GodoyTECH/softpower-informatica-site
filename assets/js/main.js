window.APP_CONFIG = {
  whatsapp: window.APP_CONFIG?.whatsapp || '5511958882556',
  googleReviewUrl: window.APP_CONFIG?.googleReviewUrl || '',
  supabaseUrl: window.APP_CONFIG?.supabaseUrl || '',
  supabaseAnonKey: window.APP_CONFIG?.supabaseAnonKey || ''
};

document.addEventListener('DOMContentLoaded', async () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuToggle?.addEventListener('click', () => nav?.classList.toggle('active'));

  const logo = document.querySelector('.logo');
  if (logo) {
    const img = new Image();
    img.src = 'logo.png';
    img.alt = 'Soft Power Informática';
    img.className = 'logo-img';
    img.onerror = () => { logo.innerHTML = '<span class="logo-fallback"><i class="fas fa-microchip"></i> SOFT POWER</span>'; };
    img.onload = () => { logo.innerHTML = ''; logo.appendChild(img); };
  }

  const promoWrap = document.getElementById('promo-slider');
  if (promoWrap) {
    const products = await fetch('data/products.json').then((r) => r.json()).catch(() => []);
    const promos = products.filter((p) => (p.badge || '').toLowerCase().includes('promo') || p.destaque).slice(0, 6);
    if (promos.length) {
      let index = 0;
      promoWrap.innerHTML = `<div class="promo-track">${promos.map((p) => `<article class="promo-slide"><div class="promo-media"><img src="${p.imagem}" alt="${p.nome}"></div><div><span class="promo-seal">Promo</span><h3>${p.nome}</h3><p>${p.descricao}</p><a class="btn btn-glass" href="produto.html?id=${encodeURIComponent(p.id)}">Ver este item</a></div></article>`).join('')}</div><div class="promo-nav"><button class="btn btn-outline" id="promo-prev">◀</button><button class="btn btn-outline" id="promo-next">▶</button></div><div class="promo-dots">${promos.map((_, i) => `<button class="promo-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></button>`).join('')}</div><p class="text-muted" id="promo-description">${promos[0].descricao}</p>`;
      const track = promoWrap.querySelector('.promo-track');
      const dots = [...promoWrap.querySelectorAll('.promo-dot')];
      const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        promoWrap.querySelector('#promo-description').textContent = promos[index].descricao;
      };
      promoWrap.querySelector('#promo-prev').onclick = () => { index = (index - 1 + promos.length) % promos.length; update(); };
      promoWrap.querySelector('#promo-next').onclick = () => { index = (index + 1) % promos.length; update(); };
      dots.forEach((d) => d.onclick = () => { index = Number(d.dataset.dot); update(); });
      setInterval(() => { index = (index + 1) % promos.length; update(); }, 5000);
    }
  }

  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const text = link.dataset.message || '';
    if (text) link.href = `https://wa.me/${window.APP_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  });

  const budgetForm = document.getElementById('budget-form');
  const normalizeLabel = (v) => (!v ? '-' : String(v).replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  const buildMsg = (d, compact = false) => compact
    ? `Olá! Vim pelo site da Soft Power Informática.\nNome: ${d.nome}\nWhatsApp: ${d.whatsapp}\nServiço: ${normalizeLabel(d.servico)}\nResumo: ${d.descricao.slice(0, 140)}`
    : `Olá! Vim pelo site da Soft Power Informática.\nNome: ${d.nome}\nWhatsApp: ${d.whatsapp}\nEquipamento: ${normalizeLabel(d.tipo)}\nServiço: ${normalizeLabel(d.servico)}\nDescrição: ${d.descricao}\nUrgência: ${normalizeLabel(d.urgencia)}`;

  const openWa = (data) => {
    const full = buildMsg(data, false);
    let url = `https://wa.me/${window.APP_CONFIG.whatsapp}?text=${encodeURIComponent(full)}`;
    if (url.length > 1800) {
      navigator.clipboard?.writeText(full).catch(() => {});
      url = `https://wa.me/${window.APP_CONFIG.whatsapp}?text=${encodeURIComponent(buildMsg(data, true))}`;
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
