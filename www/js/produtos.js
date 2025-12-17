// /js/moderador/produtos.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ELEMENTOS DA INTERFACE ---
    const abasContainer = document.querySelector('.abas-controle');
    const tabContents = {
        produtos: document.getElementById('tab-produtos'),
        categorias: document.getElementById('tab-categorias'),
        precos: document.getElementById('tab-precos')
    };

    // Tabela de Produtos
    const tabelaProdutosBody = document.querySelector('#tabelaProdutos tbody');
    const filtroBuscaProduto = document.getElementById('filtroProdutoBusca');
    const filtroCategoria = document.getElementById('filtroCategoria');

    // Tabela de Categorias
    const tabelaCategoriasBody = document.querySelector('#tabelaCategorias tbody');
    const btnNovaCategoria = document.getElementById('btnNovaCategoria');
    const novaCategoriaInput = document.getElementById('novaCategoriaInput');

    const modalProdutoDetalhes = document.getElementById('modalProdutoDetalhes');
    const btnFecharModalProduto = document.getElementById('btnFecharModalProduto');


    // --- 2. SIMULAÇÃO DE DADOS ---
    let mockCategorias = [
        { id: 1, nome: 'Limpeza' },
        { id: 2, nome: 'Bebidas' },
        { id: 3, nome: 'Padaria' },
    ];

    let mockProdutos = [
        { id: 101, nome: 'Pão de Forma Tradicional', categoriaId: 3, ean: '7891000100018', precoAtivo: 12 },
        { id: 102, nome: 'Detergente Neutro 500ml', categoriaId: 1, ean: '7892000200029', precoAtivo: 8 },
        { id: 103, nome: 'Refrigerante Cola 2L', categoriaId: 2, ean: '7893000300030', precoAtivo: 15 },
        { id: 104, nome: 'Vassoura de Piaçava', categoriaId: 1, ean: '7894000400041', precoAtivo: 5 },
    ];

    // --- 3. FUNÇÕES DE RENDERIZAÇÃO ---

    /** Mapeia ID da Categoria para Nome para exibição na tabela de produtos. */
    function getCategoryName(id) {
        const cat = mockCategorias.find(c => c.id === id);
        return cat ? cat.nome : 'Não Classificado';
    }

    /** Carrega os dados na Tabela de Produtos. */
    function carregarProdutos() {
        // Limpa a tabela
        tabelaProdutosBody.innerHTML = '';
        let produtosFiltrados = mockProdutos;

        // Implementação dos filtros (Busca e Categoria)
        const busca = filtroBuscaProduto ? filtroBuscaProduto.value.toLowerCase() : '';
        const catId = filtroCategoria ? parseInt(filtroCategoria.value) : 'todos';

        produtosFiltrados = produtosFiltrados.filter(produto => {
            const matchesBusca = !busca || 
                                 produto.nome.toLowerCase().includes(busca) ||
                                 produto.ean.includes(busca);
            const matchesCategoria = catId === 'todos' || produto.categoriaId === catId;
            return matchesBusca && matchesCategoria;
        });


        if (produtosFiltrados.length === 0) {
             tabelaProdutosBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">Nenhum produto encontrado.</td></tr>`;
             return;
        }

        produtosFiltrados.forEach(produto => {
            const row = tabelaProdutosBody.insertRow();
            row.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${getCategoryName(produto.categoriaId)}</td>
                <td>${produto.ean}</td>
                <td>R$ ${produto.precoAtivo.toFixed(2)}</td>
                <td>
                    <button class="acoes-btn view" title="Ver Detalhes" data-id="${produto.id}">👁️</button>
                    <button class="acoes-btn edit" title="Editar" data-id="${produto.id}">✏️</button>
                    <button class="acoes-btn delete" title="Deletar" data-id="${produto.id}">🗑️</button>
                </td>
            `;
        });
    }

    /** Carrega os dados na Tabela de Categorias e preenche o SELECT de filtro. */
    function carregarCategorias() {
        tabelaCategoriasBody.innerHTML = '';
        
        // 1. Preenche a tabela
        mockCategorias.forEach(cat => {
            const row = tabelaCategoriasBody.insertRow();
            row.innerHTML = `
                <td>${cat.id}</td>
                <td>${cat.nome}</td>
                <td>
                    <button class="acoes-btn edit-cat" title="Editar Categoria" data-id="${cat.id}">✏️</button>
                    <button class="acoes-btn delete-cat" title="Deletar Categoria" data-id="${cat.id}">🗑️</button>
                </td>
            `;
        });

        // 2. Preenche o Select de Filtro (se o elemento existir)
        if (filtroCategoria) {
            filtroCategoria.innerHTML = '<option value="todos">Categoria: Todas</option>';
            mockCategorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.nome;
                filtroCategoria.appendChild(option);
            });
        }
    }

    // --- 4. LÓGICA DE ABAS ---

    function handleTabClick(e) {
        const btn = e.target.closest('.aba-btn');
        if (!btn) return;

        const targetTab = btn.dataset.tab;

        // Remove 'active' de todos os botões e 'hidden' de todos os conteúdos
        document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

        // Ativa o botão e mostra o conteúdo alvo
        btn.classList.add('active');
        if (tabContents[targetTab]) {
            tabContents[targetTab].classList.remove('hidden');
        }

        // Recarrega os dados específicos da aba
        if (targetTab === 'produtos') {
            carregarProdutos();
        } else if (targetTab === 'categorias') {
            carregarCategorias();
        }
        // Nota: A aba 'precos' é estática por enquanto.
    }

    // --- 5. LÓGICA DE CRUD DE CATEGORIAS ---

    function adicionarCategoria() {
        if (!novaCategoriaInput || !tabelaCategoriasBody) return;
        
        const nome = novaCategoriaInput.value.trim();
        if (nome === "") {
            alert("O nome da categoria não pode ser vazio.");
            return;
        }

        // Simulação de ID
        const novoId = mockCategorias.length > 0 ? Math.max(...mockCategorias.map(c => c.id)) + 1 : 1;
        mockCategorias.push({ id: novoId, nome: nome });
        
        novaCategoriaInput.value = '';
        alert(`Categoria "${nome}" adicionada! (Simulação)`);
        
        carregarCategorias();
        carregarProdutos(); // Atualiza o select de filtro de produtos
    }

    // --- 6. EVENT LISTENERS ---

    // Ações de Tabela de Produtos (View, Edit, Delete)
    if (tabelaProdutosBody) {
        tabelaProdutosBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.acoes-btn');
            if (!btn) return;
            const id = btn.dataset.id;
            const acao = btn.classList[1]; 

            // Lógica de ações (View/Edit abre modal, Delete remove)
            if (acao === 'view' || acao === 'edit') {
                 // Simulação: Abrir Modal
                 const produto = mockProdutos.find(p => p.id == id);
                 if (produto && modalProdutoDetalhes) {
                     document.getElementById('produtoNomeModal').textContent = produto.nome;
                     modalProdutoDetalhes.style.display = 'block';
                 }
            } else if (acao === 'delete') {
                if (confirm(`Tem certeza que deseja DELETAR o produto ID ${id}?`)) {
                    const index = mockProdutos.findIndex(p => p.id == id);
                    if (index > -1) {
                        mockProdutos.splice(index, 1);
                        alert(`Produto ${id} Deletado! (Simulação)`);
                        carregarProdutos();
                    }
                }
            }
        });
    }

    // Ações de Tabela de Categorias (Edit, Delete)
    if (tabelaCategoriasBody) {
        tabelaCategoriasBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.acoes-btn');
            if (!btn) return;
            const id = btn.dataset.id;
            const acao = btn.classList[1]; 

            if (acao === 'delete-cat') {
                if (confirm(`Tem certeza que deseja DELETAR a categoria ID ${id}? Isso pode afetar produtos.`)) {
                    const index = mockCategorias.findIndex(c => c.id == id);
                    if (index > -1) {
                        mockCategorias.splice(index, 1);
                        alert(`Categoria ${id} Deletada! (Simulação)`);
                        carregarCategorias();
                        carregarProdutos(); // Atualiza a tabela de produtos
                    }
                }
            } else if (acao === 'edit-cat') {
                // Simulação de Edição simples
                 const categoria = mockCategorias.find(c => c.id == id);
                 const novoNome = prompt(`Editar nome para "${categoria.nome}":`, categoria.nome);
                 if (novoNome && novoNome.trim() !== "" && novoNome !== categoria.nome) {
                     categoria.nome = novoNome.trim();
                     alert(`Categoria ${id} atualizada!`);
                     carregarCategorias();
                     carregarProdutos();
                 }
            }
        });
    }
    
    // Filtros de Produtos
    if (filtroBuscaProduto) filtroBuscaProduto.addEventListener('input', carregarProdutos);
    if (filtroCategoria) filtroCategoria.addEventListener('change', carregarProdutos);

    // Botão de Nova Categoria
    if (btnNovaCategoria) btnNovaCategoria.addEventListener('click', adicionarCategoria);

    // Lógica de Abas
    if (abasContainer) abasContainer.addEventListener('click', handleTabClick);

    // Fechar Modal
    if (btnFecharModalProduto) {
        btnFecharModalProduto.addEventListener('click', () => {
            if (modalProdutoDetalhes) modalProdutoDetalhes.style.display = 'none';
        });
    }

    // --- 7. INICIALIZAÇÃO ---
    console.log('✅ Script moderador/produtos.js carregado com sucesso!');
    carregarCategorias(); // Carrega categorias primeiro (para preencher o select)
    carregarProdutos();   // Carrega produtos (aba padrão 'produtos' é a ativa no HTML)
    
    // ✅ TORNA O CONTEÚDO VISÍVEL
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('visible');
    }
});