/*
 * Simple implementation of the PONG game
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
let speedIncrease = 1.05;

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

  reset(){
    this.position.x = canvasWidth /2;
    this.position.y = canvasHeight/2;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
    //start ball motion
  serve(){
    //get a random angle between -Pi/2 and Pi/2
    let angle = Math.random() * Math.PI / 2 - Math.PI / 4;
    this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
    ballSpeed = initialSpeed;
    //select random direction
    if (Math.random() < 0.5) {
        this.velocity.x *= -1;
    }
  }
}

class Score extends GameObject{
    constructor(position, width, height, color, sheetCols){
        super(position, width, height, color, "score", sheetCols);
    }
}

// Class for the main character in the game
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);

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


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        this.scoreLeft = 0;
        this.scoreRight = 0;

        //score textlabel
        this.scoreLabelLeft = new TextLabel(canvasWidth / 4, 100, "40px Arial", "red");
        this.scoreLabelRight = new TextLabel(3 * canvasWidth / 4, 100, "40px Arial", "blue");
        this.timeLabel = new TextLabel(canvasWidth / 2 - 50, 100, "40px Arial", "black");
        //detect if were playing
        this.inPlay = false;
        //time imit for the game in milliseconds
        this.timeRemaining = 5000;
    }

    // Create the objects in the game
    initObjects() {
        this.paddleLeft = new Paddle(new Vector(50, canvasHeight / 2), 20, 130, "red");
        this.paddleRight = new Paddle(new Vector(canvasWidth - 50, canvasHeight / 2), 20, 130, "blue");

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
            //draw scores
        this.scoreLabelLeft.draw(ctx, `${this.scoreLeft}`);
        this.scoreLabelRight.draw(ctx, `${this.scoreRight}`);

        let mins = Math.floor(this.timeRemaining / 60000);
        let secs = Math.floor((this.timeRemaining % 60000) / 1000);
        this.timeLabel.draw(ctx, `${mins}:${secs}`);

        //draw actors
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
    }

    update(deltaTime) {
        // Move the paddles
        this.timeRemaining -= deltaTime;
        if(this.timeRemaining<=0){
            this.timeRemaining = 0;
            return;
        }

        this.paddleLeft.update(deltaTime);
        this.paddleRight.update(deltaTime);
        this.ball.update(deltaTime);

        

        if (boxOverlap(this.paddleLeft, this.ball) ||
            boxOverlap(this.paddleRight, this.ball)){
                this.ball.velocity.x *= -1;
                ballSpeed *= speedIncrease;
            }

        if (boxOverlap(this.wallDown, this.ball) ||
            boxOverlap(this.wallUp, this.ball)){
                this.ball.velocity.y *= -1;
                ballSpeed *= speedIncrease;
            }
        if (boxOverlap(this.goalLeft, this.ball)) {
                this.ball.reset();
                this.scoreRight += 1;
                this.inPlay = false;

            }
        if (boxOverlap(this.goalRight, this.ball)) {
                this.ball.reset();
                this.scoreLeft += 1;   
                this.inPlay = false;         
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

            if (event.key == ' ') {
                if(!this.inPlay){
                this.ball.serve();
                this.inPlay = true;
            }
        }        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.delKey('up', this.paddleLeft);
            } if (event.key == 's') {
                this.delKey('down', this.paddleLeft);
            } if (event.key == 'ArrowUp') {
                this.delKey('up', this.paddleRight);
            } if (event.key == 'ArrowDown') {
                this.delKey('down', this.paddleRight);
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

