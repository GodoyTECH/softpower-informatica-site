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

  // ===== VALIDAÇÃO DE FORMULÁRIO =====
  const budgetForm = document.getElementById('budget-form');
  
  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validar campos
      const nome = document.getElementById('nome').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const servico = document.getElementById('servico').value;
      const descricao = document.getElementById('descricao').value.trim();
      
      if (!nome || !whatsapp || !servico || !descricao) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
      }
      
      // Mostrar botão de WhatsApp
      const whatsappBtn = document.getElementById('whatsapp-submit');
      if (whatsappBtn) {
        const mensagem = `Olá! Vim pelo site da Soft Power Informática.\n\nQuero orçamento para: ${servico}\n\nDetalhes: ${descricao}\n\nMeu nome: ${nome}\nWhatsApp: ${whatsapp}`;
        const encodedMsg = encodeURIComponent(mensagem);
        whatsappBtn.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodedMsg}`;
        whatsappBtn.style.display = 'inline-flex';
        document.getElementById('form-submit').style.display = 'none';
        alert('Formulário validado! Clique no botão do WhatsApp para enviar.');
      }
    });
  }

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
