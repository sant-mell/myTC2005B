<<<<<<< HEAD
/*
 * Simple implementation of the PONG game
 *
 * Gilberto Echeverria
 * 2025-03-13
 */

=======
>>>>>>> 4b889f3b3db7515d515701bdd76d41cd8e4af6c5
"use strict";
const canvasWidth = 800;
const canvasHeight = 600;
const paddleSpeed = 0.45;
const ballSpeed = 0.35;
const paddleWidth = 18;
const paddleHeight = 110;
const ballSize = 16;

let ctx;
let game;
let oldTime;

<<<<<<< HEAD
let paddleSpeed = 15;
let ballSpeed = 5;

class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols);
        this.velocity = new Vector(1, 1);
    }

    update(deltaTime) {
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.updateCollider();
    }
    
=======
function aabbOverlap(obj1, obj2) {
    const left1 = obj1.position.x - obj1.halfSize.x;
    const right1 = obj1.position.x + obj1.halfSize.x;
    const top1 = obj1.position.y - obj1.halfSize.y;
    const bottom1 = obj1.position.y + obj1.halfSize.y;

    const left2 = obj2.position.x - obj2.halfSize.x;
    const right2 = obj2.position.x + obj2.halfSize.x;
    const top2 = obj2.position.y - obj2.halfSize.y;
    const bottom2 = obj2.position.y + obj2.halfSize.y;

    return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
>>>>>>> 4b889f3b3db7515d515701bdd76d41cd8e4af6c5
}

class Paddle extends GameObject {
    constructor(position, color) {
        super(position, paddleWidth, paddleHeight, color, "paddle");
        this.velocity = new Vector(0, 0);
<<<<<<< HEAD

        // Structure with the directions the object can move
        this.motion = {
            up: {
                axis: "y",
                sign: -1,
            },
            down: {
                axis: "y",
                sign: 1,
            },
        }

        // Keys pressed to move the player
=======
>>>>>>> 4b889f3b3db7515d515701bdd76d41cd8e4af6c5
        this.keys = [];
    }

    update(deltaTime) {
        this.velocity.y = 0;

        for (const direction of this.keys) {
            if (direction == "up") {
                this.velocity.y -= 1;
            } else if (direction == "down") {
                this.velocity.y += 1;
            }
        }
<<<<<<< HEAD
        // TODO: Normalize the velocity to avoid greater speed on diagonals
        this.velocity = this.velocity.normalize().times(paddleSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));
=======
>>>>>>> 4b889f3b3db7515d515701bdd76d41cd8e4af6c5

        this.position = this.position.plus(this.velocity.times(paddleSpeed * deltaTime));
        this.clampWithinCanvas();
        this.updateCollider();
    }

    clampWithinCanvas() {
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
        } else if (this.position.y + this.halfSize.y > canvasHeight) {
            this.position.y = canvasHeight - this.halfSize.y;
        }
    }
}

class Ball extends GameObject {
    constructor(position) {
        super(position, ballSize, ballSize, "black", "ball");
        this.velocity = new Vector(0, 0);
    }

    launch(direction = 1) {
        this.velocity = new Vector(direction * ballSpeed, 0);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    reset(direction = 1) {
        this.position = new Vector(canvasWidth / 2, canvasHeight / 2);
        this.launch(direction);
    }
}

class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();
    }

    // Create the objects in the game
    initObjects() {
<<<<<<< HEAD
        this.paddleLeft = new Paddle(new Vector(50, canvasHeight / 2), 20, 150, "red");
        this.paddleRight = new Paddle(new Vector(canvasWidth - 50, canvasHeight / 2), 20, 150, "blue");

        this.ball = new Ball(new Vector(canvasWidth / 2, canvasHeight / 2), 20, 20, "black");

        this.wallUp = new GameObject(new Vector(canvasWidth / 2, 0), canvasWidth, 20, "yellow")
        this.wallDown = new GameObject(new Vector(canvasWidth / 2, canvasHeight), canvasWidth, 20, "yellow")

        this.goalLeft = new GameObject(new Vector(0, canvasHeight / 2), 20, canvasHeight, "green")
        this.goalRight = new GameObject(new Vector(canvasWidth, canvasHeight / 2), 20, canvasHeight, "green")

        this.actors = [
            this.paddleLeft,
            this.paddleRight,
            this.ball,
            this.wallUp,
            this.wallDown,
            this.goalLeft,
            this.goalRight
        ];
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
    }

    update(deltaTime) {
        // Move the paddles
=======
        this.paddleLeft = new Paddle(new Vector(40, canvasHeight / 2), "red");
        this.paddleRight = new Paddle(new Vector(canvasWidth - 40, canvasHeight / 2), "blue");
        this.ball = new Ball(new Vector(canvasWidth / 2, canvasHeight / 2));
        this.scoreLeft = 0;
        this.scoreRight = 0;
        this.ball.launch(1);
    }

    draw(ctx) {
        this.drawScore(ctx);
        this.paddleLeft.draw(ctx);
        this.paddleRight.draw(ctx);
        this.ball.draw(ctx);
    }

    drawScore(ctx) {
        ctx.fillStyle = "black";
        ctx.font = "24px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${this.scoreLeft} : ${this.scoreRight}`, canvasWidth / 2, 36);
    }

    update(deltaTime) {
>>>>>>> 4b889f3b3db7515d515701bdd76d41cd8e4af6c5
        this.paddleLeft.update(deltaTime);
        this.paddleRight.update(deltaTime);
        this.ball.update(deltaTime);

<<<<<<< HEAD
        if (boxOverlap(this.paddleLeft, this.ball) ||
            boxOverlap(this.paddleRight, this.ball)){
                this.ball.velocity.x *= -1;
            }

        if (boxOverlap(this.wallDown, this.ball) ||
            boxOverlap(this.wallUp, this.ball)){
                this.ball.velocity.y *= -1;
            }
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'w') {
                this.addKey('up', this.paddleLeft);
            } if (event.key == 's') {
                this.addKey('down', this.paddleLeft);
            } if (event.key == 'ArrowUp') {
                this.addKey('up', this.paddleRight);
            } if (event.key == 'ArrowDown') {
                this.addKey('down', this.paddleRight);
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.delKey('up', this.paddleLeft);
            } if (event.key == 's') {
                this.delKey('down', this.paddleLeft);
            } if (event.key == 'ArrowUp') {
                this.delKey('up', this.paddleRight);
            } if (event.key == 'ArrowDown') {
                this.delKey('down', this.paddleRight);
=======
        this.resolvePaddleCollision(this.paddleLeft, 1);
        this.resolvePaddleCollision(this.paddleRight, -1);
        this.checkScore();
    }

    resolvePaddleCollision(paddle, directionOut) {
        if (!aabbOverlap(this.ball, paddle)) {
            return;
        }

        this.ball.position.x = paddle.position.x + directionOut * (paddle.halfSize.x + this.ball.halfSize.x + 1);
        this.ball.velocity.x *= -1;
    }

    checkScore() {
        if (this.ball.position.x + this.ball.halfSize.x < 0) {
            this.scoreRight += 1;
            this.ball.reset(1);
        } else if (this.ball.position.x - this.ball.halfSize.x > canvasWidth) {
            this.scoreLeft += 1;
            this.ball.reset(-1);
        }
    }

    createEventListeners() {
        window.addEventListener("keydown", event => {
            if (event.key == "w") {
                this.addKey(this.paddleLeft, "up");
            } else if (event.key == "s") {
                this.addKey(this.paddleLeft, "down");
            } else if (event.key == "ArrowUp") {
                event.preventDefault();
                this.addKey(this.paddleRight, "up");
            } else if (event.key == "ArrowDown") {
                event.preventDefault();
                this.addKey(this.paddleRight, "down");
            }
        });

        window.addEventListener("keyup", event => {
            if (event.key == "w") {
                this.delKey(this.paddleLeft, "up");
            } else if (event.key == "s") {
                this.delKey(this.paddleLeft, "down");
            } else if (event.key == "ArrowUp") {
                event.preventDefault();
                this.delKey(this.paddleRight, "up");
            } else if (event.key == "ArrowDown") {
                event.preventDefault();
                this.delKey(this.paddleRight, "down");
>>>>>>> 4b889f3b3db7515d515701bdd76d41cd8e4af6c5
            }
        });
    }

    // Add the key pressed to the 'keys' array of the object sent
    addKey(direction, object) {
        if (!object.keys.includes(direction)) {
            object.keys.push(direction);
        }
    }

    // Remove the key pressed from the 'keys' array of the object sent
    delKey(direction, object) {
        if (object.keys.includes(direction)) {
            object.keys.splice(object.keys.indexOf(direction), 1);
        }
    }
}

function main() {
    const canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    game = new Game();
    drawScene(0);
}

function drawScene(newTime) {
<<<<<<< HEAD
    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = 1;
=======
    if (oldTime === undefined) {
        oldTime = newTime;
    }

    const deltaTime = Math.min(newTime - oldTime, 35);
>>>>>>> 4b889f3b3db7515d515701bdd76d41cd8e4af6c5

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.update(deltaTime);
    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}