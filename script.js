// find the canvas and determine some usable variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let playing = true;
let width = canvas.width;
let height = canvas.height;
let animationTime = 20;
let borderWidth = 15;
let blockWidth = 80;


let yourScore = 0;
let enemyScore = 0;

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
    ctx.font = "50px Courier";
    ctx.baseLine = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(message, width / 2, height / 2);
};

// draw current score 

let drawScore = () => {
    ctx.font = "25px Courier";
    ctx.baseLine = "top";
    ctx.textAligh = "left";
    ctx.fillStyle = "green";
    ctx.fillText("You: " + yourScore, 50, 100);
    ctx.fillText("Nagibator3000: " + enemyScore, 50, 150);
};

// artifical intelligence
let botSpeed = 1; // 1 is hard, 4 is medium, 7 is easy
let botMove = () => {
    if (player2.x > ball.x) {
        player2.x -= 2;
    } else if (player2.x < ball.x) {
        player2.x += 2;
    } else {
        player2.x += 0;
    }
}

// reset game to start position
let gameReturn = () => {
    playing = true;
    ball.x = width / 2;
    ball.y = height / 2;
    ball.speed = 7;
    gameAnimation(); 
}
    
// ball constructor
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 7;
        this.yShift = 1;
        this.xShift = Math.random();
    }

// draw ball
    draw() {
        ctx.fillStyle = "white";
        circle(this.x, this.y, 7, true);
    }

    checkBlockCollision() {
        let isOutBottom = this.y >= height - 25; //25 is block height + padding
        let isOutTop = this.y <= 25;
        let isCollidedBottom = this.x >= player1.x - blockWidth / 2 && this.x <= player1.x + blockWidth / 2;
        let isCollidedTop = this.x >= player2.x - blockWidth / 2 && this.x <= player2.x + blockWidth / 2;

        // update game points when ball is out of canvas
        let updateScore = (toWhomScore) => new Promise((resolve, reject) => {
            setTimeout(() => {
                toWhomScore++;  
                checkResult("Score!");
                resolve();
            }, 1)
        });

        if (this.y < 0) {
            updateScore(yourScore).then(() => {
                setTimeout(() => {
                    gameReturn();
                }, 2000)
            })
             
        } else if (this.y > height) {
            updateScore(enemyScore).then(() => {
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
    }  
}

let botAnimation = () => {
    botMove();
    setTimeout(botAnimation, botSpeed)
}

botAnimation();
gameAnimation();