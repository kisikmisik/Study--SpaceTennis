// find the canvas and determine some usable variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let playing = true;
let width = canvas.width;
let height = canvas.height;
let animationTime = 20;
let borderWidth = 15;
let blockWidth = 80;

//draw canvas and borders
let drawCanvas = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, borderWidth, height);
    ctx.fillRect(width - borderWidth, 0, borderWidth, height);
};

// draw a simple circle
let circle = function (x, y, radius, isFilled) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (isFilled) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

let checkResult = function (message) {
    playing = false;
    ctx.font = "50px Courier";
    ctx.baseLine = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(message, width / 2, height / 2);
}

// ball constructor
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 7;
        this.yShift = 1;
        this.xShift = 0.5;
    }

    draw() {
        ctx.fillStyle = "white";
        circle(this.x, this.y, 7, true);
    }

    checkBlockCollision() {
        let isOutBottom = this.y >= height - 25; //25 is block height + padding
        let isOutTop = this.y <= 25;
        let isCollidedBottom = this.x >= player1.x - blockWidth / 2 && this.x <= player1.x + blockWidth / 2;
        let isCollidedTop = this.x >= player2.x - blockWidth / 2 && this.x <= player2.x + blockWidth / 2;

        // stop animation and show game over when ball out of canvas
        if (this.y < 0) {
            setTimeout(() => {checkResult("You Won")}, 200)   
        } else if (this.y > height) {
            setTimeout(() => {checkResult("Game Over")}, 200)
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

    botMove() {
        player2.x = this.x;
    }
};


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
let animation = () => {
    if (playing) {
        ctx.clearRect(0, 0, width, height);
        drawCanvas();
        ball.draw();
        ball.move();
        ball.botMove();
        player1.draw();
        player2.draw();
        setTimeout(animation, animationTime);
    }  
}

animation();