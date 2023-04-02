let ctx;
let snake;
let food;
let score = 0;

const TILE = 16
const WIDTH = 400
const HEIGHT = 400
const INTERVAL = 80

window.onload = function () {
    const canvas = document.getElementById("canvas")
    canvas.width = WIDTH
    canvas.height = HEIGHT

    ctx = canvas.getContext("2d")

    spawnSnake()
    spawnFood()

    document.addEventListener("keydown", handleKeyPress)

    setInterval(gameLoop, INTERVAL)
}

function gameLoop() {
    update()
    draw()
}

function spawnSnake() {
    snake = {
        body: [
            { x: 5 * TILE, y: 5 * TILE },
            { x: 4 * TILE, y: 5 * TILE },
            { x: 3 * TILE, y: 5 * TILE },
            { x: 2 * TILE, y: 5 * TILE },
        ],
        direction: "right",
    }
}

function spawnFood() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * (WIDTH / TILE)) * TILE;
        foodY = Math.floor(Math.random() * (HEIGHT / TILE)) * TILE;
    } while (isSnakeBody(foodX, foodY));

    food = { x: foodX, y: foodY };
}

function isSnakeBody(x, y) {
    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[i].x === x && snake.body[i].y === y) {
            return true;
        }
    }

    return false;
}

function handleKeyPress(e) {
    switch (e.key) {
        case "ArrowLeft":
            if (snake.direction !== "right") {
                snake.direction = "left"
            }
            break

        case "ArrowUp":
            if (snake.direction !== "down") {
                snake.direction = "up"
            }
            break

        case "ArrowRight":
            if (snake.direction !== "left") {
                snake.direction = "right"
            }
            break

        case "ArrowDown":
            if (snake.direction !== "up") {
                snake.direction = "down"
            }
            break
    }
}

function update() {
    // Move the snake
    const head = { x: snake.body[0].x, y: snake.body[0].y }

    switch (snake.direction) {
        case "up":
            head.y -= TILE;
            break
        case "down":
            head.y += TILE;
            break
        case "left":
            head.x -= TILE;
            break
        case "right":
            head.x += TILE;
            break
    }

    // Check for collision with walls
    if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
        endGame()
    }

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++
        document.getElementById("score").innerHTML = "Score: " + score
        spawnFood()
    } else {
        snake.body.pop()
    }
    
    if (isSnakeBody(head.x, head.y)) {
        endGame()
    }

    // Add the head segment
    snake.body.splice(0, 0, head)
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    // Draw snake
    ctx.fillStyle = "#10b981"
    for (let i = 0; i < snake.body.length; i++) {
        ctx.fillRect(snake.body[i].x, snake.body[i].y, TILE, TILE)
    }

    // Draw food
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(food.x, food.y, TILE, TILE)
}

function endGame() {
    clearInterval(INTERVAL);
    isGameRunning = false;

    document.getElementById("game-container").classList.add("hidden")
    document.getElementById("end-screen").classList.remove("hidden")
    document.getElementById("final-score").textContent = score;
    
    document.getElementById("restart-btn").addEventListener("click", function () {
        location.reload()
    })
}