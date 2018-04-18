
const HOSTILE_IMAGE_KEYS = ['hostile_germ', 'hostile_elliot', 'hostile_harrison', 'hostile_robin'];



class Hostiles {

	constructor(game, args) {
		const { max } = args;
		this.game = game;
		this.spriteGroup = this.game.add.group();
		this.spawnedCount = 0;
		this.maxInGame = max;
	}

	spawn(x, y) {
		if (this.spriteGroup.length >= this.maxInGame) {
			return;
		}

    const size = Math.random() * 0.5 + 0.75;
		const imageKey = HOSTILE_IMAGE_KEYS[this.game.rnd.integerInRange(0, 3)];
    // const sprite = this.game.add.sprite(x, y, imageKey);
    const sprite = this.createGerm(x, y);
		this.game.physics.arcade.enable(sprite);
		sprite.anchor.setTo(0.5, 0.5);
		sprite.scale.setTo(size, size);
		sprite.angle = Math.floor(Math.random() * 360);
		sprite.body.immovable = false;
		sprite.body.collideWorldBounds = true;
		sprite.body.bounce.set(0.4);

		this.game.physics.arcade.velocityFromRotation(
			sprite.rotation,
			this.game.rnd.integerInRange(200, 800),
			sprite.body.velocity
		);

		this.spriteGroup.add(sprite);
		this.spawnedCount += 1;
  }

  createGerm(x, y) {
    const sprite = this.game.add.sprite(x, y, 'germ1');
    sprite.animations.add('move');
    sprite.animations.play('move', 3, true);
    return sprite;
  }

}

export default Hostiles;
