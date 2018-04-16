import R from 'ramda';

export const DEFAULT_GRID = [
	[1,1,0,0,0,0,1,1],
	[1,1,0,0,0,0,1,1],
	[1,1,0,0,0,0,1,1],
	[1,1,1,0,0,1,1,1],
	[0,0,0,0,0,0,0,0],
	[1,1,0,0,0,0,1,1],
	[1,1,0,0,0,0,1,1],
	[1,0,0,0,0,0,0,],
	[0,0,0,1,1,0,0,0],
	[0,0,1,1,1,1,0,0],
	[1,0,0,1,1,0,0,1],
	[0,0,0,1,1,0,0,0]
];

class MissionService {

	constructor(game, args){
    this.game = game;
    this.player = args.player;
    this.hostiles = args.hostiles;
    this.objectives = args.objectives;

		// Add the mission timer
		this.__timer = this.game.time.create();
		this.__timerEvent = this.__timer.add(this._missionObjectives.time, this.onTimeUp, this);
    this.__timer.start();

    this.setWorld();
    this.initImmovables();
    this.game.world.setBounds(0, 0, this.world.width, this.world.height);
  }

	setWorld() {
		this.world = {
			blocks: {
				size: 500
			}
		};

		this.world.blocks.columns = this.objectives.grid[0].length;
		this.world.blocks.rows = this.objectives.grid.length;
		this.world.width = this.world.blocks.columns * this.world.blocks.size;
		this.world.height = this.world.blocks.rows * this.world.blocks.size;
	}

	initImmovables() {
		const colCount = this.objectives.grid[0].length;
		const rowCount = this.objectives.grid.length;
		const blockWidth = this.game.world.width / colCount;
		const blockHeight = this.game.world.height / rowCount;
		const blockPoints = R.flatten(
			this.objectives.grid.map((row, rowIndex) => {
				return row.map((is, colIndex) => {
					return {
						is,
						x: colIndex * blockWidth,
						y: rowIndex * blockHeight
					};
				});
			})
		).filter(point => point.is === 1);

		this.immovables = new Immovables(this.game, {
			width: blockWidth,
			height: blockHeight,
			color: '#2f0100'
		});

		blockPoints.forEach(point => {
			this.immovables.spawn(point.x, point.y);
		});
	}


	check() {
		const killCount = this.hostiles.spawnedCount - this.hostiles.spriteGroup.length;
		if (killCount >= this.objectives.kills) {
			this.missionComplete();
		}
	}

	restart() {
		this.game.state.restart();
	}

	complete() {
		this.game._global.missionComplete = true;
		this.game.state.start('GameOver');
	}

	timeUp() {
		this.game._global.timeUp = true;
		this.game.state.start('GameOver');
	}

}

export default MissionService;
