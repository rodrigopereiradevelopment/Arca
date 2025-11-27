// Coordenadas de Mogi Mirim para centralizar o mapa
const latitudeInicial = -22.4333; 
const longitudeInicial = -46.9583;
const zoomInicial = 13; 

// 1. Inicializa o mapa
const map = L.map('mapa').setView([latitudeInicial, longitudeInicial], zoomInicial);

// 2. Adiciona a camada de azulejos (Tiles) do OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Coordenada do MERCADO VENCEDOR (Destino Fixo)
// ESTE VALOR DEVE SER DINÂMICO no seu projeto final
const destinoMercado = L.latLng(-22.4250, -46.9400); 

// =======================================================
// LÓGICA DE GEOLOCALIZAÇÃO
// =======================================================

// Tenta obter a localização do usuário com alta precisão
map.locate({
    setView: false, // Não movemos o mapa ainda, para não tirar o foco de Mogi Mirim
    maxZoom: 16,
    enableHighAccuracy: true
});

// Função executada se a localização for encontrada com sucesso
function onLocationFound(e) {
    const userLatLong = e.latlng; // Coordenadas do usuário
    
    // 1. Centraliza o mapa na localização do usuário
    map.setView(userLatLong, 15);
    
    // 2. Marca a localização do usuário
    L.marker(userLatLong)
        .addTo(map)
        .bindPopup("Sua Localização")
        .openPopup();
        
    // 3. INICIA O ROTEAMENTO (Origem: Usuário, Destino: Mercado)
    L.Routing.control({
        waypoints: [
            L.latLng(userLatLong.lat, userLatLong.lng), // Origem: Localização do Usuário
            destinoMercado                             // Destino: Mercado Vencedor
        ],
        routeWhileDragging: false,
        language: 'pt',
        // Oculta a interface de roteamento inicial para forçar o uso da localização
        // O usuário pode clicar no marcador para ajustar a rota se quiser.
        collapsed: false 
    }).addTo(map);
}

// Função executada se a geolocalização falhar
function onLocationError(e) {
    console.warn("Falha na Geolocalização: " + e.message);
    // 1. Avisa o usuário sobre a falha (opcional)
    alert("Não foi possível obter sua localização. Usando ponto de partida padrão em Mogi Mirim.");
    
    // 2. Usa a localização padrão que você já tinha definido para a origem
    const padraoOrigem = L.latLng(-22.4400, -46.9650); 
    
    // 3. INICIA O ROTEAMENTO (Origem: Padrão, Destino: Mercado)
    L.Routing.control({
        waypoints: [padraoOrigem, destinoMercado],
        routeWhileDragging: false,
        language: 'pt',
        collapsed: false
    }).addTo(map);
}

// Registra as funções para serem chamadas pelo mapa
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
