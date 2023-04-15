import SwattableObject from "../../interfaces/SwattableObject";
import BattleScene from "../../scenes/BattleScene";
import Rectangle = Phaser.Geom.Rectangle;
import {Powerup} from "./Powerup";
import Group = Phaser.GameObjects.Group;

export default class Bomb extends Powerup implements SwattableObject {
  constructor(scene: BattleScene, group: Group, x: number, y: number) {
    super(scene, x, y, 'bomb');
    scene.add.existing(this);
    group.add(this);
    this.anims.play(this.texture, true);
    this.on('boom', () => {
      scene.destroyAll();
    });
  }

  getHitBounds(): Array<Rectangle> {
    return [this.getBounds()];
  }

  swat(): void {
    this.emit('boom');
    this.disableBody(true, true);
  }
}
