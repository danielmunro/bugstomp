import SwattableObject from "../../interfaces/SwattableObject";
import BattleScene from "../../scenes/BattleScene"
import Swatter from "../Swatter";

export default class Life extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, x, y, 'life');
    scene.add.existing(this);
    group.add(this);
    this.on('life', () => {
      scene.incrementLife();
    });
  }

  isUnderneath(swatter: Swatter): boolean {
    return Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), swatter.getBounds());
  }

  swat(): void {
    this.emit('life');
    this.disableBody(true, true);
  }
}
