import R from 'ramda';

const getNewPoint = (x, y, distance, deg) => {
	const rad = deg * Math.PI / 180;
	return {
		x: x - Math.sin(rad) * distance,
		y: Math.cos(rad) * distance + y
	};
};

const getRandomRange = (randomRange) => (Math.random() * randomRange) - (randomRange * 0.5);

export const PLAYER = {
	MAX_VELOCITY: 500,
	MAX_HEALTH: 1,
	MAX_ENERGY: 1,
	POWER: 8,
	WIDTH: 74,
	HEIGHT: 86
};

class Player {

	constructor(game, args) {
		this.game = game;
    this.sprite = null;
    this.energy = 0;
    this.health = 1;
    this.thrust = 0;
    this.maxThrust = 150;
    this.cameraOffset = {
      x: 0,
      y: 36
    };

    this.keyboard = args.keyboard;
    this.joystick = args.joystick;
    this.fireButton = args.fireButton;
  }

	fireLaser() {
		console.log('move turret on player');
	}

	spawn() {
		// Add sprite for camera to follow
		this.cameraSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'manjerly_fighter_ship');
		this.cameraSprite.scale.setTo(0.6, 0.6);
		this.cameraSprite.anchor.set(0.5);
		this.cameraSprite.alpha = 0;

    // Add the sprite
    this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'manjerly_fighter_ship');
    this.sprite.scale.setTo(0.6, 0.6);
    this.sprite.anchor.set(0.5);
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.drag.set(100);
    this.sprite.body.maxVelocity.set(PLAYER.MAX_VELOCITY);
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.bounce.set(1);
		this.sprite.lastAngle = -90;

		// create particle emitters
		this.emitterThrust = this.game.add.emitter(0, 0, 1000);
		this.emitterThrust.makeParticles('bubble');
		this.emitterThrust.lifespan = 500;
		this.emitterThrust.maxParticleSpeed = new Phaser.Point(50, 50);
		this.emitterThrust.minParticleSpeed = new Phaser.Point(-50, -50);
  }

	updatePlayer(delta) {
		this.updateAngle();
		this.updateAcceleration(delta);
		this.updateThrust(delta);
		this.updateEnergy(delta * 0.1);
		this.updateHealth(delta * 0.025);

		this.emitParticleThrust(this.thrust);

		// update the camera sprite's position
		this.cameraSprite.x = this.sprite.x + this.cameraOffset.x;
		this.cameraSprite.y = this.sprite.y + this.cameraOffset.y;
		this.cameraSprite.angle = this.sprite.angle;
	}

	updateEnergy(increase) {
		this.energy = R.clamp(0, PLAYER.MAX_ENERGY, this.energy + increase);
	}

	updateHealth(increase) {
		this.health = R.clamp(0, PLAYER.MAX_HEALTH, this.health + increase);
		if (this.health === 0) {
			this.game.state.start('GameOver');
		}
	}

	updateThrust() {
		if (this.joystick.properties.inUse) {
			this.thrust = R.clamp(0, this.maxThrust, this.joystick.properties.distance);
			return;
		}

		if (this.keyboard.cursorUp.isDown) {
			const timeThrusting = this.game.time.time - this.keyboard.cursorUp.timeDown;
			this.thrust = R.clamp(0, this.maxThrust, timeThrusting * 0.1);
			return;
		}

		this.thrust = 0;
	}

	updateAcceleration(delta) {
		if (this.energy < (PLAYER.MAX_ENERGY * 0.05)) {
			// reset the acceleration
			this.sprite.body.acceleration.x = 0;
			this.sprite.body.acceleration.y = 0;
			return;
		}

		// Read joystick data to set ship's acceleration
		if (this.joystick.properties.inUse) {
			this.sprite.body.acceleration.x = PLAYER.POWER * this.joystick.properties.x;
			this.sprite.body.acceleration.y = PLAYER.POWER * this.joystick.properties.y;
			return;
		}
		// Check for thrust key button
		if (this.keyboard.cursorUp.isDown) {
			const radAngle = (this.sprite.angle - 90) * Math.PI / 180;
			this.sprite.body.acceleration.x = -(PLAYER.POWER * 100 * Math.sin(radAngle));
			this.sprite.body.acceleration.y = PLAYER.POWER * 100 * Math.cos(radAngle);
			const timeThrusting = this.game.time.time - this.keyboard.cursorUp.timeDown;
			return;
		}

		// else reset the acceleration
		this.sprite.body.acceleration.x = 0;
		this.sprite.body.acceleration.y = 0;
	}

	updateAngle() {
		if (this.keyboard.cursorLeft.isDown) {
			this.sprite.angle = this.sprite.angle - 5;
			this.sprite.lastAngle = this.sprite.angle;
			return;
    }

		if (this.keyboard.cursorRight.isDown) {
			this.sprite.angle = this.sprite.angle + 5;
			this.sprite.lastAngle = this.sprite.angle;
			return;
		}
    // Read joystick data to set ship's angle
    if (this.joystick.properties.inUse) {
      this.sprite.angle = this.joystick.properties.angle;
      this.sprite.lastAngle = this.sprite.angle;
      return;
    }
		this.sprite.angle = this.sprite.lastAngle;
	}

	emitParticleThrust(thrust) {
		if (!thrust) {
			return;
		}
		// Use particles to show thrust
		// 1. Set the emitter's particle size
		const scale = R.clamp(0.2, 2)(thrust * 0.01);
		this.emitterThrust.maxParticleScale = scale * 1.5;
		this.emitterThrust.minParticleScale = scale * 0.5;
		// 2. Set emitter position to back of ship
		const emitterCoords = getNewPoint(
			this.sprite.x,
			this.sprite.y,
			PLAYER.HEIGHT * 0.5,
			this.sprite.angle + 90
		);
		this.emitterThrust.x = emitterCoords.x + getRandomRange(6);
		this.emitterThrust.y = emitterCoords.y + getRandomRange(6);
		// 3. Emit particle
		this.emitterThrust.emitParticle();
	}
}

export default Player;
