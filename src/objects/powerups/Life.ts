import SwattableObject from "../../interfaces/SwattableObject";
import BattleScene from "../../scenes/BattleScene"
import Swatter from "../Swatter";
import Rectangle = Phaser.Geom.Rectangle;
import {Powerup} from "./Powerup";
import Group = Phaser.GameObjects.Group;

export default class Life extends Powerup implements SwattableObject {
  constructor(scene: BattleScene, group: Group, x: number, y: number) {
    super(scene, x, y, 'life');
    scene.add.existing(this);
    group.add(this);
    this.on('life', () => {
      scene.incrementLife();
    });
  }

  getHitBounds(): Array<Rectangle> {
    return [this.getBounds()];
  }

  swat(): void {
    this.emit('life');
    this.disableBody(true, true);
  }
}
