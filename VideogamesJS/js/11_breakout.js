/*
 * Simple implementation of the BREAKOUT game
 *
 * Santiago Aguilar Mello
 * 2025-05-15
 */
//Game developmen was originally in videogamesJS and I created this folder for the final project. to see commits, theyre in VideogamesJS
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
    constructor(position, width, height, color) {
        super(position, width, height, color, "ball");
        this.velocity = new Vector(0, 0);
    }

    update(deltaTime) {
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
        this.updateCollider();
    }

    reset() {
        this.position.x = canvasWidth / 2;
        this.position.y = canvasHeight / 2;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.updateCollider();
    }

    // Start ball motion upward at a random angle
    serve() {
        let angle = Math.random() * Math.PI / 2 + Math.PI / 4;
        this.velocity = new Vector(Math.cos(angle), -Math.sin(angle));
        ballSpeed = initialSpeed;
    }
}


// Class for the main character in the game
class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "player");
        this.velocity = new Vector(0, 0);

        // Structure with the directions the object can move
        this.motion = {
            left: { axis: "x", sign: -1 },
            right: { axis: "x", sign: 1 },
        }

        // Keys pressed to move the player
        this.keys = [];
        // tilting for paddle
        this.tilt = 0;
        this.tiltLeft = false;
        this.tiltRight = false;
    }

    update(deltaTime) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        //Loop to check if keys are pressed to move the player
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // normalizing velocity for diagonal movement
        this.velocity = this.velocity.normalize().times(paddleSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.tilt = 0;
        if (this.tiltLeft) this.tilt = -Math.PI / 6; //tilt left 30 degrees
        if (this.tiltRight) this.tilt = Math.PI / 6; //same for right

        this.clampWithinCanvas();
        this.updateCollider();
    }

    draw(ctx) {
        //draws the paddle and tilting creative element
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.tilt);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.halfSize.x, -this.halfSize.y, this.size.x, this.size.y);
        ctx.restore();
    }

    clampWithinCanvas() {
        if (this.position.x < this.halfSize.x) {
            this.position.x = this.halfSize.x;
        } else if (this.position.x > canvasWidth - this.halfSize.x) {
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }
}

// Class for bricks in the game
class Brick extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "brick");
    }
}

// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.level = 1;
        this.lives = 3;
        this.bricksDestroyed = 0;
        //there are three states. waiting, playinh and gameOver.
        this.inPlay = false;
        this.gameOver = false;
        this.won = false;
        this.timeRemaining = 500000;
        //array of the themes of each level. each has its sprites and music
        this.themes = [
            { bg: "../../VideogamesJS/assets/sprites/disco.jpg", ball: "../../VideogamesJS/assets/sprites/disco.gif", music: "../../VideogamesJS/assets/audio/disco.mp3" },
            { bg: "../../VideogamesJS/assets/sprites/HipHop.jpg", ball: "../../VideogamesJS/assets/sprites/basketball", music: "../../VideogamesJS/assets/audio/hiphop no copyright.mp3" },
            { bg: "../../VideogamesJS/assets/sprites/Rock&roll.jpg", ball: "../../VideogamesJS/assets/sprites/Vinyl", music: "../../VideogamesJS/assets/audio/rock.mp3" },
        ];
        //
        this.bgMusic = null;
        //OG pong audio
        this.ping = document.createElement("audio");
        this.ping.src = "../../VideogamesJS/assets/audio/4387__noisecollector__pongblipe4.wav";
        //All text labels in tgame
        this.blocksLabel = new TextLabel(canvasWidth / 2 - 100, 60, "40px Arial", "red"); // label for blocks destroyed on top middle
        this.timeLabel = new TextLabel(50, 60, "40px Arial", "black"); // label for time left on top left
        this.liveLabel = new TextLabel(canvasWidth - 150, 60, "40px Arial", "green"); //label for lives left on top right
        this.levelLabel = new TextLabel(50, 550, "40px Arial", "blue"); //label for level on bottom left

        this.createEventListeners();
        this.initObjects();
    }

    // Create the objects in the game
    initObjects() {
        this.inPlay = false;

        this.paddle = new Paddle(new Vector(canvasWidth / 2, canvasHeight - 30), 130, 20, "red");
        this.ball = new Ball(new Vector(canvasWidth / 2, canvasHeight / 2), 20, 20, "black");

        //set themes for level w background and music
        let theme = this.themes[this.level - 1]; //get theme for level, -1 sincce level starts at 1 but array at 0
        this.bgImage = new Image();
        this.bgImage.src = theme.bg;
        this.ball.setSprite(theme.ball);

        if (this.bgMusic) { // stop music if it is playing from last level
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
        this.bgMusic = document.createElement("audio");
        this.bgMusic.src = theme.music;
        this.bgMusic.loop = true;
//drawing walls in the game in a yellow colour
        this.wallUp = new GameObject(new Vector(canvasWidth / 2, 0), canvasWidth, 20, "yellow");
        this.wallDown = new GameObject(new Vector(canvasWidth / 2, canvasHeight), canvasWidth, 20, "yellow");
        this.wallLeft = new GameObject(new Vector(0, canvasHeight / 2), 20, canvasHeight, "yellow");
        this.wallRight = new GameObject(new Vector(canvasWidth, canvasHeight / 2), 20, canvasHeight, "yellow");

        this.bricks = [];
        // as said in canvas. begin with 3 rows at level 1, add 1 row per level up to 5
        let brickRows = Math.min(2 + this.level, 5);
        let brickCols = 10;
        let brickGap = 5;
        let brickMarginX = 30;
        let brickMarginTop = 100;
        let brickWidth = 70;
        let brickHeight = 30;
        for (let i = 0; i < brickRows; i++) {// loop to create all bricks based on rows and columns
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

    // Reset all game state to start fresh
    resetGame() {
        this.level = 1;
        this.lives = 3;
        this.bricksDestroyed = 0;
        this.timeRemaining = 500000;
        this.gameOver = false;
        this.won = false;
        this.initObjects();
    }

    draw(ctx) {
        if (this.bgImage) {
            ctx.drawImage(this.bgImage, 0, 0, canvasWidth, canvasHeight);
        }

        this.blocksLabel.draw(ctx, `Blocks: ${this.bricksDestroyed}`);
        this.liveLabel.draw(ctx, `Lives: ${this.lives}`);
        this.levelLabel.draw(ctx, `Level: ${this.level}`);

        let mins = Math.floor(this.timeRemaining / 60000);
        let secs = Math.floor((this.timeRemaining % 60000) / 1000);
        this.timeLabel.draw(ctx, `${mins}:${secs}`);

        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        for (let brick of this.bricks) {
            brick.draw(ctx);
        }
// overlays for winning and losing states
        if (this.gameOver) {
            this.drawOverlay(ctx, "GAME OVER", "Press Space to restart");
        } else if (this.won) {
            this.drawOverlay(ctx, "YOU WIN!", "Press Space to play again");
        }
    }

    // draw the overlay for winning and losing
    drawOverlay(ctx, title, subtitle) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);// background for text and overlay
// draw the text for the overlay
        ctx.textAlign = "center";
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(title, canvasWidth / 2, canvasHeight / 2 - 30);
// subtitle
        ctx.font = "30px Arial";
        ctx.fillStyle = "#cccccc";
        ctx.fillText(subtitle, canvasWidth / 2, canvasHeight / 2 + 40);

        ctx.textAlign = "left";
    }

    update(deltaTime) {
        // Pause all updates while showing end screens
        if (this.gameOver || this.won) {
            return;
        }
// decrease time and check game over w time
        this.timeRemaining -= deltaTime;
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.gameOver = true;
            return;
        }

        this.paddle.update(deltaTime);
        if (this.inPlay) {
            this.ball.update(deltaTime);
        }

        if (boxOverlap(this.paddle, this.ball)) {// reset the ball to be on top
            this.ball.position.y = this.paddle.position.y - this.paddle.halfSize.y - this.ball.halfSize.y;
            this.ball.updateCollider();
            // main mechanig; if paddle tilter, it will bounce to that side at an angle of 30 degrees.
            if (this.paddle.tiltLeft) {
                this.ball.velocity = new Vector(-1, -1);//the vector will bounce left
            } else if (this.paddle.tiltRight) {
                this.ball.velocity = new Vector(1, -1); //the vector will change to bounve to the right
            } else {
                //if it is not tilted, it just goes up
                this.ball.velocity.y *= -1;
            }
            ballSpeed *= speedIncrease;
            this.ping.play();
        }
        // check collisions on walls to bounce. bottom and sides
        if (boxOverlap(this.wallLeft, this.ball)) {
            this.ball.velocity.x *= -1;
            ballSpeed *= speedIncrease;
            this.ping.play();
        } else if (boxOverlap(this.wallRight, this.ball)) {
            this.ball.velocity.x *= -1;
            ballSpeed *= speedIncrease;
            this.ping.play();
        }

        if (boxOverlap(this.wallUp, this.ball)) {
            this.ball.velocity.y *= -1;
            ballSpeed *= speedIncrease;
            this.ping.play();
        }
// if it overlaps on the bottom, you lose a life and will reset the ball
        if (boxOverlap(this.wallDown, this.ball)) {
            this.ball.reset();
            this.inPlay = false;
            this.lives--;
            this.ping.play();
        }
// game over scren when loves reach 0
        if (this.lives <= 0) {
            this.gameOver = true;
            return;
        }

        // winstate  after clearing level 3
        if (this.bricks.length === 0) {
            if (this.level >= 3) {
                this.won = true;
            } else {
                this.level++;
                this.initObjects();
            }
        }
// check collision of bricks
        for (let brick of this.bricks) {
            if (boxOverlap(this.ball, brick)) {
                const overlapX = (this.ball.halfSize.x + brick.halfSize.x) - Math.abs(this.ball.position.x - brick.position.x);
                const overlapY = (this.ball.halfSize.y + brick.halfSize.y) - Math.abs(this.ball.position.y - brick.position.y);
// check which axis for the brick to bounce and change in an appropiate way in x or y
                if (overlapX < overlapY) {
                    this.ball.velocity.x *= -1;
                } else {
                    this.ball.velocity.y *= -1;
                }
// remove the bricks when colliding and make it harder by increasing the speed of the ball and play sound
                this.bricksDestroyed++;
                this.bricks.splice(this.bricks.indexOf(brick), 1);
                ballSpeed *= speedIncrease;
                this.ping.play();
                break;
            }
        }
    }
    // key pressing for movement and extra element of tilting as asked in the instructions
    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'a') {
                this.addKey('left', this.paddle);
            } else if (event.key == 'd') {
                this.addKey('right', this.paddle);
            } else if (event.key == 'ArrowLeft') {
                this.paddle.tiltLeft = true;
            } else if (event.key == 'ArrowRight') {
                this.paddle.tiltRight = true;
            } else if (event.key == ' ') {
                if (this.gameOver || this.won) {
                    this.resetGame();
                } else if (!this.inPlay) {
                    this.ball.serve();
                    this.inPlay = true;
                    this.bgMusic.play();
                }
            }
        });
    
        window.addEventListener('keyup', (event) => {
            if (event.key == 'a') {
                this.delKey('left', this.paddle);
            } else if (event.key == 'd') {
                this.delKey('right', this.paddle);
            } else if (event.key == 'ArrowLeft') {
                this.paddle.tiltLeft = false;
            } else if (event.key == 'ArrowRight') {
                this.paddle.tiltRight = false;
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
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    game = new Game();

    drawScene(0);
}

// Main loop function to be called once per frame
function drawScene(newTime) {
    // time difference for deltatime
    let deltaTime = newTime - oldTime;

// update draw the game for the frame
    game.update(deltaTime);
    game.draw(ctx);
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
