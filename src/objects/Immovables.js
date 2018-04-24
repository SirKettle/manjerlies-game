class Immovables {
  constructor(game, args) {
    this.game = game;
    this.spriteGroup = this.game.add.group();
    this.spawnedCount = 0;
    this.width = args.width;
    this.height = args.height;
    this.color = args.color;
    this.graphic = new Phaser.Graphics(this.game)
      .beginFill(Phaser.Color.hexToRGB(this.color), 1)
      .drawRect(0, 0, this.width, this.height);
    this.texture = this.graphic.generateTexture();
  }

  spawn(x, y) {
    const sprite = this.game.add.sprite(x, y, this.texture);
    this.game.physics.arcade.enable(sprite);
    sprite.enableBody = true;
    sprite.body.immovable = true;
    this.spriteGroup.add(sprite);
    this.spawnedCount += 1;
  }
}

export default Immovables;
