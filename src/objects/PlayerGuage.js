import R from 'ramda';

class PlayerGuage {
  constructor(game, args) {
    this.game = game;
    this.offset = args.offset;
    this.size = args.size;
    this.renderSprites();
  }

  renderSprites() {
    this.guageSprite = this.game.add.sprite(
      this.offset.x,
      this.offset.y,
      'guage'
    );
    this.guageSprite.fixedToCamera = true;
    this.guageSprite.anchor.set(0.5);
    this.needleSprite = this.game.add.sprite(
      this.offset.x,
      this.offset.y,
      'guage_needle'
    );
    this.needleSprite.fixedToCamera = true;
    this.needleSprite.anchor.set(0.5);
    const scale = this.size / 200;
    this.guageSprite.scale.set(scale);
    this.needleSprite.scale.set(scale);
    this.needleSprite.angle = -120;
  }

  update(percentage) {
    const needleAngleRange = 240;
    const newAngle = percentage * needleAngleRange - needleAngleRange * 0.5;
    this.game.add.tween(this.needleSprite).to(
      {
        angle: newAngle
      },
      200,
      null,
      true,
      0,
      1
    );
  }
}

export default PlayerGuage;
