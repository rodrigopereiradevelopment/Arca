document.addEventListener('DOMContentLoaded', () => {
    const tabelaBody = document.querySelector('#tabelaUsuarios tbody');
    const filtroBusca = document.getElementById('filtroUsuarioBusca');
    const filtroPerfil = document.getElementById('filtroPerfil');

    // Dados simulados (Substituir por fetch('/api/usuarios') futuramente)
    let mockUsuarios = [
        { id: 1, nome: 'Carlos Administrador', email: 'admin@arca.com', perfil: 'admin', status: 'ativo' },
        { id: 2, nome: 'Ana Moderadora', email: 'ana@arca.com', perfil: 'moderador', status: 'ativo' },
        { id: 3, nome: 'João Silva', email: 'joao@gmail.com', perfil: 'usuario', status: 'pendente' },
        { id: 4, nome: 'Maria Souza', email: 'maria@outlook.com', perfil: 'usuario', status: 'suspenso' }
    ];

    function carregarUsuarios() {
        tabelaBody.innerHTML = '';
        const busca = filtroBusca.value.toLowerCase();
        const perfil = filtroPerfil.value;

        const filtrados = mockUsuarios.filter(u => {
            const matchesBusca = u.nome.toLowerCase().includes(busca) || u.email.toLowerCase().includes(busca);
            const matchesPerfil = perfil === 'todos' || u.perfil === perfil;
            return matchesBusca && matchesPerfil;
        });

        filtrados.forEach(u => {
            const row = tabelaBody.insertRow();
            row.innerHTML = `
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td><span class="perfil-tag ${u.perfil}">${u.perfil.toUpperCase()}</span></td>
                <td><span class="status-tag status-${u.status}">${u.status}</span></td>
                <td>
                    <button class="acoes-btn edit" data-id="${u.id}" title="Editar Perfil">✏️</button>
                    <button class="acoes-btn delete" data-id="${u.id}" title="Desativar">🚫</button>
                </td>
            `;
        });
    }

    // Eventos
    filtroBusca.addEventListener('input', carregarUsuarios);
    filtroPerfil.addEventListener('change', carregarUsuarios);

    // Inicialização
    carregarUsuarios();
    document.getElementById('main-content').classList.add('visible');
});
