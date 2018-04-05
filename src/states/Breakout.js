// import R from 'ramda';
// require('../plugins/virtual-gamepad.js');

const BRICKS_CONFIG = {
	width: 50,
	height: 42,
	count: {
		row: 10,
		col: 3
	},
	offset: {
		top: 50,
		left: 50
	},
	padding: 10
};

const DEFAULT_STATE = {
	score: 0,
	lives: 2,
	playing: false,
	// so we know the state to expect
	// brickInfo: undefined,
	// scoreText: undefined,
	// livesText: undefined,
	// lifeLostText: undefined,
	// startButton: undefined,
	// ball: undefined,
	// paddle: undefined,
	// bricks: undefined,
	// newBrick: undefined,
};

const getPixelsToMove = (pxPerSecond, delta) => Math.floor(pxPerSecond * delta);


class Preload extends Phaser.State {

	// TODO - use redux for state management
	constructor() {
		super();
		this._state = {
			...DEFAULT_STATE
		};
	}

	preload() {
		/* Preload required assets */
		//this.game.load.image('myImage', 'assets/my-image.png');
		//this.game.load.audio('myAudio', 'assets/my-audio.wav');
		//this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json');
		this.game.load.image('space', 'assets/bo/space_bg.png');
		this.game.load.image('paddle', 'assets/bo/aliens_paddle.png');
		this.game.load.image('brick', 'assets/bo/trump.png');
		this.game.load.spritesheet('ball', 'assets/bo/wobble-star.png', 20, 20);
		this.game.load.spritesheet('button', 'assets/bo/great_button.png', 420, 70);
		this.game.load.spritesheet('gamepad', 'assets/gamepad_spritesheet.png', 50, 50);

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		// this.game.stage.backgroundColor = '#eee';
		
	}
	
	create() {
		// Game physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.checkCollision.down = false;

		// this._state.gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad);
		// this._state.joystick = this._state.gamepad.addJoystick(0, 0, 1, 'gamepad')
		// this._state.button = this._state.gamepad.addButton(200, 0, 1, 'game');
		
		// Add background
		this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
		
		// Add the ball
		this._state.ball = this.game.add.sprite(this.game.world.width * 0.5, this.game.world.height - 25, 'ball');
		this._state.ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
		this._state.ball.anchor.set(0.5);
		this.game.physics.enable(this._state.ball, Phaser.Physics.ARCADE);
		this._state.ball.body.collideWorldBounds = true;
		this._state.ball.body.bounce.set(1);
		this._state.ball.checkWorldBounds = true;
		this._state.ball.events.onOutOfBounds.add(this.ballLeaveScreen, this);

		// Add the paddle
		this.__paddle = this.game.add.sprite(this.game.world.width * 0.5, this.game.world.height - 5, 'paddle');
		this.__paddle.anchor.set(0.5,1);
		this.game.physics.enable(this.__paddle, Phaser.Physics.ARCADE);
		this.__paddle.body.immovable = true;

		// Add the display info text
		this._state.textStyle = { font: '16px monospace', fill: '#C491FC' };
		this._state.scoreText = this.game.add.text(5, 5, '', this._state.textStyle);
		this._state.livesText = this.game.add.text(this.game.world.width - 5, 5, '', this._state.textStyle);
		this._state.livesText.anchor.set(1,0);
		this._state.lifeLostText = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.5, 'Life lost, tap to continue', this._state.textStyle);
		this._state.lifeLostText.anchor.set(0.5);
		this._state.lifeLostText.visible = false;

		console.log('this.__paddle followed by the camera');
		this.game.camera.follow(this.__paddle);

		this.__keyCursorLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.__keyCursorRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		// Reset the game state
		this.initGame();
	}
	
	update() {
		this.game.physics.arcade.collide(this._state.ball, this.__paddle, this.ballHitPaddle.bind(this));
		this.game.physics.arcade.collide(this._state.ball, this._state.bricks, this.ballHitBrick.bind(this));
		if (this._state.playing) {
			// this.__paddle.x = this.game.input.x || this.game.world.width * 0.5;

			if (this.__keyCursorLeft.isDown) {
				this.__paddle.x -= getPixelsToMove(400, this.game.time.physicsElapsed);
			}
			if (this.__keyCursorRight.isDown) {
				this.__paddle.x += getPixelsToMove(400, this.game.time.physicsElapsed);
			}
		}
		// TODO: Change to button controls?
	}
	
	initGame() {
		if (this._state.bricks) {
			this._state.bricks.callAll('kill');
		}
		// reset to defaults
		Object.keys(DEFAULT_STATE).forEach(key => {
			console.log(key);
			this._state[key] = DEFAULT_STATE[key];
		});
		// update score etc
		this.updateDisplay();
		// add the bricks
		// this.initBricks();
		// add start screen
		this.displayStartScreen();
		// reset the actors
		this.resetActors();
	}

	resetActors() {
		this._state.ball.reset(this.game.world.width*0.5, this.game.world.height-25);
		this.__paddle.reset(this.game.world.width*0.5, this.game.world.height-5);
	}

	displayStartScreen() {
		this._state.startButton = this.game.add.button(this.game.world.width * 0.5, this.game.world.height * 0.5, 'button', this.startGame, this, 1, 0, 2);
		this._state.startButton.anchor.set(0.5);
	}

	updateDisplay() {
		this._state.livesText.setText('Lives: ' + this._state.lives);
		this._state.scoreText.setText('Points: ' + this._state.score);
	}
	
	initBricks() {
		this._state.brickInfo = BRICKS_CONFIG;
		this._state.bricks = this.game.add.group();
		for(var c = 0; c < this._state.brickInfo.count.col; c++) {
			for(var r = 0; r < this._state.brickInfo.count.row; r++) {
				const brickX = (r * (this._state.brickInfo.width + this._state.brickInfo.padding)) + this._state.brickInfo.offset.left;
				const brickY = (c * (this._state.brickInfo.height + this._state.brickInfo.padding)) + this._state.brickInfo.offset.top;
				const newBrick = this.game.add.sprite(brickX, brickY, 'brick');
				this.game.physics.enable(newBrick, Phaser.Physics.ARCADE);
				newBrick.body.immovable = true;
				newBrick.anchor.set(0.5);
				this._state.bricks.add(newBrick);
			}
		}
	}
	
	ballHitBrick(ball, brick) {
		var killTween = this.game.add.tween(brick.scale);
		killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
		killTween.onComplete.addOnce(function(){
			brick.kill();
		}, this);
		killTween.start();
		this._state.score += 10;
		this.updateDisplay();
		if(this._state.score === this._state.brickInfo.count.row * this._state.brickInfo.count.col * 10) {
			alert('You won the game, congratulations!');
			location.reload();
		}
	}
	
	ballLeaveScreen() {
		this._state.lives--;
		if(this._state.lives) {
			this.updateDisplay();
			this._state.lifeLostText.visible = true;
			this._state.playing = false;
			this.resetActors();
			this.game.input.onDown.addOnce(function() {
				this._state.lifeLostText.visible = false;
				this._state.ball.body.velocity.set(100, -400);
				this._state.playing = true;
			}, this);
		}
		else {
			// alert('You lost, game over!');
			// location.reload();
			this.initGame();
		}
	}
	
	ballHitPaddle(ball, paddle) {
		ball.animations.play('wobble');
		ball.body.velocity.x = -1*5*(paddle.x-ball.x);
	}
	
	startGame() {
		this._state.startButton.destroy();
		this._state.ball.body.velocity.set(100, -350);
		this._state.playing = true;
		// add the bricks
		this.initBricks();
	}

	gameOver(){
		// this.game.state.restart();
		// this._state = DEFAULT_STATE;
		// location.reload();
		this.initGame();
	}

}

export default Preload;
