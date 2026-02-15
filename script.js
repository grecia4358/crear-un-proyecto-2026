// Elementos del DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const gameOverModal = document.getElementById('gameOverModal');
const finalScore = document.getElementById('finalScore');
const finalHighScore = document.getElementById('finalHighScore');
const playAgainBtn = document.getElementById('playAgainBtn');

// Variables del juego
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let direction = {x: 0, y: 0};
let food = {};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameSpeed = 100;
let gameLoop;

// Inicializar récord
highScoreElement.textContent = highScore;

// Generar comida aleatoria
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Evitar que la comida aparezca sobre la serpiente
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            break;
        }
    }
}

// Dibujar el juego
function drawGame() {
    // Limpiar canvas
    ctx.fillStyle = '#1a2634';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Cabeza de la serpiente
            ctx.fillStyle = '#2ecc71';
        } else {
            // Cuerpo de la serpiente
            ctx.fillStyle = '#27ae60';
        }
        
        ctx.fillRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
        
        // Ojos en la cabeza
        if (index === 0) {
            ctx.fillStyle = 'white';
            ctx.fillRect(
                segment.x * gridSize + 4, 
                segment.y * gridSize + 4, 
                3, 3
            );
            ctx.fillRect(
                segment.x * gridSize + 13, 
                segment.y * gridSize + 4, 
                3, 3
            );
        }
    });

    // Dibujar la comida
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Brillo en la comida
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2 - 2,
        food.y * gridSize + gridSize / 2 - 2,
        3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Mover la serpiente
function moveSnake() {
    if (!gameRunning || gamePaused) return;

    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // Verificar colisión con paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Verificar colisión con la serpiente
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Verificar si come la comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        
        // Aumentar velocidad gradualmente
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameLoop);
            gameLoop = setInterval(moveSnake, gameSpeed);
        }
    } else {
        snake.pop();
    }

    drawGame();
}

// Game Over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Actualizar récord
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
    
    // Mostrar modal
    finalScore.textContent = score;
    finalHighScore.textContent = highScore;
    gameOverModal.style.display = 'flex';
    
    // Actualizar estado de botones
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Iniciar juego
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gamePaused = false;
    direction = {x: 1, y: 0}; // Comienza moviéndose a la derecha
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    gameLoop = setInterval(moveSnake, gameSpeed);
}

// Pausar juego
function pauseGame() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Reanudar' : 'Pausa';
    
    if (gamePaused) {
        clearInterval(gameLoop);
    } else {
        gameLoop = setInterval(moveSnake, gameSpeed);
    }
}

// Reiniciar juego
function resetGame() {
    // Detener juego actual
    if (gameRunning) {
        clearInterval(gameLoop);
        gameRunning = false;
    }
    
    // Reiniciar variables
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: 0};
    score = 0;
    gameSpeed = 100;
    gamePaused = false;
    
    // Actualizar UI
    scoreElement.textContent = score;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pausa';
    
    // Generar nueva comida
    generateFood();
    drawGame();
}

// Controles del teclado
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = {x: 1, y: 0};
            }
            break;
    }
});

// Controles táctiles para móviles
document.querySelectorAll('.mobile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!gameRunning || gamePaused) return;
        
        const direction_map = {
            'UP': {x: 0, y: -1},
            'DOWN': {x: 0, y: 1},
            'LEFT': {x: -1, y: 0},
            'RIGHT': {x: 1, y: 0}
        };
        
        const newDirection = direction_map[btn.dataset.direction];
        
        // Evitar movimiento inverso
        if ((direction.x === 0 && newDirection.x === 0) || 
            (direction.y === 0 && newDirection.y === 0)) {
            direction = newDirection;
        }
    });
});

// Event Listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    resetGame();
});

// Cerrar modal haciendo clic fuera
window.addEventListener('click', (e) => {
    if (e.target === gameOverModal) {
        gameOverModal.style.display = 'none';
        resetGame();
    }
});

// Inicializar juego
function init() {
    generateFood();
    drawGame();
}

init();