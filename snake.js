let ctx;
let snake;
let food;
let score;
let interval_id;

const TILE = 32
const INTERVAL = 60

window.onload = function () {
    const canvas = document.getElementById("canvas")
    canvas.width = Math.floor(window.innerWidth / TILE) * TILE
    canvas.height = Math.floor(window.innerHeight / TILE) * TILE
    
    ctx = canvas.getContext("2d")
    
    document.getElementById("restart-btn").addEventListener("click", init)
    document.addEventListener("keydown", handleKeyPress)
}

function init() {
    score = 0

    spawnSnake()
    spawnFood()

    interval_id = setInterval(gameLoop, INTERVAL)

    document.getElementById("title-screen").classList.add("hidden")
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
        foodX = Math.floor(Math.random() * (canvas.width / TILE)) * TILE;
        foodY = Math.floor(Math.random() * (canvas.height / TILE)) * TILE;
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

    head.x = (head.x + canvas.width) % canvas.width
    head.y = (head.y + canvas.height) % canvas.height

    if (head.x === food.x && head.y === food.y) {
        spawnFood()
        score++
    } else {
        snake.body.pop()
    }

    if (isSnakeBody(head.x, head.y)) {
        endGame()
        return
    }

    snake.body.splice(0, 0, head)
    document.getElementById("score").innerHTML = score
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#10b981"
    for (let i = 0; i < snake.body.length; i++) {
        ctx.fillRect(snake.body[i].x, snake.body[i].y, TILE, TILE)
    }

    ctx.fillStyle = "#ef4444"
    ctx.fillRect(food.x, food.y, TILE, TILE)
}

function endGame() {
    clearInterval(interval_id);

    const percentage = (snake.body.length / (canvas.width * canvas.height) * 100).toFixed(3)

    document.getElementById("title-screen").classList.remove("hidden")
    document.getElementById("final-score").hidden = false
    document.getElementById("final-score").innerHTML = `Score: ${score} (${percentage}%)`;
}