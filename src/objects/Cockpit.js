import { CANVAS } from '../index';

const COCKPIT = {
	BAR_WIDTH: 276,
	BAR_HEIGHT: 10
};

const textStyleConsole = {
	font: '15px monospace',
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
		this.barHealthSprite = this.game.add.sprite(CANVAS.WIDTH * 0.5 - COCKPIT.BAR_WIDTH * 0.5 - 6, CANVAS.HEIGHT - 59, 'bar_health');
		this.barHealthSprite.alpha = 0.9;
		this.barHealthSprite.fixedToCamera = true;
		this.barHealthMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
		this.barHealthSprite.crop(this.barHealthMask);
    this.barEnergySprite = this.game.add.sprite(CANVAS.WIDTH * 0.5 - COCKPIT.BAR_WIDTH * 0.5 - 6, CANVAS.HEIGHT - 47, 'bar_energy');
		this.barEnergySprite.alpha = 0.8;
		this.barEnergySprite.fixedToCamera = true;
		this.barEnergyMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
		this.barEnergySprite.crop(this.barEnergyMask);

		// Display console - user
		this.textGroup = this.game.add.group();
		this.textConsole = this.game.add.text(CANVAS.WIDTH * 0.5 - COCKPIT.BAR_WIDTH * 0.5, CANVAS.HEIGHT - 30, '', { ...textStyleConsole, fill: '#4fa' });
		this.textMission = this.game.add.text(40, 20, '', { ...textStyleMission, fill: '#4fa' });
		this.textMissionTime = this.game.add.text(CANVAS.WIDTH - 140, 20, '', { ...textStyleMission, fill: '#4fa' });
		this.textMission.alpha = 0.5;
		this.textMissionTime.alpha = 0.5;
		this.textGroup.addMultiple([this.textConsole, this.textMission, this.textMissionTime]);
		this.textGroup.fixedToCamera = true;
	}

	update(timeLeft) {
		this.textMission.setText(`Destroy ${this.mission.kills} hostiles before it’s too late!`);
		this.textMissionTime.setText(formatTime(timeLeft));

		this.textConsole.setText(`Targets destroyed: ${ this.hostiles.spawnedCount - this.hostiles.spriteGroup.length } - <|${this.game.time.fps}|>`);

		this.barHealthMask.width = COCKPIT.BAR_WIDTH * Math.floor(this.player.health * 10) / 10;
		this.barEnergyMask.width = COCKPIT.BAR_WIDTH * Math.floor(this.player.energy * 10) / 10;
		this.barHealthSprite.updateCrop();
		this.barEnergySprite.updateCrop();

	}

}

export default Cockpit;
