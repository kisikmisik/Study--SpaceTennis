// find the canvas and determine some usable variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;
let animationTime = 30;
let borderWidth = 15;

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

    move() {
        this.x += this.speed * this.xShift;
        this.y += this.speed * this.yShift;

        //checks collission with walls and player
        if(this.y >= height - 25 || this.y <= 25) {
            this.yShift = -(this.yShift);
        }

        if(this.x > width - borderWidth || this.x === borderWidth) {
            this.xShift = -(this.xShift);
        }
    }
};

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, 80, 20);
    }
};

let controls = {
    37: "leftFirst",
    39: "rightFirst",
    65: "leftSecond",
    68: "rightSecond"
}

document.addEventListener("keydown", (evt) => {
    // job here
})

let ball = new Ball(width / 2, height / 2);
let player1 = new Player(width / 2, height - 25);
let player2 = new Player(width / 2, 5);
let animation = () => {
    ctx.clearRect(0, 0, width, height);
    drawCanvas();
    ball.draw();
    ball.move()
    player1.draw();
    player2.draw();
    setTimeout(animation, animationTime);
}

animation();