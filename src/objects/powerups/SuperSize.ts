import SwattableObject from "../../interfaces/SwattableObject";
import BattleScene from "../../scenes/BattleScene"

export default class SuperSize extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, x, y, 'powerup');
    scene.add.existing(this);
    group.add(this);
    this.on('supersize', () => {
      scene.superSizeSwatter();
    });
  }

  swat(): void {
    this.disableBody(true, true);
    this.emit('supersize');
  }
}
