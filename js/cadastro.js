// =============================================
// ARCA - CADASTRO.JS
// Validações e controle do formulário de cadastro
// =============================================

// =============================================
// 1. MÁSCARAS DE INPUT
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Máscara CPF
    const cpfInput = document.querySelector('input[name="cpf"]');
    if (cpfInput && typeof IMask !== 'undefined') {
        IMask(cpfInput, {
            mask: '000.000.000-00'
        });
    }

    // Máscara Telefone
    const telefoneInput = document.querySelector('input[name="telefone"]');
    if (telefoneInput && typeof IMask !== 'undefined') {
        IMask(telefoneInput, {
            mask: [
                { mask: '(00) 0000-0000' },
                { mask: '(00) 00000-0000' }
            ]
        });
    }
});

// =============================================
// 2. TOGGLE SENHA (Mostrar/Ocultar)
// =============================================
function toggleSenha() {
    const campoSenha = document.getElementById('senha');
    if (campoSenha) {
        campoSenha.type = campoSenha.type === 'password' ? 'text' : 'password';
    }
}

function toggleConfirmSenha() {
    const campoConfirm = document.getElementById('confirmSenha');
    if (campoConfirm) {
        campoConfirm.type = campoConfirm.type === 'password' ? 'text' : 'password';
    }
}

// =============================================
// 3. VALIDAÇÃO DE CPF
// =============================================
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove pontos e traços
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    
    if (digito1 !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    
    return digito2 === parseInt(cpf.charAt(10));
}

// =============================================
// 4. VALIDAÇÃO DE EMAIL
// =============================================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// =============================================
// 5. VALIDAÇÃO DE SENHA FORTE
// =============================================
function validarSenhaForte(senha) {
    // Mínimo 8 caracteres
    if (senha.length < 8) {
        return { valida: false, mensagem: 'A senha deve ter no mínimo 8 caracteres' };
    }
    
    // Opcional: verificar complexidade
    const temNumero = /\d/.test(senha);
    const temLetra = /[a-zA-Z]/.test(senha);
    
    if (!temNumero || !temLetra) {
        return { valida: false, mensagem: 'A senha deve conter letras e números' };
    }
    
    return { valida: true, mensagem: 'Senha válida' };
}

// =============================================
// 6. GEOLOCALIZAÇÃO
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const checkboxLocalizacao = document.getElementById('permitir_localizacao');
    
    if (checkboxLocalizacao) {
        checkboxLocalizacao.addEventListener('change', function() {
            if (this.checked) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            // Criar campos hidden para latitude e longitude
                            const form = document.querySelector('form');
                            
                            // Remover campos antigos se existirem
                            const latOld = form.querySelector('input[name="latitude"]');
                            const longOld = form.querySelector('input[name="longitude"]');
                            if (latOld) latOld.remove();
                            if (longOld) longOld.remove();
                            
                            // Criar novos campos
                            let latInput = document.createElement('input');
                            latInput.type = 'hidden';
                            latInput.name = 'latitude';
                            latInput.value = position.coords.latitude;
                            form.appendChild(latInput);
                            
                            let longInput = document.createElement('input');
                            longInput.type = 'hidden';
                            longInput.name = 'longitude';
                            longInput.value = position.coords.longitude;
                            form.appendChild(longInput);
                            
                            alert('✓ Localização capturada com sucesso!');
                        },
                        function(error) {
                            alert('✗ Não foi possível acessar sua localização.');
                            checkboxLocalizacao.checked = false;
                        }
                    );
                } else {
                    alert('✗ Seu navegador não suporta geolocalização.');
                    this.checked = false;
                }
            }
        });
    }
});

// =============================================
// 7. VALIDAÇÃO E SUBMIT DO FORMULÁRIO
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede envio padrão
            
            // Obter valores dos campos
            const nome = document.querySelector('input[name="nome"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            const senha = document.getElementById('senha').value;
            const confirmSenha = document.getElementById('confirmSenha').value;
            const cpf = document.querySelector('input[name="cpf"]')?.value || '';
            const aceiteTermos = document.getElementById('aceiteTermos').checked;
            
            // ====== VALIDAÇÕES ======
            
            // 1. Nome
            if (nome.length < 3) {
                alert('❌ O nome deve ter no mínimo 3 caracteres!');
                return false;
            }
            
            // 2. Email
            if (!validarEmail(email)) {
                alert('❌ Email inválido!');
                return false;
            }
            
            // 3. Senha
            const validacaoSenha = validarSenhaForte(senha);
            if (!validacaoSenha.valida) {
                alert('❌ ' + validacaoSenha.mensagem);
                return false;
            }
            
            // 4. Confirmar senha
            if (senha !== confirmSenha) {
                alert('❌ As senhas não coincidem!');
                return false;
            }
            
            // 5. CPF (se preenchido)
            if (cpf && !validarCPF(cpf)) {
                alert('❌ CPF inválido!');
                return false;
            }
            
            // 6. Termos de uso
            if (!aceiteTermos) {
                alert('❌ Você precisa aceitar os termos de uso!');
                return false;
            }
            
            // ====== SALVAR DADOS TEMPORARIAMENTE (localStorage) ======
            const usuario = {
                nome: nome,
                email: email,
                cpf: cpf,
                telefone: document.querySelector('input[name="telefone"]')?.value || '',
                cidade: document.querySelector('input[name="cidade"]')?.value || 'Mogi Mirim',
                dataCadastro: new Date().toISOString(),
                cadastrado: true
            };
            
            // Salvar no localStorage (simula BD até criar backend)
            localStorage.setItem('usuarioARCA', JSON.stringify(usuario));
            
            // Salvar configurações
            const configuracoes = {
                notificacao_push: document.querySelector('input[name="notificacao_push"]')?.checked || false,
                notificacao_email: document.querySelector('input[name="notificacao_email"]')?.checked || false,
                notificacao_promocoes: document.querySelector('input[name="notificacao_promocoes"]')?.checked || false,
                raio_busca: document.querySelector('input[name="raio_busca"]')?.value || 15,
                modo_escuro: document.querySelector('input[name="modo_escuro"]')?.checked || false
            };
            
            localStorage.setItem('configuracoesARCA', JSON.stringify(configuracoes));
            
            // ====== SUCESSO ======
            alert('✓ Cadastro realizado com sucesso!\n\nBem-vindo ao ARCA, ' + nome + '!');
            
            // Redirecionar para página inicial
            window.location.href = 'index.html';
            
            return false;
        });
    }
});

// =============================================
// 8. ATUALIZAR VALOR DO RANGE (Raio de busca)
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const raioInput = document.getElementById('raio_busca');
    
    if (raioInput) {
        raioInput.addEventListener('input', function() {
            const output = this.nextElementSibling;
            if (output && output.tagName === 'OUTPUT') {
                output.value = this.value;
            }
        });
    }
});

// =============================================
// 9. LIMPAR FORMULÁRIO
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    const btnReset = document.querySelector('button[type="reset"]');
    
    if (btnReset) {
        btnReset.addEventListener('click', function() {
            // Confirmação antes de limpar
            if (!confirm('Deseja realmente limpar todos os campos?')) {
                return false;
            }
        });
    }
});

// =============================================
// 10. CONSOLE LOG (DEBUG)
// =============================================
console.log('✓ ARCA Cadastro JS carregado com sucesso!');
console.log('Versão: 1.0.0');
console.log('Data: ' + new Date().toLocaleDateString());