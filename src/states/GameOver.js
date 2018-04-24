import { CANVAS } from '../index';

const textStyle = {
  font: '20px monospace',
  fill: '#ffffff',
  align: 'center',
  stroke: '#f00'
};

export const generateText = args => {
  if (args.missionCount === 0) {
    return 'Good luck manjerlies!\n\nProtect your host from the hostiles...';
  }
  return `
Mission ${args.missionComplete ? 'complete!' : 'failed...'}

Your score is ${args.score}
`;
};

class GameOver extends Phaser.State {
  create() {
    const copy = generateText(this.game._global);
    this.game.world.setBounds(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    this.game.add.tileSprite(
      0,
      0,
      this.game.world.width,
      this.game.world.height,
      'bg'
    );
    this.textScore = this.game.add.text(
      this.game.world.width * 0.5,
      this.game.world.height * 0.5,
      copy,
      textStyle
    );
    this.textScore.fixedToCamera = true;
    this.textScore.anchor.set(0.5, 0.5);
    this.textScore.bringToTop();

    this.input.onDown.addOnce(this.restartGame, this);
  }

  restartGame() {
    this.game.state.start('Main');
  }
}

export default GameOver;
