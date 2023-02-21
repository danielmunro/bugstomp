import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';
import Swatter from "../Swatter";
import ExplosionAffect from "../affects/ExplosionAffect";

export default class Fly extends Bug {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, group, x, y, 'fly', 10, 4000, 3000);
  }

  changeVelocity(swatter: Swatter) {
    if (this.active) {
      const towardRandomizer = Phaser.Math.Between(0, 2);
      const speed = Phaser.Math.Between(40, 100);
      this.setVelocity(
        this.x > swatter.x && towardRandomizer < 2 ? -speed : speed,
        this.y > swatter.y && towardRandomizer < 2 ? -speed : speed,
      );
      setTimeout(() => this.changeVelocity(swatter), 500);
    }
  }

  attack() {
    if (this.active) {
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
