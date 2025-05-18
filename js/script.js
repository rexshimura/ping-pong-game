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
let ballSpeedX = 5;
let ballSpeedY = 5;

let leftScore = 0;
let rightScore = 0;

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

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Reverse direction
}

function gameLoop() {
    // Clear the canvas
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPaddle(0, leftPaddleY, paddleWidth, paddleHeight);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    drawBall();
    drawScore();

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball goes out of bounds (scoring)
    if (ballX - ballRadius < 0) {
        rightScore++;
        resetBall();
    } else if (ballX + ballRadius > canvas.width) {
        leftScore++;
        resetBall();
    }

    // Basic AI for the right paddle (very simple tracking)
    if (ballY > rightPaddleY + paddleHeight / 2 && rightPaddleY + paddleHeight < canvas.height) {
        rightPaddleY += paddleSpeed;
    } else if (ballY < rightPaddleY + paddleHeight / 2 && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners for player 1 (left paddle) control
document.addEventListener('keydown', (e) => {
    if (e.key === 'w' && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    } else if (e.key === 's' && leftPaddleY + paddleHeight < canvas.height) {
        leftPaddleY += paddleSpeed;
    }
});

// Start the game loop
gameLoop();