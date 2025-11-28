// =======================================================
// 1. DADOS DOS DESTINOS (OS 3 MERCADOS MAIS BARATOS)
// =======================================================
// Chave ORS e códigos de roteamento avançado foram removidos para evitar erros.
// SUBSTITUA "SUA_CHAVE_AQUI" pela chave real que você obteve no site do ORS.
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU5MTkzYWM1ZWJhMTRmNmJiMTY0MDI5NTI3Y2NkODQzIiwiaCI6Im11cm11cjY0In0=";
const mercadosMaisBaratos = [
    { id: 1, nome: "Big Bom", lat: -22.4250, lng: -46.9400, preco: "R$ 102,24" },
    { id: 2, nome: "Supermercado SMC", lat: -22.4350, lng: -46.9550, preco: "R$ 107,68" },
    { id: 3, nome: "Supermercado SPN", lat: -22.4450, lng: -46.9700, preco: "R$ 112,80" }
];

const latitudeInicial = -22.4333; 
const longitudeInicial = -46.9583;
const zoomInicial = 13; 

const map = L.map('mapa').setView([latitudeInicial, longitudeInicial], zoomInicial);
let routingControl = null;
let partidaCoordenadas = null; 

// 2. Adiciona a camada de azulejos (Carto Positron)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

// =======================================================
// 3. FUNÇÕES DE ROTEAMENTO E INTERAÇÃO
// =======================================================

/**
 * Função para iniciar uma nova rota usando o roteador padrão (OSRM Demo).
 * @param {L.LatLng} origem - Coordenadas de partida.
 * @param {L.LatLng} destino - Coordenadas do mercado.
 * @param {string} nomeDestino - Nome do mercado.
 */
function iniciarNovaRota(origem, destino, nomeDestino) {
    if (routingControl) { 
        map.removeControl(routingControl);
    }
    
    // Configuração do Leaflet Routing Machine para usar o OSRM Demo (padrão)
    routingControl = L.Routing.control({
        waypoints: [origem, destino],
        routeWhileDragging: false,
        language: 'pt-BR',
        showAlternatives: false,
        collapsed: false 
    }).addTo(map);
}


// Adiciona os marcadores clicáveis no mapa
function adicionarMarcadoresClicaveis(origemCoordenadas) {
    mercadosMaisBaratos.forEach(mercado => {
        const marketLatLong = L.latLng(mercado.lat, mercado.lng);
        
        const marketIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        const marcador = L.marker(marketLatLong, {icon: marketIcon})
            .addTo(map)
            .bindPopup(`<b>${mercado.nome}</b><br>Lista: ${mercado.preco}<br>Clique para ver a rota.`);
        
        marcador.on('click', function() {
            iniciarNovaRota(origemCoordenadas, marketLatLong, mercado.nome);
        });
    });
}


// Preenche o modal/lista flutuante com as opções de mercado
function preencherListaMercados(origemCoordenadas) {
    const listaContainer = document.getElementById('listaMercadosOpcoes');
    listaContainer.innerHTML = ''; 
    
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
        
        item.querySelector('.btn-rota-lista').addEventListener('click', () => {
            const marketLatLong = L.latLng(mercado.lat, mercado.lng);
            
            iniciarNovaRota(origemCoordenadas, marketLatLong, mercado.nome);

            document.getElementById('listaMercadosOpcoes').classList.add('lista-opcoes-oculta');
        });

        listaContainer.appendChild(item);
    });
}

// =======================================================
// 4. LÓGICA DE GEOLOCALIZAÇÃO E INICIALIZAÇÃO
// =======================================================

map.locate({
    setView: false,
    maxZoom: 16,
    enableHighAccuracy: true
});

function onLocationFound(e) {
    const userLatLong = e.latlng;
    
    map.setView(userLatLong, 15);
    L.marker(userLatLong)
        .addTo(map)
        .bindPopup("Sua Localização (Partida)")
        .openPopup();
        
    adicionarMarcadoresClicaveis(userLatLong);
    preencherListaMercados(userLatLong);
}

function onLocationError(e) {
    console.warn("Falha na Geolocalização: " + e.message);
    const padraoOrigem = L.latLng(-22.4400, -46.9650); 
    
    L.marker(padraoOrigem)
        .addTo(map)
        .bindPopup("Partida Padrão (Mogi Mirim)")
        .openPopup();

    adicionarMarcadoresClicaveis(padraoOrigem);
    preencherListaMercados(padraoOrigem);
    
    setTimeout(() => {
        alert("Não foi possível obter sua localização. O ponto de partida é o padrão de Mogi Mirim. Por favor, clique em um mercado no mapa ou use a lista.");
    }, 500); 
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// =======================================================
// 5. LÓGICA DE EXIBIÇÃO DA LISTA
// =======================================================
document.getElementById('btnListaMercados').addEventListener('click', () => {
    document.getElementById('listaMercadosOpcoes').classList.toggle('lista-opcoes-oculta');
});