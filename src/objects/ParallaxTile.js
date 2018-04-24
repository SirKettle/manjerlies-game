class ParallaxTile {
  constructor(game, imageKey, scale) {
    this.game = game;
    this.imageKey = imageKey;
    this.scale = scale;
    this.startingPosition = {
      x: -this.game.world.width * 0.5,
      y: -this.game.world.height * 0.5
    };
    this.tileSprite = this.game.add.tileSprite(
      this.startingPosition.x,
      this.startingPosition.y,
      this.game.world.width * 2 * Math.max(1, this.scale),
      this.game.world.height * 2 * Math.max(1, this.scale),
      imageKey
    );
  }

  update(x, y) {
    this.tileSprite.x = this.startingPosition.x - x * this.scale;
    this.tileSprite.y = this.startingPosition.y - y * this.scale;
  }
}

export default ParallaxTile;
