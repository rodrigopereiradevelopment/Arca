// =======================================================
// 1. DADOS DOS DESTINOS (OS 3 MERCADOS MAIS BARATOS)
// ESTES DADOS DEVEM VIR DA SUA PÁGINA ANTERIOR
// =======================================================
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU5MTkzYWM1ZWJhMTRmNmJiMTY0MDI5NTI3Y2NkODQzIiwiaCI6Im11cm11cjY0In0=";

const mercadosMaisBaratos = [
    { id: 1, nome: "Big Bom", lat: -22.4250, lng: -46.9400, preco: "R$ 102,24" },
    { id: 2, nome: "Supermercado SMC", lat: -22.4350, lng: -46.9550, preco: "R$ 107,68" },
    { id: 3, nome: "Supermercado SPN", lat: -22.4450, lng: -46.9700, preco: "R$ 112,80" }
];

// Coordenadas de Mogi Mirim para centralizar o mapa inicialmente
const latitudeInicial = -22.4333; 
const longitudeInicial = -46.9583;
const zoomInicial = 13; 

// Variáveis globais para rastrear o mapa e a rota
const map = L.map('mapa').setView([latitudeInicial, longitudeInicial], zoomInicial);
let routingControl = null;
let partidaCoordenadas = null; // Armazena a localização do Usuário ou Padrão

// 2. Adiciona a camada de azulejos (Carto Positron - Gratuito e Estável)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

// =======================================================
// 3. FUNÇÕES DE ROTEAMENTO E INTERAÇÃO
// =======================================================

// Função para INICIAR UMA NOVA ROTA
function iniciarNovaRota(origem, destino, nomeDestino) {
    // Se houver um controle de rota anterior, remova-o
    if (routingControl) { 
        map.removeControl(routingControl);
    }
    
    // Inicializa a nova rota, AGORA USANDO O ROUTER DO OPENROUTESERVICE
    routingControl = L.Routing.control({
        // NOVO: Configuração para usar o OpenRouteService
        router: L.Routing.openrouteservice({
            // Endpoint para cálculo de rotas de carro
            serviceUrl: 'https://api.openrouteservice.org/v2/directions/driving-car',
            apiKey: ORS_API_KEY, // Usa a chave de API definida no topo
            timeout: 30 * 1000 // Aumenta o tempo de espera para evitar timeouts
        }),
        
        waypoints: [origem, destino],
        routeWhileDragging: false,
        language: 'pt',
        showAlternatives: false,
        collapsed: false 
    }).addTo(map);
    // Opcional: Atualiza o painel para mostrar qual mercado foi escolhido
   // const painelRota = document.querySelector('.leaflet-routing-container');
   // if (painelRota) {
        // Remove conteúdo antigo e insere um título para o destino
     //   painelRota.querySelector('.leaflet-routing-geocoders').innerHTML = `
          //  <h2>Rota para: ${nomeDestino}</h2>
       // `;
   // }
}


// Adiciona os marcadores clicáveis no mapa
function adicionarMarcadoresClicaveis(origemCoordenadas) {
    // Itera sobre a lista de mercados para criar os marcadores no mapa
    mercadosMaisBaratos.forEach(mercado => {
        const marketLatLong = L.latLng(mercado.lat, mercado.lng);
        
        // Define um ícone visualmente diferente para os mercados
        const marketIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        // Cria o marcador com pop-up
        const marcador = L.marker(marketLatLong, {icon: marketIcon})
            .addTo(map)
            .bindPopup(`<b>${mercado.nome}</b><br>Lista: ${mercado.preco}<br>Clique para ver a rota.`);
        
        // Evento de clique no marcador do mapa
        marcador.on('click', function() {
            iniciarNovaRota(origemCoordenadas, marketLatLong, mercado.nome);
        });
    });
}


// Preenche o modal/lista flutuante com as opções de mercado
function preencherListaMercados(origemCoordenadas) {
    const listaContainer = document.getElementById('listaMercadosOpcoes');
    listaContainer.innerHTML = ''; // Limpa o conteúdo
    
    // Armazena a coordenada de partida
    partidaCoordenadas = origemCoordenadas;

    mercadosMaisBaratos.forEach((mercado, index) => {
        const item = document.createElement('div');
        item.className = 'mercado-item-lista';
        item.innerHTML = `
            <div>
                <strong>${index + 1}. ${mercado.nome}</strong><br>
                <span>Total: ${mercado.preco}</span>
            </div>
            <button class="btn-rota-lista">Traçar Rota</button>
        `;
        
        // Evento de clique no botão 'Traçar Rota' dentro da lista
        item.querySelector('.btn-rota-lista').addEventListener('click', () => {
            const marketLatLong = L.latLng(mercado.lat, mercado.lng);
            
            // Inicia o roteamento
            iniciarNovaRota(origemCoordenadas, marketLatLong, mercado.nome);

            // Esconde a lista após a escolha
            document.getElementById('listaMercadosOpcoes').classList.add('lista-opcoes-oculta');
        });

        listaContainer.appendChild(item);
    });
}

// =======================================================
// 4. LÓGICA DE GEOLOCALIZAÇÃO E INICIALIZAÇÃO
// =======================================================

// Tenta obter a localização do usuário
map.locate({
    setView: false,
    maxZoom: 16,
    enableHighAccuracy: true
});

// Sucesso na localização
function onLocationFound(e) {
    const userLatLong = e.latlng;
    
    // Centraliza o mapa no usuário e marca o ponto de partida
    map.setView(userLatLong, 15);
    L.marker(userLatLong)
        .addTo(map)
        .bindPopup("Sua Localização (Partida)")
        .openPopup();
        
    // Inicia a lógica de marcadores e lista
    adicionarMarcadoresClicaveis(userLatLong);
    preencherListaMercados(userLatLong);
}

// Falha na localização
function onLocationError(e) {
    console.warn("Falha na Geolocalização: " + e.message);
    const padraoOrigem = L.latLng(-22.4400, -46.9650); 
    
    // Marca a origem Padrão
    L.marker(padraoOrigem)
        .addTo(map)
        .bindPopup("Partida Padrão (Mogi Mirim)")
        .openPopup();

    // Inicia a lógica de marcadores e lista
    adicionarMarcadoresClicaveis(padraoOrigem);
    preencherListaMercados(padraoOrigem);
    
    setTimeout(() => {
        alert("Não foi possível obter sua localização. O ponto de partida é o padrão de Mogi Mirim. Por favor, clique em um mercado no mapa ou use a lista.");
    }, 500); 
}

// Registra os eventos de geolocalização
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// =======================================================
// 5. LÓGICA DE EXIBIÇÃO DA LISTA (Ouvinte de Evento)
// =======================================================
document.getElementById('btnListaMercados').addEventListener('click', () => {
    document.getElementById('listaMercadosOpcoes').classList.toggle('lista-opcoes-oculta');
});