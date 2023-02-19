import SwattableObject from "../interfaces/SwattableObject";
import BattleScene from "../scenes/BattleScene"

export default class Life extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    group.add(this);
    this.on('life', () => {
      scene.incrementLife();
    });
  }

  swat(): void {
    this.disableBody(true, true);
    this.emit('life');
  }
}