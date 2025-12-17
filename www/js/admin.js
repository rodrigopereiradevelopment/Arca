// /js/admin/mercados.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ELEMENTOS DA INTERFACE (COM RECUPERAÇÃO SEGURA)
    const tabelaElement = document.getElementById('tabelaMercados');
    
    // Verificação de segurança
    if (!tabelaElement) {
        console.error('ERRO FATAL: Tabela principal (ID "tabelaMercados") não encontrada. Verifique o HTML.');
        return; 
    }
    
    const tabelaMercados = tabelaElement.querySelector('tbody'); 
    const filtroBusca = document.getElementById('filtroBusca');
    const filtroStatus = document.getElementById('filtroStatus');
    const modalDetalhes = document.getElementById('modalDetalhes');
    const btnNovoMercado = document.getElementById('btnNovoMercado');
    const btnFecharModal = document.getElementById('btnFecharModal');

    // --- SIMULAÇÃO DE DADOS DA API ---
    const mockMercados = [
        { 
            id: 1, 
            nome: 'Supermercado A', 
            cidade: 'Mogi Mirim', 
            bairro: 'Centro', 
            status: 'aprovado', 
            responsavel: 'João Silva', 
            cnpj: '00.111.222/0001-33' 
        },
        { 
            id: 2, 
            nome: 'Minimercado B', 
            cidade: 'Mogi Guaçu', 
            bairro: 'Jardim Paulista', 
            status: 'pendente', 
            responsavel: 'Maria Oliveira', 
            cnpj: '00.444.555/0001-66' 
        },
        { 
            id: 3, 
            nome: 'Atacadão C', 
            cidade: 'Mogi Mirim', 
            bairro: 'Distrito', 
            status: 'desativado', 
            responsavel: 'Carlos Souza', 
            cnpj: '00.777.888/0001-99' 
        },
    ];

    // 2. FUNÇÃO PRINCIPAL: CARREGAR A TABELA
    function carregarMercados() {
        let mercadosFiltrados = mockMercados;
        
        // ✅ FILTRO DE BUSCA (Nome, CNPJ, Cidade)
        const textoBusca = filtroBusca.value.toLowerCase().trim();
        if (textoBusca) {
            mercadosFiltrados = mercadosFiltrados.filter(mercado => {
                return mercado.nome.toLowerCase().includes(textoBusca) ||
                       mercado.cnpj.includes(textoBusca) ||
                       mercado.cidade.toLowerCase().includes(textoBusca);
            });
        }
        
        // ✅ FILTRO DE STATUS
        const statusSelecionado = filtroStatus.value;
        if (statusSelecionado !== 'todos') {
            mercadosFiltrados = mercadosFiltrados.filter(mercado => 
                mercado.status === statusSelecionado
            );
        }

        // Limpa a tabela
        tabelaMercados.innerHTML = '';
        
        // ✅ VERIFICA SE HÁ RESULTADOS
        if (mercadosFiltrados.length === 0) {
            tabelaMercados.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                        Nenhum mercado encontrado com os filtros aplicados.
                    </td>
                </tr>
            `;
            return;
        }
        
        // ✅ PREENCHE A TABELA COM OS RESULTADOS
        mercadosFiltrados.forEach(mercado => {
            const row = tabelaMercados.insertRow();
            row.dataset.mercadoId = mercado.id;

            // Monta a tag de status
            const statusTag = `<span class="status-tag status-${mercado.status}">${mercado.status.toUpperCase()}</span>`;
            
            // Monta os botões de ação
            const acoes = `
                <button class="acoes-btn view" title="Ver Detalhes" data-id="${mercado.id}">👁️</button>
                <button class="acoes-btn edit" title="Editar" data-id="${mercado.id}">✏️</button>
                ${mercado.status === 'pendente' ? `<button class="acoes-btn approve" title="Aprovar" data-id="${mercado.id}">✔️</button>` : ''}
                <button class="acoes-btn delete" title="Deletar" data-id="${mercado.id}">🗑️</button>
            `;

            row.innerHTML = `
                <td>${mercado.id}</td>
                <td>${mercado.nome}</td>
                <td>${mercado.cidade} / ${mercado.bairro}</td>
                <td>${statusTag}</td>
                <td>${mercado.responsavel}</td>
                <td>${acoes}</td>
            `;
        });
    }

    // 3. FUNÇÕES DE AÇÃO
    function handleAcoes(e) {
        const btn = e.target.closest('.acoes-btn');
        if (!btn) return;
        
        const id = btn.dataset.id;
        const acao = btn.classList[1]; // 'view', 'edit', 'approve', 'delete'
        
        switch (acao) {
            case 'view':
            case 'edit':
                const mercado = mockMercados.find(m => m.id == id);
                if (mercado) {
                    document.getElementById('mercadoNomeModal').textContent = mercado.nome;
                    // Aqui você pode preencher outros campos do formulário
                    modalDetalhes.style.display = 'block';
                }
                break;
                
            case 'approve':
                if (confirm(`Aprovar o mercado ID ${id}?`)) {
                    // Simulação: Altera o status do mercado
                    const mercadoParaAprovar = mockMercados.find(m => m.id == id);
                    if (mercadoParaAprovar) {
                        mercadoParaAprovar.status = 'aprovado';
                    }
                    alert(`Mercado ${id} Aprovado! (Simulação)`);
                    carregarMercados(); 
                }
                break;
                
            case 'delete':
                if (confirm(`Tem certeza que deseja DELETAR o mercado ID ${id}?`)) {
                    // Simulação: Remove do array
                    const index = mockMercados.findIndex(m => m.id == id);
                    if (index > -1) {
                        mockMercados.splice(index, 1);
                    }
                    alert(`Mercado ${id} Deletado! (Simulação)`);
                    carregarMercados(); 
                }
                break;
        }
    }

    // 4. EVENT LISTENERS
    if (filtroBusca) filtroBusca.addEventListener('input', carregarMercados);
    if (filtroStatus) filtroStatus.addEventListener('change', carregarMercados);
    if (tabelaMercados) tabelaMercados.addEventListener('click', handleAcoes);

    // Abrir/Fechar Modal
    if (btnNovoMercado) {
        btnNovoMercado.addEventListener('click', () => {
            modalDetalhes.style.display = 'block'; 
            document.getElementById('mercadoNomeModal').textContent = 'NOVO';
        });
    }
    
    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', () => {
            modalDetalhes.style.display = 'none';
        });
    }

    // Fechar modal clicando fora dele
    if (modalDetalhes) {
        window.addEventListener('click', (e) => {
            if (e.target === modalDetalhes) {
                modalDetalhes.style.display = 'none';
            }
        });
    }

    // 5. INICIALIZAÇÃO
    console.log('✅ Script admin/mercados.js carregado com sucesso!');
    console.log('📊 Carregando', mockMercados.length, 'mercados...');
    carregarMercados();
    
    // ✅ TORNA O CONTEÚDO VISÍVEL (remove opacity: 0)
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('visible');
        console.log('✅ Main content agora está visível!');
    }
});