const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

let player;
let enemies;
let keys = {};
let score;
let gameState = "start"; // start / playing / gameover

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// 初始化遊戲
function initGame() {
    player = {
        x: 240,
        y: 240,
        size: 20,
        speed: 5
    };

    enemies = [];
    score = 0;
    gameState = "playing";
}

// 按鈕點擊
startBtn.onclick = () => {
    initGame();
};

function spawnEnemy() {
    enemies.push({
        x: Math.random() * 480,
        y: 0,
        size: 20,
        speed: 2 + Math.random() * 3
    });
}

function update() {
    if (gameState !== "playing") return;

    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    player.x = Math.max(0, Math.min(480, player.x));
    player.y = Math.max(0, Math.min(480, player.y));

    enemies.forEach(e => {
        e.y += e.speed;

        if (
            player.x < e.x + e.size &&
            player.x + player.size > e.x &&
            player.y < e.y + e.size &&
            player.y + player.size > e.y
        ) {
            gameState = "gameover";
        }
    });

    enemies = enemies.filter(e => e.y < 500);

    score++;

    if (Math.random() < 0.03) spawnEnemy();
}

function draw() {
    ctx.clearRect(0, 0, 500, 500);

    // 開始畫面
    if (gameState === "start") {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("按下開始遊戲", 140, 250);
        return;
    }

    // 玩家
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // 敵人
    ctx.fillStyle = "red";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));

    // 分數
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 10, 20);

    // 結束畫面
    if (gameState === "gameover") {
        ctx.fillStyle = "yellow";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 120, 230);

        ctx.font = "20px Arial";
        ctx.fillText("點擊開始重新遊戲", 150, 270);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();