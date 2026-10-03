const mainMenu = document.querySelector(".main-menu");
const chooseLevel = document.querySelector(".choose-level");

const chooseLevelBtn = document.querySelector("#select-level");
const backBtn = document.querySelector("#choose-level-back");

const textLives = document.querySelector("#textLives");

const gameBoard = document.querySelector(".game-board");
const paddle = document.querySelector(".paddle");

let paddleX = gameBoard.clientWidth / 2;
const paddleSpeed = 20;


const ball = document.querySelector(".ball");
let ballSpeedX = 1.5;
let ballSpeedY = -1.5;



let lives = 3;
let isMoving = false;


const brickColors = {
    1: "#BBDEFB",
    2: "#64B5F6",
    3: "#2196F3",
    4: "#1976D2",
    5: "#0D47A1"
};

const brickRows = 8;
const brickColumns = 6;
const brickHeight = 15;
const brickWidth = 75;
const gapBrickHeight = 15;
const gapBrickWidth = 100;

const bricksTotalWidth = brickColumns * brickWidth + (brickColumns - 1) * gapBrickWidth;

const brickStartX = (gameBoard.clientWidth - bricksTotalWidth) / 2;
const brickStartY = 30;


//Các nút ở giao diện ban đầu
chooseLevelBtn.addEventListener("click", () => {
    mainMenu.style.display = "none";
    chooseLevel.style.display = "flex";
})

backBtn.addEventListener("click", () => {
    mainMenu.style.display = "flex";
    chooseLevel.style.display = "none";
})


// Thanh paddle
paddle.style.left = paddleX + "px";
document.addEventListener("keydown", function (event) {
    if (event.key == "ArrowLeft" || event.key.toLowerCase() == "a"){
        paddleX -= paddleSpeed;
    }
    if (event.key == "ArrowRight" || event.key.toLowerCase() == "d"){
        paddleX += paddleSpeed;
    }

    if (paddleX < paddle.offsetWidth / 2){
        paddleX = paddle.offsetWidth / 2;
    }

    const maxPaddleX = gameBoard.clientWidth - paddle.offsetWidth / 2;
    if (paddleX > maxPaddleX){
        paddleX = maxPaddleX;
    }

    paddle.style.left = paddleX + "px";

    if (!isMoving) {
        ballX = paddleX;
        ball.style.left = ballX + "px";
    }
} )


// Ball
let ballX = gameBoard.clientWidth / 2;
let ballY = gameBoard.clientHeight - 35 - ball.offsetWidth / 2;

ball.style.left = ballX + "px";
ball.style.top = ballY + "px";

function ballMoving(){
    if (!isMoving){
        return;
    }
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    const ballRadius = ball.offsetWidth / 2;

    if (ballX <= ballRadius || ballX >= gameBoard.clientWidth - ballRadius) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY <= ballRadius) {
        ballSpeedY = -ballSpeedY;
    }

    const paddleLeft = paddleX - paddle.offsetWidth / 2;
    const paddleRight = paddleX + paddle.offsetWidth / 2;
    const paddleTop = paddle.offsetTop;
    const paddleBottom =  paddle.offsetTop + paddle.offsetHeight;


    if (
        ballY + ballRadius >= paddleTop &&
        ballY - ballRadius <= paddleBottom &&
        ballX >= paddleLeft &&
        ballX <= paddleRight &&
        ballSpeedY > 0
    ) {
        ballSpeedY = -ballSpeedY;
    }


    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    if (ballY > gameBoard.clientHeight){
        lives--;
        textLives.textContent = lives;

        isMoving = false;

        paddleX = gameBoard.clientWidth / 2;
        paddle.style.left = paddleX + "px";

        ballX = gameBoard.clientWidth / 2;
        ballY = gameBoard.clientHeight - 35 - ball.offsetWidth / 2;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";


        ballSpeedX = 1.5;
        ballSpeedY = -1.5;

    }

    for (let i = bricks.length - 1; i >= 0; i--) {
        const brick = bricks[i];

        const brickLeft = brick.offsetLeft;
        const brickTop = brick.offsetTop;
        const brickRight = brick.offsetLeft + brick.offsetWidth;
        const brickBottom = brick.offsetTop + brick.offsetHeight;

        const ballLeft = ballX - ballRadius;
        const ballRight = ballX + ballRadius;
        const ballTop = ballY - ballRadius;
        const ballBottom = ballY + ballRadius;

        if (ballRight >= brickLeft && ballLeft <= brickRight && ballBottom >= brickTop && ballTop <= brickBottom) {
            brick.remove();
            bricks.splice(i, 1);

            const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
            const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);

            if (overlapX < overlapY) {
                ballSpeedX = -ballSpeedX;
            } else {
                ballSpeedY = -ballSpeedY;
            }
        }
    }

    requestAnimationFrame(ballMoving);
}

document.addEventListener("keydown", function (event) {
    if (event.key == " " && !isMoving){
        isMoving = true;
        ballMoving();
    }
})

// Tạo gạch lv0

const bricks = [];

for (let row = 0; row < brickRows; row++) {
    for (let col = 0; col < brickColumns; col++) {
        const brick = document.createElement("div");
        brick.classList.add("brick", "normalBrick");

        const brickX = brickStartX + col * (brickWidth + gapBrickWidth);
        const brickY = brickStartY + row * (brickHeight + gapBrickHeight);

        brick.style.left = brickX + "px";
        brick.style.top = brickY + "px";

        gameBoard.appendChild(brick);
        bricks.push(brick);
    }
}




