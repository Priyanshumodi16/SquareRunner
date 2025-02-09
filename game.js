// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth > 600 ? 400 : window.innerWidth - 20;
canvas.height = 500;

// Player
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5
};

// Obstacles
let obstacles = [];
let obstacleSpeed = 3;
let score = 0;
let gameRunning = true;

// Controls
let leftPressed = false;
let rightPressed = false;

// Keyboard Controls
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = true;
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") leftPressed = false;
    if (e.key === "ArrowRight" || e.key === "d") rightPressed = false;
});

// Mobile Controls
document.getElementById("leftBtn").addEventListener("touchstart", () => (leftPressed = true));
document.getElementById("leftBtn").addEventListener("touchend", () => (leftPressed = false));

document.getElementById("rightBtn").addEventListener("touchstart", () => (rightPressed = true));
document.getElementById("rightBtn").addEventListener("touchend", () => (rightPressed = false));

// Move Player
function movePlayer() {
    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;

    // Keep inside canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Spawn Obstacles
function spawnObstacle() {
    const obstacle = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50
    };
    obstacles.push(obstacle);
}

// Check Collision
function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Update Game
function update() {
    if (!gameRunning) return;

    movePlayer();

    // Move Obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacleSpeed;
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            document.getElementById("score").innerText = "Score: " + score;
        }

        if (checkCollision(player, obstacle)) {
            gameRunning = false;
            alert("Game Over! Your Score: " + score);
            location.reload();
        }
    });

    // Increase difficulty
    if (score % 10 === 0 && obstacleSpeed < 10) obstacleSpeed += 0.02;
}

// Draw Everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Obstacles
    ctx.fillStyle = "red";
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Game Loop
function gameLoop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

// Start Game
setInterval(spawnObstacle, 1000);
gameLoop();
