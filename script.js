const playArea = document.getElementById("play-area");
const startButton = document.getElementById("start-sound");
const pointInfo = document.getElementById("point-info");
const pointSelector = document.getElementById("point-selector");

const audioTopLeft = document.getElementById("top-left-audio");
const audioTopRight = document.getElementById("top-right-audio");
const audioBottomLeft = document.getElementById("bottom-left-audio");
const audioBottomRight = document.getElementById("bottom-right-audio");

// Definindo volume inicial e volume máximo
const initialVolume = 0.0;  // volume mínimo para quando longe do canto em questão
const maxVolume = 1.0;      // volume máximo quando bem próximo do canto em questão

// Definição das cores dos pontos
const colorNames = ['Verde', 'Vermelho', 'Azul', 'Amarelo', 'Laranja', 'Roxo', 'Ciano'];

// Criação dos pontos
const points = [];
const pointCount = 7;
const pointSize = 20; // Tamanho do ponto

// Inicializa os pontos com posições e direções aleatórias
for (let i = 0; i < pointCount; i++) {
    const position = {
        x: Math.random() * (playArea.clientWidth - pointSize),
        y: Math.random() * (playArea.clientHeight - pointSize),
    };
    const direction = {
        x: (Math.random() - 0.5) * 2, // Direção x aleatória
        y: (Math.random() - 0.5) * 2, // Direção y aleatória
    };

    points.push({
        id: i,
        x: position.x,
        y: position.y,
        color: colorNames[i], // Nome da cor amigável
        direction: direction,
        audio: null // Armazena o áudio que será tocado
    });

    // Adiciona opção ao menu
    const option = document.createElement("option");
    option.value = i;
    option.text = `Ponto ${colorNames[i]}`;
    pointSelector.appendChild(option);
}

// Função para iniciar os sons após o clique do usuário
startButton.addEventListener("click", () => {
    audioTopLeft.play();
    audioTopRight.play();
    audioBottomLeft.play();
    audioBottomRight.play();
    startButton.style.display = "none"; // Esconde o botão após iniciar os sons
});

// Função para mover os pontos de maneira suave e contínua
function movePoints() {
    points.forEach(point => {
        // Atualiza a posição do ponto
        point.x += point.direction.x;
        point.y += point.direction.y;

        // Verifica se o ponto está fora dos limites e muda a direção se necessário
        if (point.x < 0 || point.x > playArea.clientWidth - pointSize) {
            point.direction.x *= -1; // Inverte a direção horizontal
        }
        if (point.y < 0 || point.y > playArea.clientHeight - pointSize) {
            point.direction.y *= -1; // Inverte a direção vertical
        }

        // Criar ou atualizar a posição do ponto no HTML
        let pointElement = document.getElementById(`point-${point.id}`);
        if (!pointElement) {
            pointElement = document.createElement("div");
            pointElement.id = `point-${point.id}`;
            pointElement.className = "point";
            pointElement.style.width = `${pointSize}px`;
            pointElement.style.height = `${pointSize}px`;
            pointElement.style.borderRadius = "50%";
            playArea.appendChild(pointElement);
        }

        pointElement.style.backgroundColor = getColorFromName(point.color);
        pointElement.style.left = `${point.x}px`;
        pointElement.style.top = `${point.y}px`;

        // Atualiza o volume do áudio do ponto
        if (pointSelector.value == point.id) {
            updateAudioVolume(point);
        }
    });
}

// Função para obter a cor em formato hexadecimal
function getColorFromName(color) {
    const colors = {
        'Verde': '#008000',
        'Vermelho': '#FF0000',
        'Azul': '#0000FF',
        'Amarelo': '#FFFF00',
        'Laranja': '#FFA500',
        'Roxo': '#800080',
        'Ciano': '#00FFFF'
    };
    return colors[color] || '#000000'; // Retorna preto se não encontrar a cor
}

// Função para atualizar o volume do áudio com base na distância
function updateAudioVolume(point) {
    const distances = [
        Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2)), // Top Left
        Math.sqrt(Math.pow(playArea.clientWidth - point.x, 2) + Math.pow(point.y, 2)), // Top Right
        Math.sqrt(Math.pow(point.x, 2) + Math.pow(playArea.clientHeight - point.y, 2)), // Bottom Left
        Math.sqrt(Math.pow(playArea.clientWidth - point.x, 2) + Math.pow(playArea.clientHeight - point.y, 2)) // Bottom Right
    ];

    const maxDist = Math.max(...distances); // Distância máxima

    // Atualiza o volume de cada áudio de acordo com a distância do ponto
    audioTopLeft.volume = maxVolume * (1 - distances[0] / maxDist);
    audioTopRight.volume = maxVolume * (1 - distances[1] / maxDist);
    audioBottomLeft.volume = maxVolume * (1 - distances[2] / maxDist);
    audioBottomRight.volume = maxVolume * (1 - distances[3] / maxDist);
}

// Inicia o movimento dos pontos a cada 50ms
setInterval(movePoints, 50);
