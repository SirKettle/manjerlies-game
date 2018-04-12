import R from 'ramda';
import Immovables from './Immovables';

class PlayerRadar {

	constructor(game, args) {
		this.game = game;
    this.offset = args.offset;
		this.size = args.size;
		this.color = args.color;
    this.range = args.range;
    this.renderBg();
    this.createUfos();
    this.renderMask();
  }

  renderBg() {
    const graphic = new Phaser.Graphics(this.game)
      .beginFill(Phaser.Color.hexToRGB('#00ad23'), 1)
      .drawRect(0, 0, this.size, this.size);
    const texture = graphic.generateTexture();
    this.bgSprite = this.game.add.sprite(this.offset.x, this.offset.y, texture);
    this.bgSprite.fixedToCamera = true;
    this.bgSprite.anchor.set(0.5);
  }

  renderMask() {
    this.maskSprite = this.game.add.sprite(this.offset.x, this.offset.y, 'radar_mask');
    this.maskSprite.fixedToCamera = true;
    this.maskSprite.anchor.set(0.5);
    this.frameSprite = this.game.add.sprite(this.offset.x, this.offset.y, 'radar_frame');
    this.frameSprite.fixedToCamera = true;
    this.frameSprite.anchor.set(0.5);
    const scale = this.size / 140;
    this.maskSprite.scale.set(scale);
    this.frameSprite.scale.set(scale);

    this.game.add.tween(this.maskSprite).to({
        angle: 359
      }, 2000,
      null, true, 0, -1);
  }

  createUfos() {
    const ufoGraphic = new Phaser.Graphics(this.game)
      .beginFill(Phaser.Color.hexToRGB(this.color), 1)
      .drawRect(0, 0, 4, 4);
    this.ufos = this.game.add.group();
    this.ufoTexture = ufoGraphic.generateTexture();
    this.ufos.createMultiple(20, this.ufoTexture);
    this.ufos.fixedToCamera = true;
  }

	update(player, hostiles) {
    const scale = this.size / this.range * 0.5;
    this.ufos.callAll('kill');

    hostiles.spriteGroup.forEach(hostile => {
      const distance = Phaser.Math.distance(player.sprite.centerX, player.sprite.centerY, hostile.centerX, hostile.centerY);
      if (distance < this.range) {
        const ufo = this.ufos.getFirstExists(false);
        if (ufo) {
          const offset = {
            x: scale * (player.sprite.centerX - hostile.centerX),
            y: scale * (player.sprite.centerY - hostile.centerY)
          };

          ufo.reset(
            this.offset.x - offset.x,
            this.offset.y - offset.y
          );
        }
      }
    });
	}

}

export default PlayerRadar;


