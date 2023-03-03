import SwattableObject from "../../interfaces/SwattableObject";
import BattleScene from "../../scenes/BattleScene"

export default class Bomb extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this);
    group.add(this);
    this.on('boom', () => {
      scene.destroyAll();
    });
  }

  swat(): void {
    this.disableBody(true, true);
    this.emit('boom');
  }
}
