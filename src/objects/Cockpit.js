import R from 'ramda';
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

const padNumber = integer => {
  if (integer < 10) {
    return `0${integer}`;
  }
  return integer.toString();
};

const formatTime = ms => {
  const totalSecs = Math.floor(ms * 0.001);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${padNumber(mins)}:${padNumber(secs)}`;
};

const isBetween = (num, greaterThan, lessThan) => {
  return R.gte(num, greaterThan) && R.lt(num, lessThan);
};

class Cockpit {
  constructor(game, args) {
    this.game = game;
    this.player = args.player;
    this.hostiles = args.hostiles;
    this.immovables = args.immovables;
    this.objectives = args.objectives;

    this.proximityAlertConfig = {
      range: 500,
      minAlpha: 0.2
    };

    this.cockpitSprite = this.game.add.sprite(0, 0, 'cockpit');
    this.cockpitSprite.fixedToCamera = true;
    this.cockpitSprite.scale.setTo(0.5, 0.5);
    this.barHealthSprite = this.game.add.sprite(
      CANVAS.WIDTH * 0.5 + 75,
      CANVAS.HEIGHT - 70,
      'bar_health'
    );
    this.barHealthSprite.alpha = 0.9;
    this.barHealthSprite.fixedToCamera = true;
    this.barHealthMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
    this.barHealthSprite.crop(this.barHealthMask);
    this.barEnergySprite = this.game.add.sprite(
      CANVAS.WIDTH * 0.5 + 72,
      CANVAS.HEIGHT - 60,
      'bar_energy'
    );
    this.barEnergySprite.alpha = 0.8;
    this.barEnergySprite.fixedToCamera = true;
    this.barEnergyMask = new Phaser.Rectangle(0, 0, 0, COCKPIT.BAR_HEIGHT);
    this.barEnergySprite.crop(this.barEnergyMask);

    // Display console - user
    this.textGroup = this.game.add.group();
    this.textConsole = this.game.add.text(
      CANVAS.WIDTH * 0.5 - 200,
      CANVAS.HEIGHT - 15,
      '',
      { ...textStyleConsole, fill: '#4fa' }
    );
    this.textMission = this.game.add.text(40, 20, '', {
      ...textStyleMission,
      fill: '#4fa'
    });
    this.textMissionTime = this.game.add.text(CANVAS.WIDTH - 140, 20, '', {
      ...textStyleMission,
      fill: '#4fa'
    });
    this.textMission.alpha = 0.5;
    this.textMissionTime.alpha = 0.5;
    this.textGroup.addMultiple([
      this.textConsole,
      this.textMission,
      this.textMissionTime
    ]);
    this.textGroup.fixedToCamera = true;

    this.renderPlayerMap();
    this.renderRadar();
    this.renderThrustGuage();
    this.renderProximityAlert();
  }

  renderProximityAlert() {
    const createProximityAlert = (xOffset, yOffset) => {
      const sprite = this.game.add.sprite(
        CANVAS.WIDTH * 0.5 + xOffset,
        CANVAS.HEIGHT * 0.5 - this.player.cameraOffset.y + yOffset,
        'proximity_alert_direction'
      );
      sprite.fixedToCamera = true;
      sprite.scale.setTo(0.5);
      sprite.anchor.setTo(0.5);
      sprite.alpha = 0.2;
      return sprite;
    };

    this.proximityAlerts = {
      up: createProximityAlert(0, -50),
      right: createProximityAlert(120, 0),
      down: createProximityAlert(0, 50),
      left: createProximityAlert(-120, 0)
    };

    this.proximityAlerts.down.rotation = Math.PI;
    this.proximityAlerts.right.rotation = Math.PI * 0.5;
    this.proximityAlerts.left.rotation = -Math.PI * 0.5;
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
      grid: this.objectives.grid,
      offset: {
        x: 25,
        y: 70
      }
    });
  }

  update(timeLeft) {
    this.textMission.setText(
      `Destroy ${this.objectives.kills} hostiles before it’s too late!`
    );
    this.textMissionTime.setText(formatTime(timeLeft));

    this.textConsole.setText(
      `Targets destroyed: ${this.hostiles.spawnedCount -
        this.hostiles.spriteGroup.length} - <|${this.game.time.fps}|>`
    );

    this.barHealthMask.width =
      COCKPIT.BAR_WIDTH * Math.floor(this.player.health * 10) / 10;
    this.barEnergyMask.width =
      COCKPIT.BAR_WIDTH * Math.floor(this.player.energy * 10) / 10;
    this.barHealthSprite.updateCrop();
    this.barEnergySprite.updateCrop();

    this.playerMap.updatePlayer(this.player.sprite.x, this.player.sprite.y);
    this.radar.update(this.player, this.hostiles);
    this.thrustGuage.update(this.player.thrust / this.player.maxThrust);

    this.updateProximityAlert();
  }

  updateProximityAlert() {
    // Reset alerts
    Object.keys(this.proximityAlerts).forEach(key => {
      this.proximityAlerts[key].alpha = this.proximityAlertConfig.minAlpha;
    });

    const proximities = this.immovables.spriteGroup.children
      .concat(this.hostiles.spriteGroup.children)
      .map(sprite => {
        return {
          distance: Phaser.Math.distance(
            this.player.sprite.centerX,
            this.player.sprite.centerY,
            sprite.centerX,
            sprite.centerY
          ),
          angle: Phaser.Math.angleBetween(
            this.player.sprite.centerX,
            this.player.sprite.centerY,
            sprite.centerX,
            sprite.centerY
          )
        };
      });

    const closestProximity = R.reduce(
      (acc, val) => {
        return !acc || val.distance < acc.distance ? val : acc;
      },
      undefined,
      proximities
    );

    if (closestProximity.distance < this.proximityAlertConfig.range) {
      // 1. if within range set alpha based on proximity
      const alpha = R.clamp(0, 1)(
        (this.proximityAlertConfig.range - closestProximity.distance) /
          this.proximityAlertConfig.range +
          this.proximityAlertConfig.minAlpha * 2
      );

      // 2. Only show the alert in general direction
      if (isBetween(closestProximity.angle, -Math.PI * 0.75, -Math.PI * 0.25)) {
        this.proximityAlerts.up.alpha = alpha;
        return;
      }

      if (isBetween(closestProximity.angle, Math.PI * 0.25, Math.PI * 0.75)) {
        this.proximityAlerts.down.alpha = alpha;
        return;
      }

      if (Math.abs(closestProximity.angle) > Math.PI * 0.5) {
        this.proximityAlerts.left.alpha = alpha;
        return;
      }

      this.proximityAlerts.right.alpha = alpha;
      return;
    }
  }
}

export default Cockpit;
