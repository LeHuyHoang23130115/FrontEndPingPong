const mainMenu = document.querySelector(".main-menu");
const gameScreen = document.querySelector(".game-screen");
const chooseLevel = document.querySelector(".choose-level");

const playBtn = document.querySelector("#play-btn");

const chooseLevelBtn = document.querySelector("#select-level");
const levelBtns = document.querySelectorAll(".btn-level");


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

const MAX_BALLS =9;
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


const finalScore = document.querySelector("#final-score");
const gameOver = document.querySelector(".game-over");

const againBtn = document.querySelectorAll(".again-btn");
const backToMenuBtn = document.querySelectorAll(".back-to-menu");


const winGame = document.querySelector(".win-game");
const winScore = document.querySelector("#win-score");
const nextLevelBtn = document.querySelectorAll(".nextLevel");

let currentLevel = 1;

const pauseGame = document.querySelector(".pause-game");
const pauseScore = document.querySelector("#pause-score");
const continueBtn = document.querySelectorAll(".continue-btn");



const brickColors = {
    1: "#BBDEFB",
    2: "#64B5F6",
    3: "#2196F3",
    4: "#1976D2",
    5: "#0D47A1"
};

let lastHealTime = 0;
const HEAL_TIME = 8000;

let lastSpawnTime = 0;
const SPAWN_TIME = 6000;


function damageToBrick(brick) {
    let hp = Number(brick.dataset.hp || 1)
    hp--;

    if (hp <= 0) {
        return true;
    } else {
        brick.dataset.hp = String(hp);
        if (brick.classList.contains("normalBrick")){
            brick.style.backgroundColor = brickColors[hp];
        }

        return false;
    }

}




playBtn.addEventListener("click", () => {
    startLevel(1);

})

chooseLevelBtn.addEventListener("click", () => {
    mainMenu.style.display = "none";
    chooseLevel.style.display = "flex";
})


levelBtns.forEach((btn, index) =>{
    btn.addEventListener("click", () => {
        startLevel(index + 1);
    })
})




backBtn.addEventListener("click", () => {
    mainMenu.style.display = "flex";
    chooseLevel.style.display = "none";
})


nextLevelBtn.forEach((btn) =>{
    btn.addEventListener("click", () => {
        startLevel(currentLevel + 1);
    })
})

againBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        startLevel(currentLevel)
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


function  ballMoving() {
    if (!isGameStart || !isMoving || isPause) {
        return;
    }

    // Chuyển động của từng ball
    for (let j = balls.length - 1; j >= 0; j--) {
        const b = balls[j];

        const oldX = b.x;
        const oldY = b.y;

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

            const hitPosition = (b.x - paddleX) / (paddle.offsetWidth / 2);

            const hit = Math.max(-1, Math.min(1, hitPosition));

            const maxAngle = Math.PI / 3;

            let angle = hit * maxAngle;

            const speed = Math.hypot(b.speedX, b.speedY);

            b.speedX = speed * Math.sin(angle);
            b.speedY = -speed * Math.cos(angle);
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
                if (!brick.classList.contains('unbreakBrick')) {

                    const isDestroy = damageToBrick(brick);

                    if (brick.classList.contains("healingBrick") && !isDestroy) {
                        brick.classList.remove("hit");
                        void brick.offsetWidth;
                        brick.classList.add("hit");
                    }

                    if (brick.classList.contains("spawnerBrick") && !isDestroy) {
                        brick.classList.remove("hit");
                        void brick.offsetWidth;
                        brick.classList.add("hit");
                    }

                    if (isDestroy) {
                        brick.remove();
                        bricks.splice(i, 1);

                        if (brick.classList.contains("healingBrick")) {
                            score += 50;
                        } else if (brick.classList.contains("spawnerBrick")) {
                            score += 50;
                        } else {
                            score += 10 * Number(brick.dataset.maxHp || 1);
                        }

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
                    }
                }

                const fromLeft = oldX + ballRadius <= brickLeft;
                const fromRight = oldX - ballRadius >= brickRight;
                const fromTop = oldY + ballRadius <= brickTop;
                const fromBottom = oldY - ballRadius >= brickBottom;

                if (fromLeft && b.speedX > 0) {
                    b.x = brickLeft - ballRadius;
                    b.speedX = -b.speedX;
                } else if (fromRight && b.speedX < 0) {
                    b.x = brickRight + ballRadius;
                    b.speedX = -b.speedX;
                } else if (fromTop && b.speedY > 0) {
                    b.y = brickTop - ballRadius;
                    b.speedY = -b.speedY;
                } else if (fromBottom && b.speedY < 0) {
                    b.y = brickBottom + ballRadius;
                    b.speedY = -b.speedY;
                } else {

                    const overlapX = Math.min(ballRight - brickLeft, brickRight - ballLeft);
                    const overlapY = Math.min(ballBottom - brickTop, brickBottom - ballTop);

                    if (overlapX < overlapY) {
                        if (b.x < (brickLeft + brickRight) / 2) {
                            b.x = brickLeft - ballRadius;
                            b.speedX = -Math.abs(b.speedX);
                        } else {
                            b.x = brickRight + ballRadius;
                            b.speedX = Math.abs(b.speedX);
                        }
                    } else {
                        if (b.y < (brickTop + brickBottom) / 2) {
                            b.y = brickTop - ballRadius;
                            b.speedY = -Math.abs(b.speedY);
                        } else {
                            b.y = brickBottom + ballRadius;
                            b.speedY = Math.abs(b.speedY);
                        }
                    }
                }

                break;
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

    if (!bricks.some(brick => brick.classList.contains('normalBrick')
        || brick.classList.contains('healingBrick')
        || brick.classList.contains('spawnerBrick'))) {


        isMoving = false;
        isGameStart = false;

        winScore.textContent = score;

        winGame.style.display = "flex";
        return;

    }

    itemMoving();
    checkItemCollision();

    if (currentLevel === 3 || currentLevel === 4){
        const now = performance.now();

        if (now - lastHealTime >= HEAL_TIME){
            healHP();
            lastHealTime = now;
        }
    }


    if (currentLevel === 4){
        const now = performance.now();

        if (now - lastSpawnTime >= SPAWN_TIME){
            spawnBrick();
            lastSpawnTime = now;
        }
    }

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



function startLevel(level){
    currentLevel = level;

    mainMenu.style.display = "none";
    chooseLevel.style.display = "none";
    gameScreen.style.display = "flex";

    resetGame();
    removeShield();
    ball.style.display = "block";

    if (level === 1) {
        createBrickLv1();
    } else if (level === 2) {
        createBrickLv2();
    } else if (level === 3) {
        createBrickLv3();
        lastHealTime = performance.now();
    } else if (level === 4) {
        createBrickLv4();
        lastHealTime = performance.now();
        lastSpawnTime = performance.now();
    }
}



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



function createBrickLv2() {
    const brickRows = 8;
    const brickColumns = 10;
    const brickHeight = 15;
    const brickWidth = 75;
    const gapBrickHeight = 25;
    const gapBrickWidth = 25;

    const bricksTotalWidth = brickColumns * brickWidth + (brickColumns - 1) * gapBrickWidth;
    const bricksTotalHeight = brickRows * brickHeight + (brickRows - 1) * gapBrickHeight;
    const brickStartX = (gameBoard.clientWidth - bricksTotalWidth) / 2;
    const brickStartY = 60;

    function addBrick(x, y, type) {
        const brick = document.createElement("div");
        brick.classList.add("brick", type);

        brick.style.left = x + "px";
        brick.style.top = y + "px";

        gameBoard.appendChild(brick);
        bricks.push(brick);
    }

    // Tạo gạch thường
    for (let row = 0; row < brickRows; row++) {
        for (let col = 0; col < brickColumns; col++) {
            if (row >= 2 && row <= 5 && col >= 2 && col <= 7) continue;

            const x = brickStartX + col * (brickWidth + gapBrickWidth);
            const y = brickStartY + row * (brickHeight + gapBrickHeight);

            addBrick(x, y, "normalBrick");
        }
    }

    const size = 15;

    // Khung ở giữa
    function addUnbreakFrame(x, y, cols, rows) {
        // Cạnh trên và dưới
        for (let col = 0; col < cols; col++) {
            addBrick(x + col * size, y, "unbreakBrick");
            addBrick(x + col * size, y + (rows - 1) * size, "unbreakBrick");
        }

        // Cạnh trái và phải
        for (let row = 1; row < rows - 1; row++) {
            addBrick(x, y + row * size, "unbreakBrick");
            addBrick(x + (cols - 1) * size, y + row * size, "unbreakBrick");
        }
    }

    const startFrameCenterX = brickStartX + 2 * (brickWidth + gapBrickWidth);
    const startFrameCenterY = brickStartY + 2 * (brickHeight + gapBrickHeight);

    addUnbreakFrame(startFrameCenterX, startFrameCenterY, 38, 9);


    // 4 góc
    function addCorner(x, y, directionX, directionY) {
        for (let i = 0; i < 28; i++) {
            addBrick(x + i * size * directionX, y, "unbreakBrick");
        }

        for (let i = 1; i < 10; i++) {
            addBrick(x, y + i * size * directionY, "unbreakBrick");
        }
    }

    const leftX = brickStartX - 25;
    const rightX = brickStartX + bricksTotalWidth + 10;
    const topY = brickStartY - 25;
    const bottomY = brickStartY + bricksTotalHeight + 15;

    addCorner(leftX, topY, 1 , 1);
    addCorner(rightX, topY, -1 , 1);
    addCorner(leftX, bottomY, 1 , -1);
    addCorner(rightX, bottomY, -1 , -1);
}



function createBrickLv3() {
    const rows = 5;
    const cols = 5;
    const brickWidth = 75;
    const brickHeight = 15;
    const gapX = 10;
    const gapY = 15;
    const groupGap = 80;

    const groupWidth = cols * brickWidth + (cols - 1) * gapX;
    const totalWidth = groupWidth * 2 + groupGap;
    const startX = (gameBoard.clientWidth - totalWidth) / 2;
    const startY = 120;

    const arrayHP = [
        [1, 2, 3, 2, 1],
        [2, 1, 2, 1, 2],
        [3, 2, 5, 2, 3],
        [2, 1, 2, 1, 2],
        [1, 2, 3, 2, 1]
    ];

    for (let group = 0; group < 2; group++) {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const hp = arrayHP[row][col];

                const brick = document.createElement("div");
                brick.classList.add("brick");

                if (hp === 5) {
                    brick.classList.add("healingBrick");
                    brick.textContent = "+";
                } else {
                    brick.classList.add("normalBrick");
                    brick.style.backgroundColor = brickColors[hp];
                }

                brick.dataset.hp = String(hp === 5 ? 3 : hp);
                brick.dataset.maxHp = String(hp === 5 ? 3 : hp);

                brick.style.left = startX + group * (groupWidth + groupGap) + col * (brickWidth + gapX) + "px";
                brick.style.top = startY + row * (brickHeight + gapY) + "px";

                gameBoard.appendChild(brick);
                bricks.push(brick);
            }
        }
    }
}




function createBrickLv4(){
    const rows = 11;
    const cols = 11;
    const brickWidth = 75;
    const brickHeight = 15;
    const gapX = 10;
    const gapY = 15;

    const totalWidth = cols * brickWidth + (cols - 1) * gapX;
    const startX = (gameBoard.clientWidth - totalWidth) / 2;
    const startY = 70;

    const arrayHP = [
        [1, 2, 3, 1, 2, 3, 2, 1, 3, 2, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
        [1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [3, 0, 0, 0, 4, 5, 4, 0, 0, 0, 3],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2],
        [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [1, 2, 3, 1, 2, 3, 2, 1, 3, 2, 1]
    ];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {

            const hp = arrayHP[row][col];

            if (hp === 0) continue;

            const brick = document.createElement("div");
            brick.classList.add("brick");

            if (hp === 5) {
                brick.classList.add("healingBrick");
                brick.textContent = "+";
            } else if (hp === 4) {
                brick.classList.add("spawnerBrick");
                brick.textContent = "★";
            } else {
                brick.classList.add("normalBrick");
                brick.style.backgroundColor = brickColors[hp];
            }

            const brickHP = hp >=3 ? 3: hp;
            brick.dataset.hp = String(brickHP);
            brick.dataset.maxHp = String(brickHP);

            brick.style.left = startX + col * (brickWidth + gapX) + "px";
            brick.style.top = startY + row * (brickHeight + gapY) + "px";

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



function healHP(){
    const healingBricks = bricks.filter(brick => brick.classList.contains("healingBrick"));

    for (const healingBrick of healingBricks) {
        const nearBricks = bricks.filter(brick => {
            if (brick.classList.contains("normalBrick") || brick.classList.contains("spawnerBrick")) {

                const hp = Number(brick.dataset.hp);
                const maxHP = Number(brick.dataset.maxHp);

                const distanceX = Math.abs(brick.offsetLeft - healingBrick.offsetLeft);
                const distanceY = Math.abs(brick.offsetTop - healingBrick.offsetTop);


                return hp >= 1 && maxHP > 1 && hp < maxHP && distanceX <= 170 && distanceY <= 50;
            }


        })

        if (nearBricks.length === 0) continue;

        const random = Math.floor(Math.random() * nearBricks.length);
        const healedBrick = nearBricks[random];

        const newHP = Number(healedBrick.dataset.hp) + 1;
        healedBrick.dataset.hp = String(newHP);

        if (healedBrick.classList.contains("normalBrick")) {
            healedBrick.style.backgroundColor = brickColors[newHP];
        }


        healedBrick.classList.remove("healed");
        void healedBrick.offsetWidth;
        healedBrick.classList.add("healed");
    }


}


function spawnBrick() {
    const spawners = bricks.filter(brick => brick.classList.contains("spawnerBrick"));

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    for (const spawner of spawners) {
        const emptyPositions = [];

        for (const [row, col] of directions) {
            const x = spawner.offsetLeft + col * 85;
            const y = spawner.offsetTop + row * 30;

            const occupied = bricks.some(brick =>
                Math.abs(brick.offsetLeft - x) < 1 &&
                Math.abs(brick.offsetTop - y) < 1
            );

            if (!occupied && x >= 0 && y >= 0 &&
                x + 75 <= gameBoard.clientWidth &&
                y + 15 <= gameBoard.clientHeight) {
                emptyPositions.push({x, y});
            }
        }

        if (emptyPositions.length === 0) continue;

        const random = Math.floor(Math.random() * emptyPositions.length);
        const position = emptyPositions[random];

        const hp = Math.random() < 0.6 ? 1 : 2;

        const brick = document.createElement("div");
        brick.classList.add("brick", "normalBrick", "spawnedBrick");

        brick.dataset.hp = String(hp);
        brick.dataset.maxHp = String(hp);

        brick.style.backgroundColor = brickColors[hp];
        brick.style.left = position.x + "px";
        brick.style.top = position.y + "px";

        gameBoard.appendChild(brick);
        bricks.push(brick);

        spawner.classList.remove("spawning");
        void spawner.offsetWidth;
        spawner.classList.add("spawning");
    }
}



