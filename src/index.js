import Boot from 'states/Boot';
import Preload from 'states/Preload';
import GameTitle from 'states/GameTitle';
import ManjerlySkyFighter from 'states/ManjerlySkyFighter';
import GameOver from 'states/GameOver';

export const CANVAS = {
	WIDTH: 800,
	HEIGHT: 500
};

class Game extends Phaser.Game {

	constructor() {

		// super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);
		// super(480, 320, Phaser.CANVAS);
		const canvas = Phaser.CANVAS;
		// const canvas = Phaser.AUTO;
		super(CANVAS.WIDTH, CANVAS.HEIGHT, canvas);

		this.state.add('Boot', Boot, false);
		this.state.add('Preload', Preload, false);
		this.state.add('ManjerlySkyFighter', ManjerlySkyFighter, false);
		// this.state.add('GameTitle', GameTitle, false);
		this.state.add('GameOver', GameOver, false);
		
		this.state.start('Boot');
		this.__DEBUG_MODE = false;
		// this.__DEBUG_MODE = true;
	}
}

new Game();