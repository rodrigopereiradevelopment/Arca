// Localização atualizada para Mogi Mirim, SP
const latitudeInicial = -22.4333; 
const longitudeInicial = -46.9583;
const zoomInicial = 13; // Nível de zoom é bom para a cidade

// 1. Inicializa o mapa
// Cria uma instância do mapa no elemento 'mapa' (o seu div#mapa)
const map = L.map('mapa').setView([latitudeInicial, longitudeInicial], zoomInicial);


// 2. Adiciona a camada de azulejos (Tiles) do OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// 3. ADICIONA A FUNCIONALIDADE DE ROTEAMENTO 
// Você deve substituir estes exemplos por coordenadas reais de um ponto de partida
// (ex: MY_LOCATION, que você simulará ou usará do GPS) e um mercado.

// Ponto A: Exemplo de um ponto de partida em Mogi Mirim
const origem = L.latLng(-22.4400, -46.9650); 

// Ponto B: Exemplo de um Mercado em Mogi Mirim
const destino = L.latLng(-22.4250, -46.9400); 

L.Routing.control({
    // Define os pontos inicial e final
    waypoints: [
        origem,
        destino
    ],
    // Opções de Interface
    routeWhileDragging: true,
    showAlternatives: false,
    language: 'pt',
}).addTo(map);