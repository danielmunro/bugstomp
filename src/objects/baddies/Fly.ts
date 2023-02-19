import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';
import Swatter from "../Swatter";

export default class Fly extends Bug {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, group, x, y, 'fly', 10, 4000, 3000);
  }

  changeVelocity(swatter: Swatter) {
    if (this.active) {
      this.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
      setTimeout(() => this.changeVelocity(swatter), Phaser.Math.Between(1000, 4000));
    }
  }
}
