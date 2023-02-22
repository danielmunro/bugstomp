import {Scene} from "phaser";
import Group = Phaser.GameObjects.Group;

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, group: Group, x: number, y: number) {
    super(scene, x, y, 'projectile');
    scene.add.existing(this);
    group.add(this);
  }
}
