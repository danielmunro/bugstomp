import SwattableObject from "../../interfaces/SwattableObject";
import BattleScene from "../../scenes/BattleScene"
import Swatter from "../Swatter";

export default class Bomb extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this);
    group.add(this);
    this.anims.play(this.texture, true);
    this.on('boom', () => {
      scene.destroyAll();
    });
  }

  isUnderneath(swatter: Swatter): boolean {
    return Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), swatter.getBounds());
  }

  swat(): void {
    this.emit('boom');
    this.disableBody(true, true);
  }
}
