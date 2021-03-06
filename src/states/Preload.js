import R from 'ramda';
import { GAMEPAD } from './Main';

export const assets = {
  images: {
    bg: 'assets/blood_bg.jpg',
    parallax_far: 'assets/parallax_far.png',
    radar_mask: 'assets/radar-mask.png',
    radar_frame: 'assets/radar-frame.png',
    proximity_alert_direction: 'assets/proximity_alert_direction.png',
    guage: 'assets/guage.png',
    guage_needle: 'assets/guage_needle.png',
    parallax_mid: 'assets/parallax_mid.png',
    parallax_near: 'assets/parallax_near.png',
    cockpit: 'assets/sub-cockpit3.png',
    grid: 'assets/grid.png',
    bar_health: 'assets/health_bar.png',
    bar_energy: 'assets/energy_bar.png',
    hostile_germ: 'assets/hostile_germ.png',
    hostile_harrison: 'assets/hostile_harrison.png',
    hostile_elliot: 'assets/hostile_elliot.png',
    hostile_robin: 'assets/hostile_robin.png',
    blood_splatter: 'assets/blood_splatter.png',
    blood_splatter_green: 'assets/blood_splatter_green.png',
    blood_splatter_yellow: 'assets/blood_splatter_yellow.png',
    manjerly_fighter_ship: 'assets/manjerly_fighter_ship.png',
    turret: 'assets/manjerly_fighter_ship_turret.png',
    laser: 'assets/laser.png',
    bubble: 'assets/bubble.png',

    sub: 'assets/images/sub.png'
  },
  spritesheets: {
    gamepad: {
      src: 'assets/gamepad_spritesheet2.png',
      width: GAMEPAD.SIZE,
      height: GAMEPAD.SIZE
    },
    germ1: {
      src: 'assets/spritesheets/germ1.png',
      width: 64,
      height: 64
    }
  },
  audio: {
    // TODO: Add audio
    // myAudio: 'assets/my-audio.wav'
  }
};

export const assetKeys = R.reduce();

class Preload extends Phaser.State {
  preload() {
    Object.keys(assets.images).forEach(key => {
      this.game.load.image(key, assets.images[key]);
    });

    Object.keys(assets.spritesheets).forEach(key => {
      const { src, width, height } = assets.spritesheets[key];
      this.game.load.spritesheet(key, src, width, height);
    });

    Object.keys(assets.audio).forEach(key => {
      this.game.load.audio(key, assets.audio[key]);
    });

    // TODO: Add audio
    // this.game.load.audio('myAudio', 'assets/my-audio.wav');
  }

  create() {
    this.game.state.start('GameOver');
  }
}

export default Preload;
