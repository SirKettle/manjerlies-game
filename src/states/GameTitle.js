class GameTitle extends Phaser.State {
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.add.sprite(0, 0, 'sky');
  }

  startGame() {
    this.game.state.start('Main');
  }
}

export default GameTitle;
