function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const introOverlay = document.getElementById('intro-overlay');
  const mainContent = document.getElementById('main-content');
  const duration = 8000;
  
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:";
  const vindoDeFora = !isLocal && (document.referrer === '' || !document.referrer.includes(location.hostname));
  
  function mostrarConteudo() {
    if (introOverlay) {
      introOverlay.style.opacity = '0';
      setTimeout(() => {
        introOverlay.style.display = 'none';
        if (mainContent) {
          mainContent.classList.add('visible');
        }
        document.body.style.overflow = 'auto';
      }, 1000);
    } else {
      if (mainContent) {
        mainContent.classList.add('visible');
        document.body.style.overflow = 'auto';
      }
    }
  }
  
  if (vindoDeFora) {
    setTimeout(mostrarConteudo, duration);
  } else {
    mostrarConteudo();
  }
  
  // Menu lateral
  const menuBtn = document.querySelector('.menu-btn');
  const sideMenu = document.getElementById('sideMenu');
  const closeBtn = document.getElementById('closeMenuBtn');
  
  if (menuBtn && sideMenu && closeBtn) {
    menuBtn.addEventListener('click', () => {
      sideMenu.classList.add('active');
    });
    closeBtn.addEventListener('click', () => {
      sideMenu.classList.remove('active');
    });
    
    // Fechar o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
      if (sideMenu.classList.contains('active') && !sideMenu.contains(e.target) && e.target !== menuBtn) {
        sideMenu.classList.remove('active');
      }
    });
  }
  
  // === SISTEMA DE BUSCA COM SUGESTÕES ===
  const suggestedProducts = [
  { name: 'Café Tradicional 3 Corações', category: 'Alimentos', img: '../img/Produto 1.png' },
  { name: 'Açúcar Refinado União', category: 'Alimentos', img: '../img/Produto 2.png' },
  { name: 'Arroz Branco Prato Fino', category: 'Alimentos', img: '../img/Produto 3.png' }
];
  
  const searchInput = document.getElementById('searchInput');
  const suggestionsContainer = document.getElementById('suggestionsContainer');
  const suggestionsList = document.getElementById('suggestionsList');
  
  if (searchInput && suggestionsContainer && suggestionsList) {
    // Renderizar sugestões
    function renderSuggestions() {
      suggestionsList.innerHTML = '';
      
      suggestedProducts.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="suggestion-img">
    <div class="suggestion-content">
      <div class="suggestion-name">${product.name}</div>
      <div class="suggestion-category">${product.category}</div>
    </div>
        `;
        suggestionItem.addEventListener('click', () => {
          searchInput.value = product.name;
          hideSuggestions();
        });
        
        suggestionsList.appendChild(suggestionItem);
      });
    }
    
    // Mostrar sugestões
    function showSuggestions() {
      if (searchInput.value === '') {
        renderSuggestions();
        suggestionsContainer.classList.add('show');
      }
    }
    
    // Esconder sugestões
    function hideSuggestions() {
      suggestionsContainer.classList.remove('show');
    }
    
    // Event listeners
    searchInput.addEventListener('focus', showSuggestions);
    
    searchInput.addEventListener('input', () => {
      if (searchInput.value === '') {
        showSuggestions();
      } else {
        hideSuggestions();
      }
    });
    
    // Fechar sugestões ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar') && !e.target.closest('.suggestions-container')) {
        hideSuggestions();
      }
    });
  }
  
  // Carrossel automático
  const carrosseis = document.querySelectorAll('.banner-carrossel');
  carrosseis.forEach((banners) => {
    setInterval(() => {
      banners.scrollBy({ left: 200, behavior: 'smooth' });
      
      if (banners.scrollLeft + banners.clientWidth >= banners.scrollWidth) {
        banners.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 4000);
  });
  
  // Modal do carrinho
  const modal = document.getElementById("modal-carrinho");
  const abrirCarrinho = document.querySelector(".abrir-carrinho");
  const btnVoltar = document.getElementById("btn-voltar");
  const btnComparar = document.getElementById("btn-comparar");
  
  if (abrirCarrinho && modal) {
    abrirCarrinho.addEventListener("click", () => {
      modal.classList.add("mostrar");
      document.body.style.overflow = "hidden";
    });
  }
  
  if (btnVoltar && modal) {
    btnVoltar.addEventListener("click", () => {
      modal.classList.remove("mostrar");
      document.body.style.overflow = "auto";
    });
  }
  
  if (btnComparar) {
    btnComparar.addEventListener("click", () => {
      window.location.href = "comparar.html";
    });
  }
});