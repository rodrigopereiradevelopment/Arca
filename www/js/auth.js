// /js/auth.js

// Função simulada para obter a função do usuário (em um ambiente real, isso viria de um token JWT ou sessão)
function getUserRole() {
    // --- SIMULAÇÃO DE DADOS DE PERFIL ---
    // Em produção, esta função faria uma chamada API ou leria o token/session storage.
    
    // Simule diferentes perfis para testar:
    // return 'administrador'; // Para testar a página admin
    // return 'moderador';
    return 'administrador'; // Para testar o bloqueio

}

function checkAdminAccess() {
    const requiredRole = 'administrador';
    const userRole = getUserRole(); // Obtém o perfil simulado

    // Se o usuário não for o Administrador, bloqueia o acesso
    if (userRole !== requiredRole) {
        alert('Acesso Negado! Você precisa ser um Administrador para acessar esta área.');
        
        // Redireciona para a página inicial ou de login
        window.location.href = '/index.html'; 
        
        return false;
    }
    
    // Se for Administrador, permite o acesso
    return true;
}

// Executa a verificação imediatamente ao carregar o script
checkAdminAccess();