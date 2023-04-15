import Sprite = Phaser.Physics.Arcade.Sprite;
import SwattableObject from "../../interfaces/SwattableObject";
import Rectangle = Phaser.Geom.Rectangle;

export abstract class Powerup extends Sprite implements SwattableObject {
  getHitBounds(): Array<Rectangle> {
    return [this.getBounds()];
  }

  abstract swat(): void;
}
