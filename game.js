const mainMenu = document.querySelector(".main-menu");
const gameScreen = document.querySelector(".game-screen");
const chooseLevel = document.querySelector(".choose-level");

const playBtn = document.querySelector("#play-btn");
const chooseLevelBtn = document.querySelector("#select-level");
const backBtn = document.querySelector("#choose-level-back");

const textLives = document.querySelector("#live");
const textScore = document.querySelector("#score");

const gameBoard = document.querySelector(".game-board");
const paddle = document.querySelector(".paddle");


const paddleSpeed = 20;


const ball = document.querySelector(".ball");
let ballSpeedX = 1.5;
let ballSpeedY = -1.5;


const arrow = document.querySelector(".arrow");

let aimAngle = 0;
let aimDirection = 1;
let lastAimTime = 0;

const MAX_BALLS = 81;
const balls = [];


let score = 0;


let lives = 3;
let isMoving = false;
let isGameStart = false;
let isPause = false;

let paddleX = 0;
let ballX = 0;
let ballY = 0;


const bricks = [];
const supportItems = [];
const typeSupportItems = [
    {type: "life", chance: 10 },
    {type: "shield", chance: 45},
    {type: "multiball", chance: 45}
];

let isShieldActive = false;
let shieldElement = null;

let brickWithoutItem = 0;

const brickColors = {
    1: "#BBDEFB",
    2: "#64B5F6",
    3: "#2196F3",
    4: "#1976D2",
    5: "#0D47A1"
};


const finalScore = document.querySelector("#final-score");
const gameOver = document.querySelector(".game-over");

const againBtn = document.querySelectorAll(".again-btn");
const backToMenuBtn = document.querySelectorAll(".back-to-menu");


const winGame = document.querySelector(".win-game");
const winScore = document.querySelector("#win-score");
const nextLevelBtn = document.querySelectorAll(".nextLevel");


const pauseGame = document.querySelector(".pause-game");
const pauseScore = document.querySelector("#pause-score");
const continueBtn = document.querySelectorAll(".continue-btn");


playBtn.addEventListener("click", () => {
    mainMenu.style.display = "none";
    gameScreen.style.display = "flex";

    resetGame();

    createBrickLv1();

})

chooseLevelBtn.addEventListener("click", () => {
    mainMenu.style.display = "none";
    chooseLevel.style.display = "flex";
})

backBtn.addEventListener("click", () => {
    mainMenu.style.display = "flex";
    chooseLevel.style.display = "none";
})


againBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        resetGame();

        createBrickLv1()
    })
})


backToMenuBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        mainMenu.style.display = "flex";
        gameScreen.style.display = "none";
        gameOver.style.display = "none";
        winGame.style.display = "none";
        pauseGame.style.display = "none";

        isGameStart = false;
        isMoving = false;
        isPause = false;
    })
})


document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && isGameStart && !isPause) {
        isPause = true;
        pauseScore.textContent = score;

        pauseGame.style.display = "flex";
    }
})

continueBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        isPause = false;
        pauseGame.style.display = "none";

        if (isMoving){
            ballMoving();
        }
    })
})

// Thanh paddle
document.addEventListener("keydown", function (event) {
    if (!isGameStart ||isPause){
        return;
    }

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

        if (balls.length > 0) {
            balls[0].x = ballX;
        }
    }
} )

function updateAim(time) {
    const delta = lastAimTime ? Math.min((time - lastAimTime) / 1000, 0.05) : 0;
    lastAimTime = time;

    if (isGameStart && !isMoving && !isPause) {
        aimAngle += aimDirection * 90 * delta;

        if (aimAngle >= 60) {
            aimAngle = 60;
            aimDirection = -1;
        } else if (aimAngle <= -60) {
            aimAngle = -60;
            aimDirection = 1;
        }

        arrow.style.display = "block";
        arrow.style.left = ballX + "px";
        arrow.style.top = (ballY - 30) + "px";
        arrow.style.transform = `translateX(-50%) rotate(${aimAngle}deg)`;
    } else {
        arrow.style.display = "none";
    }

    requestAnimationFrame(updateAim);
}

requestAnimationFrame(updateAim);

function resetBallAndPaddle(){
    if (!ball.isConnected) {
        gameBoard.appendChild(ball);
    }

    paddleX = gameBoard.clientWidth / 2;
    paddle.style.left = paddleX + "px";

    ballX = gameBoard.clientWidth / 2;
    ballY = gameBoard.clientHeight - 35 - ball.offsetWidth / 2;

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    ballSpeedX = 1.5;
    ballSpeedY = -1.5;

    aimAngle = 0;
    aimDirection = 1;

    isMoving = false;
}

function resetGame(){
    lives = 3;
    score = 0;
    isPause = false;

    textLives.textContent = lives;
    textScore.textContent = score;

    gameOver.style.display = "none";
    winGame.style.display = "none";
    pauseGame.style.display = "none";

    bricks.forEach(brick => brick.remove());
    bricks.length = 0;

    brickWithoutItem = 0;
    supportItems.forEach(item => item.remove());
    supportItems.length = 0;

    resetBallAndPaddle();
    initBalls();

    isGameStart = true;
}

function initBalls() {
    balls.forEach(b => {
        if (b.element !== ball) b.element.remove();
    });

    balls.length = 0;

    if (!ball.isConnected) {
        gameBoard.appendChild(ball);
    }

    balls.push({
        element: ball,
        x: ballX,
        y: ballY,
        speedX: ballSpeedX,
        speedY: ballSpeedY
    });
}


function ballMoving() {
    if (!isGameStart || !isMoving || isPause) {
        return;
    }

    // Chuyển động của từng ball
    for (let j = balls.length - 1; j >= 0; j--) {
        const b = balls[j];

        b.x += b.speedX;
        b.y += b.speedY;

        const ballRadius = b.element.offsetWidth / 2;

        // Chạm tường
        if (b.x <= ballRadius || b.x >= gameBoard.clientWidth - ballRadius) {
            b.speedX = -b.speedX;
        }

        if (b.y <= ballRadius) {
            b.speedY = -b.speedY;
        }


        // Check shield
        if (isShieldActive && b.speedY > 0) {
            const shieldTop = shieldElement.offsetTop;

            if (b.y + ballRadius >= shieldTop) {
                b.y = shieldTop - ballRadius;
                b.speedY = -b.speedY;
                removeShield();
            }
        }



        // Check va chạm paddle
        const paddleLeft = paddleX - paddle.offsetWidth / 2;
        const paddleRight = paddleX + paddle.offsetWidth / 2;
        const paddleTop = paddle.offsetTop;
        const paddleBottom = paddle.offsetTop + paddle.offsetHeight;


        if (
            b.y + ballRadius >= paddleTop &&
            b.y - ballRadius <= paddleBottom &&
            b.x >= paddleLeft &&
            b.x <= paddleRight &&
            b.speedY > 0
        ) {
            b.y = paddleTop - ballRadius;
            b.speedY = -b.speedY;
        }


        // Check rớt khỏi game
        if (b.y - ballRadius > gameBoard.clientHeight) {
            b.element.remove();
            balls.splice(j, 1);
            continue;
        }




        // Va chạm brick và ramdom item
        for (let i = bricks.length - 1; i >= 0; i--) {
            const brick = bricks[i];

            const brickLeft = brick.offsetLeft;
            const brickTop = brick.offsetTop;
            const brickRight = brick.offsetLeft + brick.offsetWidth;
            const brickBottom = brick.offsetTop + brick.offsetHeight;

            const ballLeft = b.x - ballRadius;
            const ballRight = b.x + ballRadius;
            const ballTop = b.y - ballRadius;
            const ballBottom = b.y + ballRadius;

            const itemX = brickLeft + brick.offsetWidth / 2;
            const itemY = brickTop + brick.offsetHeight / 2;

            if (ballRight >= brickLeft && ballLeft <= brickRight && ballBottom >= brickTop && ballTop <= brickBottom) {
                brick.remove();
                bricks.splice(i, 1);

                score += 10;
                textScore.textContent = score;

                if (Math.random() < 0.15) {
                    createSupportItems(itemX, itemY, randomSupportItems());
                    brickWithoutItem = 0;
                } else {
                    brickWithoutItem++;

                    if (brickWithoutItem === 5) {
                        createSupportItems(itemX, itemY, randomSupportItems());
                        brickWithoutItem = 0;
                    }
                }

                const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
                const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);

                if (overlapX < overlapY) {
                    b.speedX = -b.speedX;
                } else {
                    b.speedY = -b.speedY;
                }
            }
        }

        b.element.style.left = b.x + "px";
        b.element.style.top = b.y + "px";
    }

    if (balls.length === 0) {
        lives--;
        textLives.textContent = lives;

        removeShield();

        supportItems.forEach(item => item.remove());
        supportItems.length = 0;

        if (lives <= 0) {
            isMoving = false;
            isGameStart = false;
            finalScore.textContent = score;
            gameOver.style.display = "flex";
            return;
        }


        resetBallAndPaddle();
        ball.style.display = "block";
        initBalls();
        return;
    }

    if (bricks.length === 0){
        isMoving = false;
        isGameStart = false;

        winScore.textContent = score;

        winGame.style.display = "flex";
        return;

    }

    itemMoving();
    checkItemCollision();

    requestAnimationFrame(ballMoving);
}

document.addEventListener("keydown", function (event) {
    if (event.key == " " && isGameStart && !isMoving && !isPause){
        event.preventDefault();

        const speed = Math.hypot(ballSpeedX, ballSpeedY);
        const rad = aimAngle * Math.PI / 180;

        balls[0].speedX = speed * Math.sin(rad);
        balls[0].speedY = -speed * Math.cos(rad);

        isMoving = true;

        arrow.style.display = "none";

        ballMoving();
    }
})





function createBrickLv1(){
    const brickRows = 8;
    const brickColumns = 6;
    const brickHeight = 15;
    const brickWidth = 75;
    const gapBrickHeight = 15;
    const gapBrickWidth = 100;

    const bricksTotalWidth = brickColumns * brickWidth + (brickColumns - 1) * gapBrickWidth;

    const brickStartX = (gameBoard.clientWidth - bricksTotalWidth) / 2;
    const brickStartY = 30;



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
}



function createSupportItems(x, y, typeItem) {
    const supportItem = document.createElement("div");
    supportItem.classList.add("support-item");

    supportItem.dataset.type = typeItem;
    if (typeItem === "life") {
        const img = document.createElement("img");
        img.src = "image/life-item.png";
        img.alt = "Life";
        supportItem.appendChild(img);
    } else if (typeItem === "shield") {
        const img = document.createElement("img");
        img.src = "image/shield-item.jpg";
        img.alt = "Shield";
        supportItem.appendChild(img);
    } else if (typeItem === "multiball") {
        const img = document.createElement("img");
        img.src = "image/item-multiball.png";
        img.alt = "MultiBall";
        supportItem.appendChild(img);
    }

    supportItem.style.left = x + "px";
    supportItem.style.top = y + "px";

    gameBoard.appendChild(supportItem);
    supportItems.push(supportItem);

}

function itemMoving() {
    supportItems.forEach(item => {
        let itemY = parseFloat(item.style.top);
        itemY += 1;
        item.style.top = itemY + "px";
    });
}


function checkItemCollision() {
    for (let i = supportItems.length - 1; i >= 0; i--) {
        const item = supportItems[i];

        const itemLeft = item.offsetLeft - item.offsetWidth / 2;
        const itemRight = item.offsetLeft + item.offsetWidth / 2;
        const itemTop = item.offsetTop - item.offsetHeight / 2;
        const itemBottom = item.offsetTop + item.offsetHeight / 2;

        const paddleLeft = paddleX - paddle.offsetWidth / 2;
        const paddleRight = paddleX + paddle.offsetWidth / 2;
        const paddleTop = paddle.offsetTop;
        const paddleBottom = paddleTop + paddle.offsetHeight;

        if (itemRight >= paddleLeft && itemLeft <= paddleRight &&
            itemBottom >= paddleTop && itemTop <= paddleBottom) {

            applySupportItems(item.dataset.type);

            item.remove();
            supportItems.splice(i, 1);
            continue;
        }

        if (itemTop > gameBoard.clientHeight) {
            item.remove();
            supportItems.splice(i, 1);
        }
    }
}

function randomSupportItems() {
    const random = Math.random() * 100;

    let sum = 0;

    for (const item of typeSupportItems) {
        sum += item.chance;

        if (random < sum) {
            return item.type;
        }

    }
}

function createShield(){
    if (isShieldActive){
        return;
    }

    const shield = document.createElement("div");
    shield.classList.add("shield");

    gameBoard.appendChild(shield);

    shieldElement = shield;
    isShieldActive = true;
}

function removeShield(){
    if (isShieldActive){
        shieldElement.remove();
    }

    shieldElement = null;
    isShieldActive = false;
}



function createMultiBall() {
    const currentBalls = [...balls];

    for (const b of currentBalls) {
        if (balls.length + 2 > MAX_BALLS) break;

        const angle = Math.PI / 6;

        for (const direction of [-1, 1]) {
            const rad = angle * direction;

            const newBall = b.element.cloneNode(true);
            newBall.removeAttribute("id");

            const speedX = b.speedX * Math.cos(rad) - b.speedY * Math.sin(rad);
            const speedY = b.speedX * Math.sin(rad) + b.speedY * Math.cos(rad);


            newBall.style.left = b.x + "px";
            newBall.style.top = b.y + "px";

            gameBoard.appendChild(newBall);

            balls.push({
                element: newBall,
                x: b.x,
                y: b.y,
                speedX: speedX,
                speedY: speedY
            });
        }
    }
}



function applySupportItems(typeItem) {
    if (typeItem === "life" && lives < 3) {
        lives++;
        textLives.textContent = lives;
    } else if (typeItem === "shield") {
        createShield();
    } else if (typeItem === "multiball"){
        createMultiBall();
    }
}




