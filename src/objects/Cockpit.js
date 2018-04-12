import { CANVAS } from '../index';
import PlayerMap from '../objects/PlayerMap';
import PlayerRadar from '../objects/PlayerRadar';
import PlayerGuage from '../objects/PlayerGuage';

const COCKPIT = {
	BAR_WIDTH: 100,
	BAR_HEIGHT: 5
};

const textStyleConsole = {
	font: '10px monospace',
	fill: '#fff',
	align: 'left',
	stroke: '#000000'
};

const textStyleMission = {
	font: '20px monospace',
	fill: '#fff',
	align: 'left',
	stroke: '#000000'
};

const padNumber = (integer) => {
	if (integer < 10) {
		return `0${integer}`;
	}
	return integer.toString();
}

const formatTime = (ms) => {
	const totalSecs = Math.floor(ms * 0.001);
	const mins = Math.floor(totalSecs / 60);
	const secs = totalSecs % 60;
	return `${padNumber(mins)}:${padNumber(secs)}`;
}

class Cockpit {

	constructor(game, args){
    this.game = game;
    this.player = args.player;
    this.hostiles = args.hostiles;
    this.mission = args.mission;

    this.cockpitSprite = this.game.add.sprite(0,0, 'cockpit');
    this.cockpitSprite.fixedToCamera = true;
    this.cockpitSprite.scale.setTo(0.5, 0.5);
    this.barHealthSprite = this.game.add.sprite(CANVAS.WIDTH * 0.5 + 75, CANVAS.HEIGHT - 70, 'bar_health');
    this.barHealthSprite.alpha = 0.9;
    this.barHealthSprite.fixedToCamera = true;
    this.barHealthMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
    this.barHealthSprite.crop(this.barHealthMask);
    this.barEnergySprite = this.game.add.sprite(CANVAS.WIDTH * 0.5 + 72, CANVAS.HEIGHT - 60, 'bar_energy');
    this.barEnergySprite.alpha = 0.8;
    this.barEnergySprite.fixedToCamera = true;
    this.barEnergyMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
    this.barEnergySprite.crop(this.barEnergyMask);

    // Display console - user
    this.textGroup = this.game.add.group();
    this.textConsole = this.game.add.text(CANVAS.WIDTH * 0.5 - 200, CANVAS.HEIGHT - 15, '', { ...textStyleConsole, fill: '#4fa' });
    this.textMission = this.game.add.text(40, 20, '', { ...textStyleMission, fill: '#4fa' });
    this.textMissionTime = this.game.add.text(CANVAS.WIDTH - 140, 20, '', { ...textStyleMission, fill: '#4fa' });
    this.textMission.alpha = 0.5;
    this.textMissionTime.alpha = 0.5;
    this.textGroup.addMultiple([this.textConsole, this.textMission, this.textMissionTime]);
    this.textGroup.fixedToCamera = true;

    this.renderPlayerMap();
    this.renderRadar();
    this.renderThrustGuage();
  }

  renderThrustGuage() {
		this.thrustGuage = new PlayerGuage(this.game, {
			size: 100,
			offset: {
				x: this.game.width * 0.5 - 130,
				y: this.game.height - 80
			}
		});

  }

	renderRadar() {
		this.radar = new PlayerRadar(this.game, {
			size: 100,
			color: '#00ff33',
			range: 1000,
			offset: {
				x: this.game.width * 0.5,
				y: this.game.height - 80
			}
		});
	}

	renderPlayerMap() {
		const ratioToScreenScale = 0.15;
		this.playerMap = new PlayerMap(this.game, {
			width: this.game.width * ratioToScreenScale,
			height: this.game.width * 12 / 8 * ratioToScreenScale,
			color: '#00ff33',
			grid: this.mission.grid,
			offset: {
				x: 25,
				y: 70
			}
		});
	}

	update(timeLeft) {
		this.textMission.setText(`Destroy ${this.mission.kills} hostiles before it’s too late!`);
		this.textMissionTime.setText(formatTime(timeLeft));

		this.textConsole.setText(`Targets destroyed: ${ this.hostiles.spawnedCount - this.hostiles.spriteGroup.length } - <|${this.game.time.fps}|>`);

		this.barHealthMask.width = COCKPIT.BAR_WIDTH * Math.floor(this.player.health * 10) / 10;
		this.barEnergyMask.width = COCKPIT.BAR_WIDTH * Math.floor(this.player.energy * 10) / 10;
		this.barHealthSprite.updateCrop();
		this.barEnergySprite.updateCrop();

		this.playerMap.updatePlayer(this.player.sprite.x, this.player.sprite.y);
		this.radar.update(this.player, this.hostiles);
		this.thrustGuage.update(this.player.thrust / this.player.maxThrust);
	}

}

export default Cockpit;
