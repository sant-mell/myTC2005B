/*
 * Simple implementation of the BREAKOUT game
 *
 * Gilberto Echeverria
 * 2025-03-13
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime = 0;
let initialSpeed = 0.5;
let paddleSpeed = 0.5;
let ballSpeed = 0.5;
let speedIncrease = 1.001;

class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols);
        this.velocity = new Vector(1, 1);
    }

    update(deltaTime) {
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.updateCollider();
        if(this.bricksLeft <= 0){
            this.reset();
            this.serve();
            this.bricksLeft = 50;
            this.level++;
        }
    }

  reset(){
    this.position.x = canvasWidth /2;
    this.position.y = canvasHeight/2;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
    //start ball motion
  serve(){
    //get a random angle always facing downwards
    let angle = Math.random() * Math.PI / 2 + Math.PI / 4;
    if (angle < 0 || angle > Math.PI) {
        angle *= -1;
    }
                this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
                ballSpeed = initialSpeed;
        }
    }


// Class for the main character in the game
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);

        // Structure with the directions the object can move
        this.motion = {
            left: {
                axis: "x",
                sign: -1,
            },
            right: {
                axis: "x",
                sign: 1,
            },
        }

        // Keys pressed to move the player
            this.keys = [];
        }

        update(deltaTime) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // TODO: Normalize the velocity to avoid greater speed on diagonals
        this.velocity = this.velocity.normalize().times(paddleSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
        this.updateCollider();
    }

    clampWithinCanvas() {
        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > canvasHeight) {
            this.position.y = canvasHeight - this.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }
}

//class for bricks in game
class Brick extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "brick", sheetCols);
    }
}

// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        //initialize sound stuff
        this.ping = document.createElement("audio");
        this.ping.src = "../assets/audio/4387__noisecollector__pongblipe4.wav";

        this.score = 0;
        this.level = 1;

        //score textlabel
        this.scoreLabel = new TextLabel(canvasWidth / 2 - 80, 60, "40px Arial", "red");
        this.timeLabel = new TextLabel( 50, 60, "40px Arial", "black");
        //detect if were playing
        this.inPlay = false;
        //time imit for the game in milliseconds
        this.timeRemaining = 150000;
    }

    // Create the objects in the game
    initObjects() {
        this.paddle = new Paddle(new Vector(canvasWidth / 2, canvasHeight - 30), 130, 20, "red");

        this.ball = new Ball(new Vector(canvasWidth / 2, canvasHeight / 2), 20, 20, "black");

        this.wallUp = new GameObject(new Vector(canvasWidth / 2, 0), canvasWidth, 20, "yellow")
        this.wallDown = new GameObject(new Vector(canvasWidth / 2, canvasHeight), canvasWidth, 20, "yellow")

        this.wallLeft = new GameObject(new Vector(0, canvasHeight / 2), 20, canvasHeight, "yellow")
        this.wallRight = new GameObject(new Vector(canvasWidth, canvasHeight / 2), 20, canvasHeight, "yellow")

        this.bricks = [];
        let brickRows = 5;
        let brickCols = 10;
        let brickGap = 5;
        let brickMarginX = 30;
        let brickMarginTop = 100;
        let brickWidth = Math.floor((canvasWidth - (2 * brickMarginX) - ((brickCols - 1) * brickGap)) / brickCols);
        let brickHeight = 30;
        for (let i = 0; i < brickRows; i++) {
            for (let j = 0; j < brickCols; j++) {
                let brickX = brickMarginX + (brickWidth / 2) + j * (brickWidth + brickGap);
                let brickY = brickMarginTop + (brickHeight / 2) + i * (brickHeight + brickGap);
                this.bricks.push(new Brick(new Vector(brickX, brickY), brickWidth, brickHeight, "blue"));
            }
        }

        this.actors = [
            this.paddle,
            this.ball,
            this.wallLeft,
            this.wallRight,
            this.wallUp,
            this.wallDown,
        ];
    }

    draw(ctx) {
            //draw scores
        this.scoreLabel.draw(ctx, `Score: ${this.score}`);

        let mins = Math.floor(this.timeRemaining / 60000);
        let secs = Math.floor((this.timeRemaining % 60000) / 1000);
        this.timeLabel.draw(ctx, `${mins}:${secs}`);

        //draw actors
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        //draw bricks
        for (let brick of this.bricks) {
            brick.draw(ctx);
        }
    }

    update(deltaTime) {
        // Move the paddles
        this.timeRemaining -= deltaTime;
        if(this.timeRemaining<=0){
            this.timeRemaining = 0;
            return;
        }

        this.paddle.update(deltaTime);
        this.ball.update(deltaTime);

        

        if (boxOverlap(this.paddle, this.ball)){
                this.ball.velocity.y *= -1;
                ballSpeed *= speedIncrease;
                this.ping.play();
            }

        if (boxOverlap(this.wallLeft, this.ball) ||
            boxOverlap(this.wallRight, this.ball)){
                this.ball.velocity.x *= -1;
                ballSpeed *= speedIncrease;
                this.ping.play();
            }

        if (boxOverlap(this.wallUp, this.ball)){
                this.ball.velocity.y *= -1;
                ballSpeed *= speedIncrease;
                this.ping.play();
            }
        if (boxOverlap(this.wallDown, this.ball)) {
            this.ball.reset();
            this.inPlay = false;
            this.ping.play();
        }

        for (let brick of this.bricks) {
            if (boxOverlap(this.ball, brick)) {
                this.bricks.splice(this.bricks.indexOf(brick), 1);
                this.ball.velocity.y *= -1;
                ballSpeed *= speedIncrease;
                this.score += 1;
                this.ping.play();
                break;
            }
        }

    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'a') {
                this.addKey('left', this.paddle);
            } else if (event.key == 'd') {
                this.addKey('right', this.paddle);
            } else if (event.key == 'ArrowLeft') {
                this.addKey('left', this.paddle);
            } else if (event.key == 'ArrowRight') {
                this.addKey('right', this.paddle);
            } else if (event.key == ' ') {
                if(!this.inPlay){
                this.ball.serve();
                this.inPlay = true;
                }
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'a') {
                this.delKey('left', this.paddle);
            } else if (event.key == 'd') {
                this.delKey('right', this.paddle);
            } else if (event.key == 'ArrowLeft') {
                this.delKey('left', this.paddle);
            } else if (event.key == 'ArrowRight') {
                this.delKey('right', this.paddle);
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

// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}

// Main loop function to be called once per frame
function drawScene(newTime) {
    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}