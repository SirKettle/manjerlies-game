import R from 'ramda';
import Player from '../objects/Player';
import Hostiles from '../objects/Hostiles';
import ParallaxTile from '../objects/ParallaxTile';
import { CANVAS } from '../index';

require('../plugins/virtual-gamepad.js');

export const WORLD = {
	WIDTH: 3500,
	HEIGHT: 2000
};

const DEFAULT_STATE = {
	score: 0,
	lives: 2,
	playing: false
};

export const GAMEPAD = {
	SIZE: 100,
	PADDING: 110
};

const COCKPIT = {
	BAR_WIDTH: 276,
	BAR_HEIGHT: 10
};

const ENERGY_COST = {
	LASER: 0.05,
	THRUST: 0.01
};

const textStyleDebug = {
	font: '13px monospace', 
	fill: '#fff', 
	align: 'left', 
	stroke: '#000000'
};

const textStyleConsole = {
	font: '15px monospace', 
	fill: '#fff', 
	align: 'left', 
	stroke: '#000000'
};

const textStyleMission = {
	font: '20px monospace', 
	fill: '#fff', 
	align: 'left', 
	stroke: '#000000'
};

const padNumber = (integer) => {
	if (integer < 10) {
		return `0${integer}`;
	}
	return integer.toString();
}

const formatTime = (ms) => {
	const totalSecs = Math.floor(ms * 0.001);
	const mins = Math.floor(totalSecs / 60);
	const secs = totalSecs % 60;
	return `${padNumber(mins)}:${padNumber(secs)}`;
}

const getRandomCoords = (maxX = WORLD.WIDTH, maxY = WORLD.HEIGHT) => {
	return {
		x: Math.round(Math.random() * maxX),
		y: Math.round(Math.random() * maxY)
	}
}

const doPerSecondProbably = (func, delta, callsPerSecondCount = 1) => {
	if (Math.random() < callsPerSecondCount * delta) {
		func();
	}
}

class ManjerlySkyFighter extends Phaser.State {

	constructor() {
		super();
		this._state = {
			...DEFAULT_STATE
		};
	}

	preload() {
		this.game.time.advancedTiming = true;
	}
	
	create() {
		// Set mission targets
		// TODO: this needs to be extended and randomly generated ot create levels
		console.log('create mission!');
		const maxHostiles = this.game.rnd.integerInRange(25, 50);
		this.__mission = {
			time: this.game.rnd.integerInRange(4, 9) * 10000,
			kills: this.game.rnd.integerInRange(10, maxHostiles),
			hostiles: {
				initial: this.game.rnd.integerInRange(1, 20),
				max: maxHostiles,
				spawnRate: 2 / 1
			}
		};

		this.game._global.missionComplete = false;
		this.game._global.score = 0;
		this.game._global.missionCount += 1;

		// Add the mission timer
		this.__timer = this.game.time.create();
		this.__timerEvent = this.__timer.add(this.__mission.time, this.onTimeUp, this);
        this.__timer.start();

		// Game physics
		this.game.world.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add background
		this.game.stage.backgroundColor = '#6f0100';
		this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg');
		this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'grid');
		
		this._parallax = [
			new ParallaxTile(this.game, 'parallax_far', 0.05),
			new ParallaxTile(this.game, 'parallax_mid', 0.15),
			new ParallaxTile(this.game, 'parallax_near', 0.5),
			new ParallaxTile(this.game, 'parallax_near', 1.5)
		];

		// Add the player
		this._player = new Player(this.game);
		this._player.spawn();
		
		// Add some lasers for the player
        this.lasers = this.game.add.group();
        this.lasers.enableBody = true;
        this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
        this.lasers.createMultiple(20, 'laser');
        this.lasers.setAll('scale.x', 0.5);
        this.lasers.setAll('scale.y', 0.5);
        this.lasers.setAll('anchor.x', 0.5);
        this.lasers.setAll('anchor.y', 0.5);
		this.laserTime = 0;
		
		// Add some enemies
		this._hostiles = new Hostiles(this.game, this.__mission.hostiles);
		
		this.__emitterBloodSplatter = this.game.add.emitter(0, 0, 1000);
		this.__emitterBloodSplatter.makeParticles(['blood_splatter_yellow', 'blood_splatter_green']);
		this.__emitterBloodSplatter.lifespan = 200;
		this.__emitterBloodSplatter.maxParticleSpeed = new Phaser.Point(50, 50);
		this.__emitterBloodSplatter.minParticleSpeed = new Phaser.Point(-50, -50);
		this.__emitterBloodSplatter.maxParticleScale = 2;
		this.__emitterBloodSplatter.minParticleScale = 0.5;
		this.__emitterBloodSplatter.alpha = 0.25;
		
		this.__cockpit = this.add.sprite(0,0, 'cockpit');
		this.__cockpit.fixedToCamera = true;
		this.__cockpit.scale.setTo(0.5, 0.5);
		this.__barHealth = this.add.sprite(CANVAS.WIDTH * 0.5 - COCKPIT.BAR_WIDTH * 0.5 - 6, CANVAS.HEIGHT - 59, 'bar_health');
		this.__barHealth.alpha = 0.9;
		this.__barHealth.fixedToCamera = true;
		this.__barHealthMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
		this.__barHealth.crop(this.__barHealthMask);
        this.__barEnergy = this.add.sprite(CANVAS.WIDTH * 0.5 - COCKPIT.BAR_WIDTH * 0.5 - 6, CANVAS.HEIGHT - 47, 'bar_energy');
		this.__barEnergy.alpha = 0.8;
		this.__barEnergy.fixedToCamera = true;
		this.__barEnergyMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
		this.__barEnergy.crop(this.__barEnergyMask);
		
		// Display console - debug

		if (this.game.__DEBUG_MODE) {
			this.__textDebug = this.game.add.group();
			this.__textDebugPlayer = this.game.add.text(75, 70, '', textStyleDebug);
			this.__textDebugHostiles = this.game.add.text(250, 70, '', textStyleDebug);
			this.__textDebugMission = this.game.add.text(425, 70, '', textStyleDebug);
			this.__textDebugControls = this.game.add.text(600, 70, '', textStyleDebug);
			this.__textDebug.addMultiple([this.__textDebugControls, this.__textDebugPlayer, this.__textDebugMission, this.__textDebugHostiles]);
			this.__textDebug.fixedToCamera = true;
			this.__textDebug.alpha = 0.3;
		}
		
		// Display console - user
		this.__textDisplay = this.game.add.group();
		this.__textConsole = this.game.add.text(CANVAS.WIDTH * 0.5 - COCKPIT.BAR_WIDTH * 0.5, CANVAS.HEIGHT - 30, '', { ...textStyleConsole, fill: '#4fa' });
		this.__textMission = this.game.add.text(40, 20, '', { ...textStyleMission, fill: '#4fa' });
		this.__textMissionTime = this.game.add.text(CANVAS.WIDTH - 140, 20, '', { ...textStyleMission, fill: '#4fa' });
		this.__textMission.alpha = 0.5;
		this.__textMissionTime.alpha = 0.5;
		this.__textDisplay.addMultiple([this.__textConsole, this.__textMission, this.__textMissionTime]);
		this.__textDisplay.fixedToCamera = true;

		// Touch controls
		this._gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad);
		this._joystick = this._gamepad.addJoystick(GAMEPAD.PADDING, CANVAS.HEIGHT - GAMEPAD.PADDING, 1.2, 'gamepad')
		this._fireButton = this._gamepad.addButton(CANVAS.WIDTH - GAMEPAD.PADDING, CANVAS.HEIGHT - GAMEPAD.PADDING, 1, 'gamepad');
		
		// Keyboard controls
		this._keys = {
			cursorUp: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
			cursorDown: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			cursorLeft: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			cursorRight: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
			spaceBar: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		}

		this._player.addControls({
			keys: this._keys,
			joystick: this._joystick,
			fireButton: this._fireButton
		});
		
		// Camera to follow the player
		this.game.camera.follow(this._player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

		// Bring last parallax bg in front of player
		R.last(this._parallax).tileSprite.bringToTop();

		// Reset the game state
		this.initGameState();
		R.times(() => { this.spawnGerm(); }, this.__mission.hostiles.initial);
	}
	
	initGameState() {
		this.__thrust = 0;
		this.__germsSpawnedCount = 0;
		this._player.energy = 0;
		this._player.health = 1;

		// reset to defaults
		Object.keys(DEFAULT_STATE).forEach(key => {
			this._state[key] = DEFAULT_STATE[key];
		});
	}
	
	spawnGerm() {
		const { x, y } = getRandomCoords();
		this._hostiles.spawn(x, y);
	}

	emitBloodSplatterParticles(x, y) {
		this.__emitterBloodSplatter.x = x;
		this.__emitterBloodSplatter.y = y;
		this.__emitterBloodSplatter.flow(200, 25, 1, 3);
	}
	
	onLaserHitGerm(laser, germ) {
		this.emitBloodSplatterParticles(germ.body.center.x, germ.body.center.y);
		laser.kill();
		this.killGerm(germ);
	}

	addScore(increase) {
		this.game._global.score += increase;
	}

	onPlayerGermImpact(player, germ) {
		this.emitBloodSplatterParticles(germ.body.center.x, germ.body.center.y);
		this._player.updateHealth(-0.3);
		this.addScore(-10);
	}

	killGerm(germ) {
		// Animate death of germ
		const killTweenDuration = 200;
		const killTween = this.game.add.tween(germ.scale);
		killTween.to({ x: 0, y: 0 }, killTweenDuration, Phaser.Easing.Linear.None);
		killTween.onComplete.addOnce(() => {
			// germ.kill();
			germ.destroy();
		});
		killTween.start();
		this.addScore(20);
	}
	
	update() {
		const delta = this.game.time.physicsElapsed;

		this._player.updatePlayer(delta);
		
		if (this._keys.spaceBar.isDown || this._fireButton.isDown) {
			this.fireLaser();
		}

		this.game.physics.arcade.overlap(this.lasers, this._hostiles.spriteGroup, this.onLaserHitGerm.bind(this));
		this.game.physics.arcade.collide(this._player.sprite, this._hostiles.spriteGroup, this.onPlayerGermImpact.bind(this));

		this.updateDisplay();

		const germSpawnFrequencyPerSecond = this.__mission.hostiles.spawnRate;
		doPerSecondProbably(() => { this.spawnGerm(); }, delta, germSpawnFrequencyPerSecond);

		this.checkMission();

		this._parallax.forEach((parallax, index) => {
			parallax.update(this._player.sprite.x, this._player.sprite.y);
		});
	}

	checkMission() {
		const killCount = this._hostiles.spawnedCount - this._hostiles.spriteGroup.length;
		if (killCount >= this.__mission.kills) {
			this.missionComplete();
		}
	}

	fireLaser() {
		if (this._player.energy < ENERGY_COST.LASER ||
			this.game.time.now <= this.laserTime) {
			return;
		}

		this._player.fireLaser();

		this.laser = this.lasers.getFirstExists(false);

		if (this.laser) {
			this.laser.reset(
				this._player.sprite.centerX, 
				this._player.sprite.centerY
			);
			this.laser.lifespan = 2000;
			this.laser.angle = this._player.sprite.angle;
			this.game.physics.arcade.velocityFromRotation(
				this._player.sprite.rotation,
				1000,
				this.laser.body.velocity
			);
			this.laserTime = this.game.time.now + 100;
			this._player.updateEnergy(-ENERGY_COST.LASER);
		}
	}

	updateDisplay() {
		const {
			up, down, left, right,
			x, y, distance, angle,
			rotation, inUse
		} = this._joystick.properties;

		const timeLeft = this.__timerEvent.delay - this.__timer.ms;
		const killCount = this._hostiles.spawnedCount - this._hostiles.spriteGroup.length;

		const directionsMap = {
			dU: up, dD: down, dL: left, dR: right,
			aU: this._keys.cursorUp.isDown,
			aL: this._keys.cursorLeft.isDown,
			aR: this._keys.cursorRight.isDown
		};
		const directionsString = Object.keys(directionsMap)
			.filter(key => directionsMap[key])
			.join(' - ');
		
		if (this.game.__DEBUG_MODE) {
			this.__textDebugPlayer.setText(
`-- COORDS --
x: ${ Math.floor(this._player.sprite.x)}, y: ${ Math.floor(this._player.sprite.y) }
thrust: ${ Math.floor(this.__thrust) }
speed: ${ Math.floor(this._player.sprite.body.speed) }
angle: ${ this._player.sprite.body.angle.toFixed(4) }
rotation: ${ this._player.sprite.body.rotation.toFixed(4) }
-- VITALS --
energy: ${ Math.floor(this._player.energy * 100) }%
health: ${ Math.floor(this._player.health * 100) }%
		`);

		this.__textDebugMission.setText(
`--- MISSION ---
score: ${this.game._global.score}
targets: ${killCount}/${this.__mission.kills}
time left: ${ timeLeft }
		`);

		this.__textDebugHostiles.setText(
`-- HOSTILES --
total: ${ this._hostiles.spawnedCount }
killed: ${ killCount }
alive: ${ this._hostiles.spriteGroup.length }
		`);

		this.__textDebugControls.setText(
`-- CONTROLS --
inUse: ${ inUse }
directions: ${ directionsString }
(Rectangular)
x: ${ x }, y: ${ y }
(Polar)
distance: ${ distance }
angle: ${ angle.toFixed(4) }
rotation: ${ rotation.toFixed(4) }
			`);
		}

		this.__textMission.setText(`Destroy ${this.__mission.kills} hostiles before it’s too late!`);
		this.__textMissionTime.setText(formatTime(timeLeft));

		this.__textConsole.setText(`Targets destroyed: ${ this._hostiles.spawnedCount - this._hostiles.spriteGroup.length } - <|${this.game.time.fps}|>`);

		this.__barHealthMask.width = COCKPIT.BAR_WIDTH * Math.floor(this._player.health * 10) / 10;
		this.__barEnergyMask.width = COCKPIT.BAR_WIDTH * Math.floor(this._player.energy * 10) / 10;
		this.__barHealth.updateCrop();
		this.__barEnergy.updateCrop();
	}
	
	restartGame() {
		this.initGameState();
		this.game.state.restart();
	}

	missionComplete() {
		this.game._global.missionComplete = true;
		this.game.state.start('GameOver');
	}

	onTimeUp() {
		this.game._global.timeUp = true;
		this.game.state.start('GameOver');
	}

}

export default ManjerlySkyFighter;
