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
      }, 1000); // tempo da transição
    } else {
      // Garante que mesmo sem intro, o conteúdo aparece
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
});



  // Campo de busca
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value;
      console.log('Termo pesquisado:', searchTerm);
    });
  }

  const menuBtn = document.querySelector('.menu-btn');
  const sideMenu = document.getElementById('sideMenu');
  const closeBtn = document.getElementById('closeMenuBtn');

  menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('active');
  });
  closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('active');
  });

  // Opcional: fechar o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (sideMenu.classList.contains('active') && !sideMenu.contains(e.target) && e.target !== menuBtn) {
      sideMenu.classList.remove('active');
    }
  }); 
  // Carrossel automático (corrigido)
const carrosseis = document.querySelectorAll('.banner-carrossel');

carrosseis.forEach((banners) => {
  setInterval(() => {
    banners.scrollBy({ left: 200, behavior: 'smooth' });

    // Rolagem circular (opcional)
    if (banners.scrollLeft + banners.clientWidth >= banners.scrollWidth) {
      banners.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, 4000);
});

  
  