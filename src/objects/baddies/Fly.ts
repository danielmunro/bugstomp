import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';
import Swatter from "../Swatter";
import ExplosionAffect from "../affects/ExplosionAffect";
import {height} from "../../config";
import {getSettings} from "../../userConfig";

export default class Fly extends Bug {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, group, x, y, 'fly', 10, 4000, 3000);
  }

  changeVelocity() {
    if (this.active && this.alive) {
      const towardRandomizer = Phaser.Math.Between(0, 2);
      const speed = Phaser.Math.Between(40, getSettings().flyMaxVelocity);
      const scene = this.scene as BattleScene;
      const swatter = scene.getSwatter();
      const xVelocity = this.x > swatter.x && towardRandomizer < 2 ? -speed : speed;
      this.setVelocity(
        xVelocity,
        this.y > swatter.y && towardRandomizer < 2 ? -speed : speed,
      );
      this.flipX = xVelocity < 0;
      setTimeout(() => this.changeVelocity(), 500);
    }
  }

  attack() {
    if (this.active && this.alive) {
      this.disableBody(true, true);
      const scene = this.scene as BattleScene;
      const explosion = new ExplosionAffect(scene, this.x, this.y);
      explosion.anims.play('explosion-affect')
        .once(
          Phaser.Animations.Events.ANIMATION_COMPLETE,
          () => explosion.destroy(true),
        );
      scene.flyExploded(explosion);
    }
  }
}
