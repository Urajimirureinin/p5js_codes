let ballRadius = 5;
let myMisileX;
let myMisileY;
let enemyMisileX = -10;
let enemyMisileY = 0;
let enemyMisileDy = 2;
let enemyMisileExist = false;
let startFlag = true;
let hitStatus = true;
let myMisileDy = -5;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX;
let mouseClicked = false;
let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 45;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;
let bricks = [];
let moveCount = 0;
let rightFlag = 1;

function setup() {
  createCanvas(480, 320);
  myMisileX = width / 2;
  myMisileY = height - 30;
  paddleX = (width - paddleWidth) / 2;
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, misile: 0 };
    }
  }
}

function draw() {
  background(220);
  drawBricks();
  drawEnemyMisile();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  enemyMisileY += enemyMisileDy + 0.1 * moveCount;
  if (enemyMisileY > height) {
    enemyMisileExist = false;
    hitStatus = true;
  } else {
    enemyMisileExist = true;
  }

  if (hitStatus) {
    if (enemyMisileY >= height - ballRadius) {
      if (enemyMisileX > paddleX && enemyMisileX < paddleX + paddleWidth) {
        lives--;
        hitStatus = false;
        if (!lives) {
          noLoop();
          alert("GAME OVER");
        }
      }
    }
  }

  if (mouseClicked) {
    drawMyMisile();
    myMisileY += myMisileDy;
    if (myMisileY <= 0) {
      mouseClicked = false;
      myMisileY = height - 30;
    }
  }

  if (
    myMisileY > enemyMisileY - ballRadius &&
    enemyMisileY + ballRadius > myMisileY
  ) {
    if (
      myMisileX > enemyMisileX - ballRadius * 2 &&
      enemyMisileX + ballRadius * 2 > myMisileX
    ) {
      console.log("MISILE同士がhit");
      enemyMisileExist = false;
      mouseClicked = false;
      myMisileY = height - 30;
    }
  }

  if (frameCount % 60 === 0) {
    updateEnemyPosition();
  }
}

function mouseMoved() {
  let relativeX = mouseX;
  if (relativeX > 0 && relativeX < width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function mousePressed() {
  if (!mouseClicked) {
    myMisileX = mouseX;
    mouseClicked = true;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          myMisileX > b.x &&
          myMisileX < b.x + brickWidth &&
          myMisileY > b.y &&
          myMisileY < b.y + brickHeight
        ) {
          mouseClicked = false;
          myMisileY = height - 30;
          b.status = 0;
          score++;
          console.log("敵にhit");
          if (score == brickRowCount * brickColumnCount) {
            noLoop();
            alert("You win, congratulations!");
          }
        }
      }
    }
  }
}

function drawMyMisile() {
  fill("#ff69b4");
  ellipse(myMisileX, myMisileY, ballRadius * 2);
}

function drawEnemyMisile() {
  fill("#0095DD");
  ellipse(enemyMisileX, enemyMisileY, ballRadius * 2);
}

function drawPaddle() {
  fill("#ff69b4");
  rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (startFlag) {
          b.x = r * (brickWidth + brickPadding) + brickOffsetLeft;
          b.y = c * (brickHeight + brickPadding) + brickOffsetTop;
        }
        fill("#0095DD");
        rect(b.x, b.y, brickWidth, brickHeight);
      }
    }
  }
  startFlag = false;
}

function drawScore() {
  fill("#0095DD");
  textSize(16);
  text(`Score: ${score}`, 8, 20);
}

function drawLives() {
  fill("#0095DD");
  textSize(16);
  text(`Lives: ${lives}`, width - 65, 20);
}

function updateEnemyPosition() {
  let moveX = 5;
  let moveY = 0;
  if (moveCount > 75) {
    noLoop();
    alert("GAME OVER");
  }
  if (moveCount % 10 === 5) {
    moveX = 0;
    moveY = 20;
    rightFlag = -rightFlag;
  } else {
    moveX = rightFlag * 5;
  }
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].x += moveX;
      bricks[c][r].y += moveY;
    }
  }
  moveCount++;
}
