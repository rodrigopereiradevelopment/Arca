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
                if (mainContent) mainContent.classList.add('visible');
                document.body.style.overflow = 'auto';
            }, 1000);
        } else {
            if (mainContent) mainContent.classList.add('visible');
            document.body.style.overflow = 'auto';
        }
    }

    if (vindoDeFora) {
        setTimeout(mostrarConteudo, duration);
    } else {
        mostrarConteudo();
    }

    // ==========================================
    // LÓGICA DO MODAL (CORRIGIDA)
    // ==========================================
    const modal = document.getElementById('modalCarrinho');
    const btnAbrir = document.getElementById('btnAbrirCarrinho');
    const viewLista = document.getElementById('view-lista');
    const viewResultado = document.getElementById('view-resultado');

    if (btnAbrir && modal) {
        btnAbrir.onclick = (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            viewLista.style.display = 'block';
            viewResultado.style.display = 'none';
        };
    }

    // Alternar para Comparação
    const btnIrComparar = document.getElementById('btnCompararAgora');
    if (btnIrComparar) {
        btnIrComparar.onclick = () => {
            viewLista.style.display = 'none';
            viewResultado.style.display = 'block';
        };
    }

    // Voltar para Lista
    const btnVoltarLista = document.getElementById('btnVoltarLista');
    if (btnVoltarLista) {
        btnVoltarLista.onclick = () => {
            viewResultado.style.display = 'none';
            viewLista.style.display = 'block';
        };
    }

    // Função para fechar (usada pelo botão Fechar no HTML)
    window.fecharModal = function() {
        if (modal) modal.style.display = 'none';
    };

    // Fechar ao clicar fora do modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // ==========================================
    // MENU LATERAL
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const sideMenu = document.getElementById('sideMenu');
    const closeBtn = document.getElementById('closeMenuBtn');

    if (menuBtn && sideMenu && closeBtn) {
        menuBtn.addEventListener('click', () => sideMenu.classList.add('active'));
        closeBtn.addEventListener('click', () => sideMenu.classList.remove('active'));
        document.addEventListener('click', (e) => {
            if (sideMenu.classList.contains('active') && !sideMenu.contains(e.target) && e.target !== menuBtn) {
                sideMenu.classList.remove('active');
            }
        });
    }

    // ==========================================
    // SISTEMA DE BUSCA
    // ==========================================
    const suggestedProducts = [
        { name: 'Café Tradicional 3 Corações', category: 'Alimentos', img: 'img/Produto 1.png' },
        { name: 'Açúcar Refinado União', category: 'Alimentos', img: 'img/Produto 2.png' },
        { name: 'Arroz Branco Prato Fino', category: 'Alimentos', img: 'img/Produto 3.png' }
    ];

    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const suggestionsList = document.getElementById('suggestionsList');

    if (searchInput && suggestionsContainer && suggestionsList) {
        function renderSuggestions() {
            suggestionsList.innerHTML = '';
            suggestedProducts.forEach(product => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `
                    <img src="${product.img}" class="suggestion-img">
                    <div class="suggestion-content">
                        <div class="suggestion-name">${product.name}</div>
                        <div class="suggestion-category">${product.category}</div>
                    </div>`;
                item.onclick = () => {
                    searchInput.value = product.name;
                    suggestionsContainer.classList.remove('show');
                };
                suggestionsList.appendChild(item);
            });
        }

        searchInput.onfocus = () => {
            if (searchInput.value === '') {
                renderSuggestions();
                suggestionsContainer.classList.add('show');
            }
        };

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar') && !e.target.closest('.suggestions-container')) {
                suggestionsContainer.classList.remove('show');
            }
        });
    }

    // ==========================================
    // CARROSSEL
    // ==========================================
    const carrosseis = document.querySelectorAll('.banner-carrossel');
    carrosseis.forEach((banners) => {
        setInterval(() => {
            banners.scrollBy({ left: 200, behavior: 'smooth' });
            if (banners.scrollLeft + banners.clientWidth >= banners.scrollWidth - 10) {
                banners.scrollTo({ left: 0, behavior: 'smooth' });
            }
        }, 4000);
    });
});
