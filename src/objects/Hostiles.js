
const HOSTILE_IMAGE_KEYS = ['hostile_germ', 'hostile_elliot', 'hostile_harrison', 'hostile_robin'];

class Hostile {
	constructor(game){
		this.game = game;
        this.sprite = null;
	}

	spawn(x, y){
		const size = Math.random() * 0.2 + 0.15;
		this.size = size;
		this.imageKey = HOSTILE_IMAGE_KEYS[this.game.rnd.integerInRange(0, HOSTILE_IMAGE_KEYS.length - 1)];
		this.sprite = this.game.add.sprite(x, y, this.imageKey);
		this.game.physics.arcade.enable(this.sprite);
		this.sprite.anchor.setTo(0.5, 0.5);
		this.sprite.scale.setTo(this.size, this.size);
		this.sprite.angle = Math.floor(Math.random() * 360);
		this.sprite.body.immovable = false;
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.bounce.set(0.4);

		this.game.physics.arcade.velocityFromRotation(
			this.sprite.rotation,
			this.game.rnd.integerInRange(200, 800),
			this.sprite.body.velocity
		);
	}
}

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

		const hostile = new Hostile(this.game);
		hostile.spawn(x, y);
		this.spriteGroup.add(hostile.sprite);
		this.spawnedCount += 1;
	}

}

export default Hostiles;