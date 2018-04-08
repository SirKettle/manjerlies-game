
const types = ['hostile_germ', 'hostile_elliot', 'hostile_harrison', 'hostile_robin'];

class Hostiles {

	constructor(game, args){
		const { max } = args;
		this.game = game;
		this.spriteGroup = this.game.add.group();
		this.spawnedCount = 0;
		this.maxInGame = max;
	}

	spawn(x, y){
		if (this.spriteGroup.length >= this.maxInGame) {
			return;
		}

		const size = Math.random() * 0.2 + 0.15;
		const type = types[this.game.rnd.integerInRange(0, 3)];
		const sprite = this.game.add.sprite(x, y, type);
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

}

export default Hostiles;