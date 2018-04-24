import Boot from 'states/Boot';
import Preload from 'states/Preload';
import GameTitle from 'states/GameTitle';
import Main from 'states/Main';
import GameOver from 'states/GameOver';

export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 500
};

class Game extends Phaser.Game {
  constructor() {
    const canvasType = Phaser.CANVAS;
    super(CANVAS.WIDTH, CANVAS.HEIGHT, canvasType);

    this.state.add('Boot', Boot, false);
    this.state.add('Preload', Preload, false);
    this.state.add('Main', Main, false);
    this.state.add('GameOver', GameOver, false);

    this.state.start('Boot');
    this.__DEBUG_MODE = false;
    // this.__DEBUG_MODE = true;
  }
}

new Game();
