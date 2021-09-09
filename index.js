//@ts-nocheck
const canvas = document.querySelector("#myCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// Defining a draw function
let dx = 2;
let dy = -2;
const ballRadius = 10;
const colorVar = ["red", "blue", "yellow", "pink", "white"];
let idx = 0;
const paddleHeight = 15;
const paddleWidth = 90;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let coolDown = false;
const debounceTime = 500;
let isStart = false;
let isPaused = false;
let x = canvas.width / 2;
let y = canvas.height - paddleHeight - ballRadius;

const brickRowCount = 4;
const brickColumnCount = 7;
const brickWidth = 50;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 45;
const brickOffsetLeft = 50;

const bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, visibilityStatus: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keypress", keyPressHandler);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBricks();
  drawBall(idx);
  collisionDetection();
  drawScore();
  if (isStart === true && isPaused === false) {
    if (y + dy < ballRadius) {
      dy = -dy;
      idx++;
      if (idx === colorVar.length) {
        idx = 0;
      }
    } else if (y + dy >= canvas.height - paddleHeight - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        if (!coolDown) {
          dy = -dy;
          startCoolDown();
        }
      } else if (y + dy > canvas.height - paddleHeight) {
        if (
          x + ballRadius >= paddleX &&
          x - ballRadius < paddleX + paddleWidth
        ) {
          if (!coolDown) {
            dy = -dy;
            dx = -dx;
            startCoolDown();
          }
        }
      }
    }
    if (y + dy > canvas.height - ballRadius) {
      paddleX = (canvas.width - paddleWidth) / 2;
      x = canvas.width / 2;
      y = canvas.height - paddleHeight - ballRadius;
      alert("GAME OVER");
      document.location.reload();
    }
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
      idx++;
      if (idx === colorVar.length) {
        idx = 0;
      }
    }
    x += dx;
    y += dy;
  }

  if (isPaused === false) {
    if (rightPressed) {
      if (isStart === false) x += 7;
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
        if (isStart === false) x = canvas.width - paddleWidth / 2;
      }
    } else if (leftPressed) {
      if (isStart === false) x -= 7;
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
        if (isStart === false) x = paddleWidth / 2;
      }
    }
  }

  if (isStart === false) {
    drawGameStart();
  }

  if (isPaused === true) {
    drawGamePaused();
  }
  requestAnimationFrame(draw);
}

function startCoolDown() {
  coolDown = true;
  setTimeout(function () {
    coolDown = false;
  }, debounceTime);
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].visibilityStatus === 1) {
        let brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawBall(i) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = colorVar[idx];
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      let brick = bricks[i][j];

      if (
        brick.visibilityStatus === 1 &&
        x >= brick.x &&
        x < brick.x + brickWidth &&
        y >= brick.y &&
        y < brick.y + brickHeight
      ) {
        dy = -dy;
        brick.visibilityStatus = 0;
        score++;
        if (score === brickColumnCount * brickRowCount) {
          alert("You Win, Click Ok to play again");
          paddleX = (canvas.width - paddleWidth) / 2;
          x = canvas.width / 2;
          y = canvas.height - paddleHeight - ballRadius;
          document.location.reload();
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawGameStart() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Press SpaceBar to Start", 80, canvas.height / 2);
}

function drawGamePaused() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Game Paused", 145, canvas.height / 2);
  ctx.fillText("Press Spacebar to resume", 60, canvas.height - 200);
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function keyPressHandler(e) {
  if (e.key == " " || e.key == "Spacebar") {
    if (isStart === false) {
      isStart = true;
      isPaused = true;
    }
    isPaused = !isPaused;
  }
}

requestAnimationFrame(draw);
