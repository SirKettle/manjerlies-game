
const textStyleDebug = {
	font: '13px monospace',
	fill: '#fff',
	align: 'left',
	stroke: '#000000'
};

class DebugText {
	constructor(game, args){
    this.game = game;
		if (!this.game.__DEBUG_MODE) {
      return;
    }

    this.objectives = args.objectives;
    this.hostiles = args.hostiles;
    this.player = args.player;
    this.joystick = args.joystick;
    this.keyboard = args.keyboard;

    this.textDebug = this.game.add.group();
    this.textDebugPlayer = this.game.add.text(75, 70, '', textStyleDebug);
    this.textDebugHostiles = this.game.add.text(250, 70, '', textStyleDebug);
    this.textDebugMission = this.game.add.text(425, 70, '', textStyleDebug);
    this.textDebugControls = this.game.add.text(600, 70, '', textStyleDebug);
    this.textDebug.addMultiple([this.textDebugControls, this.textDebugPlayer, this.textDebugMission, this.textDebugHostiles]);
    this.textDebug.fixedToCamera = true;
    this.textDebug.alpha = 0.3;
  }

  update(timeLeft) {
    if (!this.game.__DEBUG_MODE) {
      return;
    }
    const {
      up, down, left, right,
      x, y, distance, angle,
      rotation, inUse
    } = this.joystick.properties;

    const killCount = this.hostiles.spawnedCount - this.hostiles.spriteGroup.length;

    const directionsMap = {
      dU: up, dD: down, dL: left, dR: right,
      aU: this.keyboard.cursorUp.isDown,
      aL: this.keyboard.cursorLeft.isDown,
      aR: this.keyboard.cursorRight.isDown
    };
    const directionsString = Object.keys(directionsMap)
      .filter(key => directionsMap[key])
      .join(' - ');

    this.textDebugPlayer.setText(
`-- COORDS --
x: ${ Math.floor(this.player.sprite.x)}, y: ${ Math.floor(this.player.sprite.y) }
thrust: ${ Math.floor(this.player.thrust) }
speed: ${ Math.floor(this.player.sprite.body.speed) }
angle: ${ this.player.sprite.body.angle.toFixed(4) }
rotation: ${ this.player.sprite.body.rotation.toFixed(4) }
-- VITALS --
energy: ${ Math.floor(this.player.energy * 100) }%
health: ${ Math.floor(this.player.health * 100) }%
    `);

    this.textDebugMission.setText(
`--- MISSION ---
score: ${this.game._global.score}
targets: ${killCount}/${this.objectives.kills}
time left: ${ timeLeft }
    `);

    this.textDebugHostiles.setText(
`-- HOSTILES --
total: ${ this.hostiles.spawnedCount }
killed: ${ killCount }
alive: ${ this.hostiles.spriteGroup.length }
    `);

    this.textDebugControls.setText(
`-- CONTROLS --
inUse: ${ inUse }
directions: ${ directionsString }
(Rectangular)
x: ${ x }, y: ${ y }
(Polar)
distance: ${ distance }
angle: ${ angle.toFixed(4) }
rotation: ${ rotation.toFixed(4) }
    `);
  }
}

export default DebugText;
