// Boot sequence
const bootLog = document.getElementById("boot-log");
const bootScreen = document.getElementById("boot-screen");
const desktop = document.getElementById("desktop");
const shutdownScreen = document.getElementById("shutdown-screen");

const bootLines = [
  "DexOS BIOS v1.0",
  "Initializing hardware...",
  "Loading kernel modules...",
  "Checking memory... OK",
  "Detecting devices... OK",
  "Boot device: GITHUB-PAGES",
  "Starting DexOS kernel...",
  "Launching DexOS desktop..."
];

async function typeBootLine(line, delay = 40) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      bootLog.textContent += line[i];
      i++;
      if (i >= line.length) {
        clearInterval(interval);
        bootLog.textContent += "\n";
        resolve();
      }
    }, delay);
  });
}

async function runBootSequence() {
  for (const line of bootLines) {
    await typeBootLine(line);
    await new Promise((r) => setTimeout(r, 200));
  }
  await new Promise((r) => setTimeout(r, 500));
  bootScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
}

runBootSequence();

// Clock
const clockEl = document.getElementById("clock");
function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Window controls
function openWindow(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeWindow(id) {
  document.getElementById(id).classList.add("hidden");
}

// Browser
function loadBrowserUrl() {
  const input = document.getElementById("browser-url");
  const frame = document.getElementById("browser-frame");
  let url = input.value.trim();
  if (!url) return;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  frame.src = url;
}

// Shutdown
function shutdownDexOS() {
  desktop.classList.add("hidden");
  shutdownScreen.classList.remove("hidden");
  setTimeout(() => {
    alert("DexOS has shut down. Please restart your iPad manually.");
  }, 2000);
}

// Snake game
const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");
const gridSize = 15;
let snake, direction, food, snakeInterval;

function resetSnakeGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  placeFood();
  if (snakeInterval) clearInterval(snakeInterval);
  snakeInterval = setInterval(gameLoop, 120);
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

function gameLoop() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Wrap around edges
  if (head.x < 0) head.x = canvas.width / gridSize - 1;
  if (head.x >= canvas.width / gridSize) head.x = 0;
  if (head.y < 0) head.y = canvas.height / gridSize - 1;
  if (head.y >= canvas.height / gridSize) head.y = 0;

  // Check collision with self
  if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
    resetSnakeGame();
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  snake.forEach((seg) => {
    ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize - 1, gridSize - 1);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

// Start snake when window is opened
document.getElementById("snake-window").addEventListener("transitionend", () => {
  // optional hook if you style with transitions
});

document.getElementById("snake-window").addEventListener("click", () => {
  if (!snakeInterval) resetSnakeGame();
});

// Also start when opened via icon
const originalOpenWindow = openWindow;
openWindow = function (id) {
  originalOpenWindow(id);
  if (id === "snake-window") {
    resetSnakeGame();
  }
};

// Keyboard controls
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 1) break;
      direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === -1) break;
      direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 1) break;
      direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === -1) break;
      direction = { x: 1, y: 0 };
      break;
  }
});
