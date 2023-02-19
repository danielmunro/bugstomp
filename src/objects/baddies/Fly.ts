import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';
import Swatter from "../Swatter";

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
}
