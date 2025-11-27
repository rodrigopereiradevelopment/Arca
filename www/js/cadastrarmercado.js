 // Máscaras de input
 function mascaraCNPJ(input) {
   let valor = input.value.replace(/\D/g, '');
   valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
   valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
   valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
   valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
   input.value = valor;
 }
 
 function mascaraCPF(input) {
   let valor = input.value.replace(/\D/g, '');
   valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
   valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
   valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
   input.value = valor;
 }
 
 function mascaraTelefone(input) {
   let valor = input.value.replace(/\D/g, '');
   if (valor.length <= 10) {
     valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
     valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
   } else {
     valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
     valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
   }
   input.value = valor;
 }
 
 function mascaraCEP(input) {
   let valor = input.value.replace(/\D/g, '');
   valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
   input.value = valor;
 }
 
 // Aplicar máscaras
 document.getElementById('cnpj').addEventListener('input', function() {
   mascaraCNPJ(this);
 });
 
 document.getElementById('admin_cpf').addEventListener('input', function() {
   mascaraCPF(this);
 });
 
 document.getElementById('telefone').addEventListener('input', function() {
   mascaraTelefone(this);
 });
 
 document.getElementById('admin_telefone').addEventListener('input', function() {
   mascaraTelefone(this);
 });
 
 document.addEventListener('input', function(e) {
   if (e.target.classList.contains('cep-input')) {
     mascaraCEP(e.target);
   }
 });
 
 // Preview de imagem
 document.getElementById('imagem').addEventListener('change', function(e) {
   const file = e.target.files[0];
   if (file) {
     const reader = new FileReader();
     reader.onload = function(event) {
       const preview = document.getElementById('imagePreview');
       preview.querySelector('img').src = event.target.result;
       preview.style.display = 'block';
     };
     reader.readAsDataURL(file);
   }
 });
 
 // Adicionar endereço
 let enderecoIndex = 1;
 document.getElementById('btnAddEndereco').addEventListener('click', function() {
   const container = document.getElementById('enderecos-container');
   const novoEndereco = `
                <div class="endereco-item" data-index="${enderecoIndex}">
                    <div class="endereco-header">
                        <span class="endereco-label">Endereço ${enderecoIndex + 1}</span>
                        <button type="button" class="btn-remove" onclick="removerEndereco(this)">×</button>
                    </div>

                    <div class="form-group">
                        <label>CEP <span class="required">*</span></label>
                        <div class="cep-group">
                            <input type="text" name="cep[]" class="cep-input" required placeholder="00000-000" maxlength="9">
                            <button type="button" class="btn-buscar-cep">Buscar</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Rua <span class="required">*</span></label>
                        <input type="text" name="rua[]" required placeholder="Nome da rua">
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label>Número <span class="required">*</span></label>
                            <input type="text" name="numero[]" required placeholder="123">
                        </div>

                        <div class="form-group">
                            <label>Complemento</label>
                            <input type="text" name="complemento[]" placeholder="Apto, Sala...">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Bairro <span class="required">*</span></label>
                        <input type="text" name="bairro[]" required placeholder="Nome do bairro">
                    </div>

                    <div class="input-group">
                        <div class="form-group">
                            <label>Cidade <span class="required">*</span></label>
                            <input type="text" name="cidade[]" required placeholder="Cidade">
                        </div>

                        <div class="form-group">
                            <label>UF <span class="required">*</span></label>
                            <input type="text" name="estado[]" required placeholder="SP" maxlength="2">
                        </div>
                    </div>
                </div>
            `;
   container.insertAdjacentHTML('beforeend', novoEndereco);
   enderecoIndex++;
 });
 
 function removerEndereco(btn) {
   btn.closest('.endereco-item').remove();
 }
 
 // Buscar CEP
 document.addEventListener('click', function(e) {
   if (e.target.classList.contains('btn-buscar-cep')) {
     const enderecoItem = e.target.closest('.endereco-item');
     const cep = enderecoItem.querySelector('.cep-input').value.replace(/\D/g, '');
     
     if (cep.length === 8) {
       e.target.textContent = 'Buscando...';
       e.target.disabled = true;
       
       fetch(`https://viacep.com.br/ws/${cep}/json/`)
         .then(response => response.json())
         .then(data => {
           if (!data.erro) {
             enderecoItem.querySelector('input[name="rua[]"]').value = data.logradouro;
             enderecoItem.querySelector('input[name="bairro[]"]').value = data.bairro;
             enderecoItem.querySelector('input[name="cidade[]"]').value = data.localidade;
             enderecoItem.querySelector('input[name="estado[]"]').value = data.uf;
           } else {
             alert('CEP não encontrado!');
           }
         })
         .catch(error => {
           alert('Erro ao buscar CEP!');
         })
         .finally(() => {
           e.target.textContent = 'Buscar';
           e.target.disabled = false;
         });
     } else {
       alert('CEP inválido! Digite os 8 dígitos.');
     }
   }
 });
 
 // Submit do formulário
 document.getElementById('formMercado').addEventListener('submit', function(e) {
   e.preventDefault();
   
   const formData = new FormData(this);
   
   console.log('Dados do formulário:');
   for (let [key, value] of formData.entries()) {
     console.log(key + ': ' + value);
   }
   
   alert('Formulário validado! Veja o console para os dados.');
   
   // Aqui você implementaria o envio real:
   /*
   fetch('/api/mercado/cadastrar', {
       method: 'POST',
       body: formData
   })
   .then(response => response.json())
   .then(data => {
       if(data.success) {
           alert('Mercado cadastrado com sucesso!');
           window.location.href = '/mercados';
       }
   })
   .catch(error => {
       alert('Erro ao cadastrar mercado!');
       console.error(error);
   });
   */
 });