//@ts-nocheck
const canvas = document.querySelector("#myCanvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// ctx.beginPath();
// ctx.arc(240, 60, 20, 0, Math.PI * 2, false);
// ctx.rect(20, 40, 50, 50);
// ctx.rect(130, 90, 100, 50);
// ctx.strokeStyle = "rgba(0,0,255,0.5)"
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.stroke()
// ctx.closePath();

// All instructions must be between beginPath and closePath
// We are drawing a rect.
// With a red color
// rectangle is placed 20 px from left
// 40px from top, 50px wide and 50px height

// Defining a draw function
let x = canvas.width / 2;
let y = canvas.height - 60;
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

const brickRowCount = 4;
const brickColumnCount = 4;
const brickWidth = 90;
const brickHeight = 30;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 50;

const bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0 };
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBricks();
  drawBall(idx);
  if (y + dy < ballRadius) {
    dy = -dy;
    idx++;
    if (idx === colorVar.length) {
      idx = 0;
    }
  } else if (y + dy > canvas.height - paddleHeight - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
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

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
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

let interval = setInterval(draw, 10);
