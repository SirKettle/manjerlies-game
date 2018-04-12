import R from 'ramda';
import Immovables from './Immovables';

class PlayerMap {

	constructor(game, args) {
		this.game = game;
		this.spriteGroup = this.game.add.group();
    this.spawnedCount = 0;
    this.offset = args.offset;
		this.width = args.width;
		this.height = args.height;
		this.color = args.color;
    this.grid = args.grid;

    this.drawBg();
    this.drawPlayer();
    this.drawMap();
  }

  drawBg() {
    const graphic = new Phaser.Graphics(this.game)
      .beginFill(Phaser.Color.hexToRGB(this.color), 1)
      .drawRect(0, 0, this.width, this.height);
    const texture = graphic.generateTexture();
    this.bgSprite = this.game.add.sprite(this.offset.x, this.offset.y, texture);
    this.bgSprite.fixedToCamera = true;
    this.bgSprite.alpha = 0.15;
  }

  drawPlayer() {
    const graphic = new Phaser.Graphics(this.game)
      .beginFill(Phaser.Color.hexToRGB(this.color), 1)
      .drawRect(0, 0, 4, 4);
    const texture = graphic.generateTexture();
    this.playerSprite = this.game.add.sprite(0, 0, texture);
    this.playerSprite.fixedToCamera = true;
    this.playerSprite.alpha = 0.3;
  }

  drawMap() {
    const colCount = this.grid[0].length;
    const rowCount = this.grid.length;
    const blockWidth = this.width / colCount;
    const blockHeight = this.height / rowCount;
    const blockPoints = R.flatten(
    this.grid.map((row, rowIndex) => {
      return row.map((is, colIndex) => {
        return {
          is,
          x: (colIndex * blockWidth) + this.offset.x,
          y: (rowIndex * blockHeight) + this.offset.y
        };
      });
    })
    ).filter(point => point.is === 1);

		this.immovables = new Immovables(this.game, {
			width: blockWidth,
			height: blockHeight,
			color: this.color
		});

		blockPoints.forEach(point => {
			this.immovables.spawn(point.x, point.y);
    });

		this.immovables.spriteGroup.fixedToCamera = true;
    this.immovables.spriteGroup.alpha = 0.15;
  }

	updatePlayer(x, y) {
		this.playerSprite.cameraOffset.x = (x * this.width / this.game.world.width) - (this.playerSprite.width * 0.5) + this.offset.x;
		this.playerSprite.cameraOffset.y = (y * this.height / this.game.world.height) - (this.playerSprite.height * 0.5) + this.offset.y;
	}

}

export default PlayerMap;
