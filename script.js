const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // size of one cell
const canvasSize = 400;

let snake, direction, food, score, game, highScore;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");

// Get high score from localStorage if exists
highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = "High Score: " + highScore;

function init() {
  snake = [{ x: 8 * box, y: 8 * box }];
  direction = "RIGHT";
  score = 0;
  scoreEl.innerText = "Score: " + score;
  food = generateFood();
  if (game) clearInterval(game);
  game = setInterval(draw, 150);
}

// Generate food at random position
function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

// Listen for key presses
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (key === 38 && direction !== "DOWN") direction = "UP";
  else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Collision detection
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let head = { ...snake[0] };

  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.innerText = "Score: " + score;
    food = generateFood();
  } else {
    snake.pop(); // remove tail if not eating
  }

  // Add new head
  snake.unshift(head);

  // Check collisions
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvasSize ||
    head.y >= canvasSize ||
    collision(head, snake.slice(1))
  ) {
    clearInterval(game);
    alert("Game Over! Your score: " + score);

    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreEl.innerText = "High Score: " + highScore;
    }
  }
}

// Restart button
restartBtn.addEventListener("click", () => {
  init();
});

// Start the game
init();
