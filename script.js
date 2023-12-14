// Define HTML elements 
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
// where the snake starts (10th row, 10th collumn)
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// Draw game map, snake and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    snake.forEach(segment => {
        const snakeEl = createGameElement('div', 'snake');
        setPosition(snakeEl, segment);
        board.appendChild(snakeEl);
    });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set position of the snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// food 
function drawFood() {
    if (gameStarted) {
        const foodEl = createGameElement('div', 'food');
        setPosition(foodEl, food);
        board.appendChild(foodEl);
    }
}

//generate food at a random position on the board. 
//Returns an object of the x and y postion.
function generateFood() {
    // Math.random creates a random number from 0 - .99.
    // Math.floor makes this a rounded number
    // the +1 will make it a number greater than 0. 
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

//Moving the snake
function move() {
    // spread opperator. Makes a copy of the head position.
    const head = { ...snake[0] };
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
    }
    // unshift adds the new position object to the array
    snake.unshift(head);
    // pop will remove the last position object from the array,
    // so as to not increase the size of the snake on each move. (in else statment)


    if (head.x == food.x && head.y == food.y) {
        food = generateFood();
        increaseSpeed();
        // clear past interval
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// start game Function
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

// listener for spacebar press to start game
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'space') ||
        (!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up'
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// change speed of snake when he eats the food. 
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];
    // checking for when the snake hits the wall
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        gameOver();
    }

    //checking for when the snake hits itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}
