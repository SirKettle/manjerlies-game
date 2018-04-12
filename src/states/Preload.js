import { GAMEPAD } from './ManjerlySkyFighter';

class Preload extends Phaser.State {

	preload() {
		// TODO: Add audio
		//this.game.load.image('myImage', 'assets/my-image.png');
		//this.game.load.audio('myAudio', 'assets/my-audio.wav');
		//this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json');
		this.game.load.image('bg', 'assets/blood_bg.jpg');
		this.game.load.image('parallax_far', 'assets/parallax_far.png');
		this.game.load.image('radar_mask', 'assets/radar-mask.png');
		this.game.load.image('radar_frame', 'assets/radar-frame.png');
		this.game.load.image('guage', 'assets/guage.png');
		this.game.load.image('guage_needle', 'assets/guage_needle.png');
		this.game.load.image('parallax_mid', 'assets/parallax_mid.png');
		this.game.load.image('parallax_near', 'assets/parallax_near.png');
		this.game.load.image('cockpit', 'assets/sub-cockpit2.png');
		this.game.load.image('grid', 'assets/grid.png');
		this.game.load.image('bar_health', 'assets/health_bar.png');
		this.game.load.image('bar_energy', 'assets/energy_bar.png');
		this.game.load.image('hostile_germ', 'assets/hostile_germ.png');
		this.game.load.image('hostile_harrison', 'assets/hostile_harrison.png');
		this.game.load.image('hostile_elliot', 'assets/hostile_elliot.png');
		this.game.load.image('hostile_robin', 'assets/hostile_robin.png');
		this.game.load.image('blood_splatter', 'assets/blood_splatter.png');
		this.game.load.image('blood_splatter_green', 'assets/blood_splatter_green.png');
		this.game.load.image('blood_splatter_yellow', 'assets/blood_splatter_yellow.png');
		this.game.load.image('manjerly_fighter_ship', 'assets/manjerly_fighter_ship.png');
		this.game.load.image('turret', 'assets/manjerly_fighter_ship_turret.png');
		this.game.load.image('laser', 'assets/laser.png');
		this.game.load.image('bubble','assets/bubble.png');
		this.game.load.spritesheet('gamepad', 'assets/gamepad_spritesheet.png', GAMEPAD.SIZE, GAMEPAD.SIZE);
		this.game.load.spritesheet('button', 'assets/bo/great_button.png', 420, 70);
	}

	create() {
		this.game.state.start('GameOver');
	}

}

export default Preload;
