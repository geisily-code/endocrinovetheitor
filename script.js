// =====================
// INTERAÇÕES PRINCIPAIS
// =====================
// Este arquivo controla as principais interações da página:
// - comportamento da barra de navegação ao rolar
// - menu mobile
// - efeito parallax leve no herói
// - animações de entrada por seção
// - efeito de tilt nos cards
// - modal de doenças e FAQ
// - envio de formulário via WhatsApp

// Efeito da navbar ao rolar a página
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Menu mobile
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Parallax do herói
const heroPhoto = document.querySelector('.hero-photo');
const heroSection = document.querySelector('.hero');
if (heroPhoto && heroSection) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const heroH = heroSection.offsetHeight;
        if (scrolled < heroH * 1.5) {
          heroPhoto.style.transform = `translateY(${scrolled * 0.18}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Animações de rolagem — aplicadas por seção com efeito em cascata
const animEls = document.querySelectorAll(
  '.hero-text, .hero-photo, .about-photo, .about-content, .service-card, .about-stats, .contact-card, h2, .section-chip, .contact-sub, .testi-card, .faq-item'
);

animEls.forEach((el) => {
  const type = el.classList.contains('hero-photo') || el.classList.contains('about-content') ? 'fade-left'
             : el.classList.contains('about-photo') ? 'fade-right'
             : 'fade-up';
  el.classList.add(type);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // aplica atraso progressivo entre irmãos dentro do mesmo contêiner
      const siblings = [...(e.target.parentElement?.children || [])].filter(
        c => c.classList.contains('fade-up') || c.classList.contains('fade-left') || c.classList.contains('fade-right')
      );
      const idx = siblings.indexOf(e.target);
      e.target.style.transitionDelay = (idx * 0.09) + 's';
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-right, .fade-left').forEach(el => observer.observe(el));

// Efeito de tilt nos cards
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
addTilt('.service-card');
addTilt('.testi-card');

// Dados do modal de doenças
const doencas = {
  diabetes: {
    icon: '🐕',
    nome: 'Diabetes Mellitus',
    desc: 'O diabetes é uma das endocrinopatias mais comuns em cães e gatos. Ocorre quando o pâncreas não produz insulina suficiente (tipo I) ou quando o organismo não responde adequadamente a ela (tipo II, mais comum em gatos). Com o tratamento correto, o animal pode ter uma vida plena e de qualidade.',
    sinais: ['Sede e urina em excesso', 'Perda de peso mesmo comendo bem', 'Fraqueza nos membros posteriores (gatos)', 'Catarata súbita (cães)', 'Falta de energia e apatia']
  },
  hipotireoidismo: {
    icon: '🐈',
    nome: 'Hipotireoidismo',
    desc: 'Condição muito comum em cães, causada pela baixa produção de hormônios pela tireoide. Isso desacelera o metabolismo do animal inteiro. O diagnóstico precoce evita complicações cardíacas, neurológicas e dérmicas. O tratamento é simples e eficaz.',
    sinais: ['Ganho de peso sem aumento de apetite', 'Queda de pelo e pele seca', 'Lentidão e intolerância ao frio', 'Infecções de pele recorrentes', 'Alterações no ciclo reprodutivo']
  },
  hipertireoidismo: {
    icon: '🐕',
    nome: 'Hipertireoidismo',
    desc: 'Frequente em gatos idosos, o hipertireoidismo é causado pela produção excessiva de hormônios tireoidianos. Acelera o metabolismo e sobrecarrega o coração e rins. É uma das doenças mais tratáveis da medicina felina quando diagnosticada a tempo.',
    sinais: ['Perda de peso com apetite aumentado', 'Agitação e vocalização excessiva', 'Vômitos e diarreia frequentes', 'Sede e urina aumentadas', 'Pelo áspero e descuidado']
  },
  cushing: {
    icon: '🐈',
    nome: 'Síndrome de Cushing',
    desc: 'O hipercortisolismo (Cushing) é causado pelo excesso de cortisol no organismo, seja por uma alteração na hipófise, nas adrenais ou pelo uso prolongado de corticoides. É mais frequente em cães de meia-idade a idosos e exige diagnóstico específico para o tratamento correto.',
    sinais: ['Barriga distendida ("barriga de sapo")', 'Queda de pelo simétrica', 'Sede e apetite excessivos', 'Pele fina com manchas escuras', 'Fraqueza muscular e letargia']
  },
  addison: {
    icon: '🐕',
    nome: 'Doença de Addison',
    desc: 'O hipoadrenocorticismo (Addison) é o oposto do Cushing: as glândulas adrenais produzem hormônios insuficientes. Pode se manifestar de forma crônica ou em crises agudas (colapso adrenal), que são emergências. Com o tratamento adequado, o animal leva uma vida completamente normal.',
    sinais: ['Episódios de fraqueza e colapso', 'Vômitos e diarreia intermitentes', 'Perda de peso e apetite', 'Tremores e dor abdominal', 'Letargia progressiva']
  },
  obesidade: {
    icon: '🐈',
    nome: 'Obesidade Endócrina',
    desc: 'Quando o excesso de peso tem origem hormonal, simplesmente reduzir a alimentação não resolve. O hipotireoidismo, o hiperinsulinismo e outras condições metabólicas são causas frequentes de obesidade refratária. É essencial tratar a causa raiz para resultados duradouros.',
    sinais: ['Dificuldade de perder peso mesmo com dieta', 'Apatia e cansaço fácil', 'Intolerância ao exercício', 'Queda de pelo associada', 'Histórico de uso de corticoides']
  },
  reprodutivos: {
    icon: '🐕',
    nome: 'Distúrbios Reprodutivos',
    desc: 'Alterações hormonais podem afetar diretamente o sistema reprodutivo. A piómetra (infecção uterina), os cistos ovarianos e a hiperplasia prostática benigna são exemplos de condições ligadas a desequilíbrios hormonais — tratáveis com abordagem endocrinológica integrada.',
    sinais: ['Ciclos irregulares ou ausentes', 'Corrimento vaginal fora do cio', 'Aumento do abdômen em fêmeas', 'Dificuldade de urinar em machos', 'Comportamento alterado no cio']
  },
  acromegalia: {
    icon: '🐈',
    nome: 'Acromegalia',
    desc: 'Causada pelo excesso de hormônio do crescimento (GH), a acromegalia é mais comum em gatos e frequentemente associada ao diabetes resistente à insulina. Em cães, costuma estar ligada ao uso de progestagênios. O diagnóstico correto muda completamente a abordagem terapêutica.',
    sinais: ['Diabetes de difícil controle (gatos)', 'Aumento das estruturas faciais', 'Crescimento exagerado das patas', 'Respiração ruidosa', 'Ganho de peso e aumento corporal']
  },
  hiperaldo: {
    icon: '🐕',
    nome: 'Hiperaldosteronismo',
    desc: 'O excesso de aldosterona, hormônio produzido pelas adrenais, causa perda de potássio e retenção de sódio. Em gatos é frequentemente causado por tumor adrenal. Manifesta-se com fraqueza muscular grave e hipertensão, e responde bem ao tratamento quando diagnosticado adequadamente.',
    sinais: ['Fraqueza muscular severa', 'Pescoço dobrado para baixo (gatos)', 'Pressão arterial elevada', 'Alterações oculares por hipertensão', 'Sede e urina aumentadas']
  },
  feocromocitoma: {
    icon: '🐈',
    nome: 'Feocromocitoma',
    desc: 'Tumor da medula adrenal que secreta catecolaminas (adrenalina e noradrenalina) em excesso. Causa picos de pressão arterial, taquicardia e episódios agudos de crise. É mais raro, mas exige investigação quando o animal apresenta hipertensão de causa indeterminada.',
    sinais: ['Crises de agitação intensa', 'Pressão arterial muito elevada', 'Frequência cardíaca acelerada', 'Episódios de fraqueza ou síncope', 'Hemorragia ocular por hipertensão']
  }
};

const modal       = document.getElementById('doenca-modal');
const modalTitle  = document.getElementById('modal-title');
const modalDesc   = document.getElementById('modal-desc');
const modalIcon   = document.getElementById('modal-icon');
const modalSigns  = document.getElementById('modal-signs-list');
const modalClose  = document.getElementById('modal-close');
const backdrop    = document.getElementById('modal-backdrop');

// Abre um modal com os detalhes da doença selecionada
function openModal(key) {
  const d = doencas[key];
  if (!d) return;
  modalIcon.textContent  = d.icon;
  modalTitle.textContent = d.nome;
  modalDesc.textContent  = d.desc;
  modalSigns.innerHTML   = d.sinais.map(s => `<li>${s}</li>`).join('');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('.tag[data-doenca]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.doenca));
});

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
// Dados do FAQ
const faqData = {
  animais: {
    icon: '🐾',
    pergunta: 'Quais animais o Dr. Heitor atende?',
    resposta: 'O atendimento é voltado para cães e gatos com suspeita ou diagnóstico de doenças hormonais e metabólicas. Casos de outras espécies podem ser avaliados individualmente mediante consulta prévia.'
  },
  especialista: {
    icon: '🩺',
    pergunta: 'O que faz um veterinário endocrinologista?',
    resposta: 'É o especialista responsável por diagnosticar e tratar doenças do sistema hormonal dos animais, como diabetes, hipotireoidismo, síndrome de Cushing, doença de Addison e obesidade endócrina. Atua com exames específicos, interpretação hormonal e planos terapêuticos individualizados.'
  },
  sinais: {
    icon: '🔍',
    pergunta: 'Como sei se meu pet precisa de um endocrinologista?',
    resposta: 'Sinais como sede excessiva, urina frequente, aumento ou perda de peso sem causa aparente, queda de pelo, barriga distendida ou cansaço excessivo são indicativos. O ideal é consultar um endocrinologista veterinário para investigar a causa hormonal antes que o quadro evolua.'
  },
  diabetes: {
    icon: '💉',
    pergunta: 'Vocês acompanham casos de diabetes e insulina?',
    resposta: 'Sim. O acompanhamento de cães e gatos diabéticos é um dos principais focos do consultório — incluindo curvas glicêmicas domiciliares, ajuste de dose de insulina, orientação sobre alimentação e monitoramento contínuo para garantir qualidade de vida ao pet.'
  },
  local: {
    icon: '📍',
    pergunta: 'Onde é feito o atendimento?',
    resposta: '100% domiciliar. O Dr. Heitor vai até a sua casa em Santos, São Vicente, Praia Grande, Guarujá ou Cubatão. Sem clínica, sem sala de espera — o atendimento acontece no ambiente em que seu pet se sente mais seguro e confortável.'
  },
  agendar: {
    icon: '📅',
    pergunta: 'Como faço para agendar?',
    resposta: 'Entre em contato pelo WhatsApp. O agendamento é feito diretamente, de forma rápida e simples, com confirmação de data, horário e endereço. Basta clicar no botão abaixo e enviar uma mensagem.'
  }
};

// Accordion: fechar outros itens ao abrir um
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-item[open]').forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    }
  });
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Formulário WhatsApp
function sendToWhatsApp(e) {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const pet  = document.getElementById('cf-pet').value.trim();
  const msg  = document.getElementById('cf-msg').value.trim();
  const text = `Olá, Dr. Heitor! Sou ${name}${pet ? `, tutor(a) de ${pet}` : ''}.\n\n${msg}`;
  window.open(`https://api.whatsapp.com/send/?phone=%2B5513988156002&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`, '_blank');
}

// Rolagem suave para âncoras, compensando a navbar fixa
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
///////////////////