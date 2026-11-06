// ===== SAMURAI SUSHI - MAIN.JS =====

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadMenu();
  initScrollAnimations();
  initHeaderScroll();
});

// ===== NAVEGAÇÃO MOBILE =====
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Fecha menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// ===== HEADER SCROLL =====
function initHeaderScroll() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ===== CARREGAR CARDÁPIO =====
async function loadMenu() {
  const menuContainer = document.getElementById('menu-content');
  
  if (!menuContainer) return;

  // Mostrar loading
  menuContainer.innerHTML = '<div class="loading"></div>';

  try {
    const response = await fetch('menu.json');
    const data = await response.json();
    
    renderMenu(data.categorias);
    renderCategoryNav(data.categorias);
    
  } catch (error) {
    console.error('Erro ao carregar cardápio:', error);
    menuContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: var(--color-gray);">
        <p>Erro ao carregar o cardápio. Tente novamente mais tarde.</p>
      </div>
    `;
  }
}

// ===== RENDERIZAR NAVEGAÇÃO DE CATEGORIAS =====
function renderCategoryNav(categorias) {
  const navContainer = document.getElementById('category-nav');
  
  if (!navContainer) return;

  // Botão "Todos"
  let html = `
    <button class="category-btn active" data-category="all">
      🍱 Todos
    </button>
  `;

  categorias.forEach(categoria => {
    html += `
      <button class="category-btn" data-category="${slugify(categoria.nome)}">
        ${categoria.icone} ${categoria.nome}
      </button>
    `;
  });

  navContainer.innerHTML = html;

  // Event listeners para filtrar
  navContainer.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualiza botão ativo
      navContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtra categorias
      const category = btn.dataset.category;
      filterCategories(category);
    });
  });
}

// ===== RENDERIZAR MENU =====
function renderMenu(categorias) {
  const menuContainer = document.getElementById('menu-content');
  
  if (!menuContainer) return;

  let html = '';

  categorias.forEach(categoria => {
    html += `
      <div class="category-section fade-in" data-category="${slugify(categoria.nome)}">
        <h3 class="category-title">
          <span>${categoria.icone}</span>
          ${categoria.nome}
        </h3>
        <div class="menu-grid">
    `;

    categoria.itens.forEach(item => {
      html += `
        <div class="menu-item">
          <div class="menu-item-header">
            <h3>${item.nome}</h3>
            <span class="price">${formatPrice(item.preco)}</span>
          </div>
          <p>${item.descricao}</p>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  menuContainer.innerHTML = html;
  
  // Ativa animações
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);
}

// ===== FILTRAR CATEGORIAS =====
function filterCategories(category) {
  const sections = document.querySelectorAll('.category-section');
  
  sections.forEach(section => {
    if (category === 'all' || section.dataset.category === category) {
      section.style.display = 'block';
      // Reativa animação
      section.classList.remove('visible');
      setTimeout(() => section.classList.add('visible'), 50);
    } else {
      section.style.display = 'none';
    }
  });
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observa elementos com classe fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Observa cards do about
  document.querySelectorAll('.about-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');
    observer.observe(card);
  });
}

// ===== UTILITÁRIOS =====
function formatPrice(price) {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

// ===== SMOOTH SCROLL PARA LINKS ÂNCORA =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
