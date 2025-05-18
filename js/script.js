const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 100;
const paddleWidth = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 5;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 4;
let ballSpeedY = 4;
let gameStarted = false;
let countdownTime = 3.5;
let countdownInterval;
let ballSpeedMultiplier = 1;
const speedIncrement = 0.5;
let currentBallSpeed = 4;
let leftScore = 0;
let rightScore = 0;
const winScore = 5; // Score required to win

// Keep track of which keys are currently pressed
const keysPressed = {};

function drawPaddle(x, y, width, height) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, width, height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Player 1: ${leftScore}`, 50, 30);
    ctx.fillText(`Player 2: ${rightScore}`, canvas.width - 150, 30);
}

function drawCountdown() {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(countdownTime.toFixed(1), ballX, ballY - 30);
    ctx.textAlign = 'start';
}

function drawBallSpeed() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillText(`Speed: ${currentBallSpeed.toFixed(2)}`, canvas.width / 2, 20);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 4;
    ballSpeedY = 4;
    gameStarted = false;
    countdownTime = 3.5;
    clearInterval(countdownInterval);
    ballSpeedMultiplier = 1;
    currentBallSpeed = 4;
}

function startGame() {
    gameStarted = true;
    ballSpeedX = Math.sign(Math.random() - 0.5) * currentBallSpeed;
    ballSpeedY = Math.sign(Math.random() - 0.5) * currentBallSpeed;
    clearInterval(countdownInterval);
}

function updateLeftPaddle() {
    if (keysPressed['w'] && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    }
    if (keysPressed['s'] && leftPaddleY + paddleHeight < canvas.height) {
        leftPaddleY += paddleSpeed;
    }
}

function showWinnerModal(winner) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.textAlign = 'center';
    modalContent.style.fontSize = '24px';

    const message = document.createElement('p');
    message.textContent = `${winner} wins!`;

    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New Game';
    newGameButton.style.padding = '10px 20px';
    newGameButton.style.fontSize = '16px';
    newGameButton.style.backgroundColor = '#4CAF50';
    newGameButton.style.color = 'white';
    newGameButton.style.border = 'none';
    newGameButton.style.borderRadius = '5px';
    newGameButton.style.cursor = 'pointer';
    newGameButton.onclick = () => {
        // Reset game state
        leftScore = 0;
        rightScore = 0;
        resetBall();
        gameStarted = false; // Ensure game starts with countdown
        countdownTime = 3.5;
        document.body.removeChild(modal); // Remove modal
        gameLoop(); // Restart the game loop
    };

    modalContent.appendChild(message);
    modalContent.appendChild(newGameButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function gameLoop() {
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateLeftPaddle();
    drawPaddle(0, leftPaddleY, paddleWidth, paddleHeight);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    drawBall();
    drawScore();
    drawBallSpeed();

    if (!gameStarted) {
        drawCountdown();
        if (countdownTime > 0) {
            if (!countdownInterval) {
                countdownInterval = setInterval(() => {
                    countdownTime -= 0.1;
                    if (countdownTime <= 0) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                        startGame();
                    }
                }, 100);
            }
        }
    } else {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedMultiplier += speedIncrement;
            currentBallSpeed += speedIncrement;
            ballSpeedX = Math.sign(ballSpeedX) * currentBallSpeed;
        }
        if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedMultiplier += speedIncrement;
            currentBallSpeed += speedIncrement;
            ballSpeedX = Math.sign(ballSpeedX) * currentBallSpeed;
        }

        if (ballX - ballRadius < 0) {
            rightScore++;
            resetBall();
            if (rightScore >= winScore) {
                showWinnerModal('Player 2');
                return; // Stop game loop
            }
        } else if (ballX + ballRadius > canvas.width) {
            leftScore++;
            resetBall();
            if (leftScore >= winScore) {
                showWinnerModal('Player 1');
                return; // Stop game loop
            }
        }

        if (ballY > rightPaddleY + paddleHeight / 2 && rightPaddleY + paddleHeight < canvas.height) {
            rightPaddleY += paddleSpeed;
        } else if (ballY < rightPaddleY + paddleHeight / 2 && rightPaddleY > 0) {
            rightPaddleY -= paddleSpeed;
        }
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    delete keysPressed[e.key];
});

gameLoop();
