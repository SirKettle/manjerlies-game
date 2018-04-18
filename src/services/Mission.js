import R from 'ramda';
import Immovables from '../objects/Immovables';

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
    this.objectives = args.objectives;

    this.setWorld();
    this.game.world.setBounds(0, 0, this.world.width, this.world.height);
    this.initImmovables();
  }

  initialize(args) {
    this.player = args.player;
    this.hostiles = args.hostiles;

		// Add the mission timer
		this.timer = this.game.time.create();
		this.timerEvent = this.timer.add(this.objectives.time, this.timeUp, this);
    this.timer.start();

    this.update();
  }

  update() {
		this.delta = this.game.time.physicsElapsed;
		this.timeLeft = this.timerEvent.delay - this.timer.ms;
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
		const blockPoints = R.flatten(
			this.objectives.grid.map((row, rowIndex) => {
				return row.map((is, colIndex) => {
					return {
						is,
						x: colIndex * this.world.blocks.size,
						y: rowIndex * this.world.blocks.size
					};
				});
			})
		).filter(point => point.is === 1);

		this.immovables = new Immovables(this.game, {
			width: this.world.blocks.size,
			height: this.world.blocks.size,
			color: '#2f0100'
		});

		blockPoints.forEach(point => {
			this.immovables.spawn(point.x, point.y);
		});
	}


	check() {
		const killCount = this.hostiles.spawnedCount - this.hostiles.spriteGroup.length;
		if (killCount >= this.objectives.kills) {
			this.complete();
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
