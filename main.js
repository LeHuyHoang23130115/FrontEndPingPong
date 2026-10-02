const mainMenu = document.querySelector(".main-menu");
const chooseLevel = document.querySelector(".choose-level");

const chooseLevelBtn = document.querySelector("#select-level");
const backBtn = document.querySelector("#choose-level-back");


const gameBoard = document.querySelector(".game-board");
const paddle = document.querySelector(".paddle");

let paddleX = gameBoard.clientWidth / 2;
const paddleSpeed = 20;


const ball = document.querySelector(".ball");
let ballSpeedX = 2;
let ballSpeedY = -2;



let lives = 3;
let isMoving = false;


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


    if (
        ballY + ballRadius >= paddleTop &&
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

        isMoving = false;

        paddleX = gameBoard.clientWidth / 2;
        paddle.style.left = paddleX + "px";

        ballX = gameBoard.clientWidth / 2;
        ballY = gameBoard.clientHeight - 35 - ball.offsetWidth / 2;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";


        ballSpeedX = 2;
        ballSpeedY = -2;

    }

    requestAnimationFrame(ballMoving);
}

document.addEventListener("keydown", function (event) {
    if (event.key == " " && !isMoving){
        isMoving = true;
        ballMoving();
    }
})