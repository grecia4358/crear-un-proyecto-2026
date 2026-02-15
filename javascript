// Al inicio del archivo, después de las otras variables
const wallModeCheckbox = document.getElementById('wallMode');

// Modificar la función moveSnake() - Reemplaza la sección de verificación de colisión
function moveSnake() {
    if (!gameRunning || gamePaused) return;

    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // Verificar colisión con paredes - VERSIÓN CORREGIDA
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        if (wallModeCheckbox && wallModeCheckbox.checked) {
            // Modo paredes sólidas
            gameOver();
            return;
        } else {
            // Modo teletransporte
            if (head.x < 0) head.x = tileCount - 1;
            if (head.x >= tileCount) head.x = 0;
            if (head.y < 0) head.y = tileCount - 1;
            if (head.y >= tileCount) head.y = 0;
        }
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