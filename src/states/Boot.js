class Boot extends Phaser.State {

	preload() {
		this.game._global = {
			score: 0,
			highScore: 0,
			missionCount: 0,
			missionComplete: false,
			timeUp: false
		};
	}

	create() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.game.state.start('Preload');
	}

}

export default Boot;