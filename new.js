// Al inicio del archivo, después de las otras variables
const difficultySelect = document.getElementById('difficultySelect');
const wallModeCheckbox = document.getElementById('wallMode');

// Modificar la función resetGame()
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
    
    // Obtener velocidad del selector de dificultad
    if (difficultySelect) {
        gameSpeed = parseInt(difficultySelect.value);
    } else {
        gameSpeed = 100; // Valor por defecto
    }
    
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

// Modificar la función startGame()
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gamePaused = false;
    direction = {x: 1, y: 0}; // Comienza moviéndose a la derecha
    
    // Actualizar velocidad según dificultad actual
    if (difficultySelect) {
        gameSpeed = parseInt(difficultySelect.value);
    }
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // Asegurarse de limpiar el intervalo anterior si existe
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    gameLoop = setInterval(moveSnake, gameSpeed);
}

// Función moveSnake() corregida (como se mostró arriba)