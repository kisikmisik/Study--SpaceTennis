// find the canvas and determine some usable variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let playing = true; // while this true, animation continues

const animationTime = 10;
let winPoints = 5 // determine score to win or lose 
let botSpeed = 3; // bot difficulty. 6 is hard, 4 is medium, 3 is easy
let yourScore = 0;
let enemyScore = 0;

let width = canvas.width;
let height = canvas.height;
const borderWidth = 15;
const blockWidth = 80;

//draw canvas and borders
let drawCanvas = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, borderWidth, height);
    ctx.fillRect(width - borderWidth, 0, borderWidth, height);
};

// draw a simple circle
let circle = (x, y, radius, isFilled) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (isFilled) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

// function, that shows some message and stops animation
let checkResult = message => {
    playing = false;
    ctx.font = "20px Courier";
    ctx.baseLine = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(message, width / 2, height / 2);
};

// draw current score 
let drawScore = () => {
    ctx.font = "25px Courier";
    ctx.baseLine = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText("Ты: " + yourScore, 50, 100);
    ctx.fillText("Твоя старость: " + enemyScore, 50, 150);
};

// artifical intelligence, bot block listents to the x position ob ball and moves to it
let botMove = () => {
    if (player2.x > ball.x) {
        if (player2.x - ball.x < 20) {
            player2.x -= 1; 
        } else {
            player2.x -= botSpeed;
        }       
    } else if (player2.x < ball.x) {
        if (ball.x - player2.x < 20) {
            player2.x += 2; 
        } else {
            player2.x += botSpeed;
        }
    } 
};

// reset game to start position
let gameReturn = () => {
    playing = true;
    ball.x = width / 2;
    ball.y = height / 2;
    ball.xShift = 0.1;
    ball.speed = 4;
    gameAnimation(); 
};

//check if somebody is win
let checkWinner = () => {
    if (yourScore === winPoints) {
        checkResult("WIN");
        showPrizePopup()
    } else if (enemyScore === winPoints) {
        checkResult("Проебал, получается. Перезагружай страницу :(");
    }
};

showPrizePopup = () => {
    const e = document.createElement('div');
    e.classList.add('prize-popup')
    e.innerHTML = 
    `<p>Поздравляю, ЕПТА. У тебя получилось выиграть самого легкого бота. <br> Забирай свой подарок. С Днем Старения!</p>
       <img src="qr-code.jpg" width="200" height="200"> `;
    document.body.appendChild(e);
}
    
// ball constructor
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 4;
        this.yShift = 1;
        this.xShift = 0;
    }

// draw ball
    draw() {
        ctx.fillStyle = "white";
        circle(this.x, this.y, 7, true);
    }

// checks
    checkBlockCollision() {
        let isOutBottom = this.y >= height - 25; //25 is player's height + padding
        let isOutTop = this.y <= 25;
        let isCollidedBottom = this.x >= player1.x - blockWidth / 1.6 && this.x <= player1.x + blockWidth / 1.6;
        let isCollidedTop = this.x >= player2.x - blockWidth / 1.6 && this.x <= player2.x + blockWidth / 1.6;

        // updates game points when ball is out of canvas and shows afterscore message using Promise
        let updateScore = (message) => new Promise((resolve, reject) => {
            setTimeout(() => {
                checkResult(message);
                resolve();
            }, 1)
        });

        if (this.y < 0) {
            updateScore("ОЧКО!").then(() => {
                yourScore++;
                setTimeout(() => {
                    gameReturn();
                }, 2000)
            })
             
        } else if (this.y > height) {
            const looseMsgs = [
                "тупо лох, проебал очко",
                "бля, проебал очело",
                "8=====D"
            ]
            updateScore(looseMsgs[Math.floor(Math.random() * 2)]).then(() => {
                enemyScore++;
                setTimeout(() => {
                    gameReturn();
                }, 2000)
            })
        };

        if ((isOutBottom && isCollidedBottom) || (isOutTop && isCollidedTop)) {
            return true;
        } else {
            return false;
        };
    }

    move() {
        this.x += this.speed * this.xShift;
        this.y += this.speed * this.yShift;

        //checks collission with walls and player
        if(this.checkBlockCollision()) {
            this.yShift = -(this.yShift);
            this.xShift += Math.random() - 0.5;
            this.speed += 0.5;
        }

        if(this.x >= width - borderWidth || this.x <= borderWidth) {
            this.xShift = -(this.xShift);
        }
    }
};

// block constructor
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x - blockWidth / 2, this.y, blockWidth, 20);
    }
};

//update block position according to the mousemove event
let updatePosition = mouse => {
    let docWidth = window.innerWidth;
    let currentMousePercent = mouse / docWidth * 100;
    let oneProcentCanvas = width / 100;
    let currentBlockPosition = oneProcentCanvas * currentMousePercent;
    player1.x = currentBlockPosition;

}

// mousemove event handler
document.addEventListener("mousemove", (evt) => {
    updatePosition(evt.clientX);
})

// all animation process
let ball = new Ball(width / 2, height / 2);
let player1 = new Player(width / 2, height - 25);
let player2 = new Player(width / 2, 5);

let gameAnimation = () => {
    if (playing) {
        ctx.clearRect(0, 0, width, height);
        drawCanvas();
        ball.draw();
        ball.move();
        player1.draw();
        player2.draw();
        setTimeout(gameAnimation, animationTime);
        drawScore();
        checkWinner()
    }  
}

// bot animation
let botAnimation = () => {
    botMove();
    setTimeout(botAnimation, 1)
}

botAnimation();
gameAnimation();