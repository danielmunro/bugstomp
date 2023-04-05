import SwattableObject from "../../interfaces/SwattableObject";
import BattleScene from "../../scenes/BattleScene"
import Swatter from "../Swatter";

export default class SuperSize extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, x, y, 'powerup');
    scene.add.existing(this);
    group.add(this);
    this.on('supersize', () => {
      scene.superSizeSwatter();
    });
  }

  isUnderneath(swatter: Swatter): boolean {
    return Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), swatter.getBounds());
  }

  swat(): void {
    this.emit('supersize');
    this.disableBody(true, true);
  }
}
