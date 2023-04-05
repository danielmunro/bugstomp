import SwattableObject from "../../interfaces/SwattableObject";
import Swatter from "../Swatter";

export default class Button extends Phaser.GameObjects.Image implements SwattableObject {
  isUnderneath(swatter: Swatter): boolean {
    return Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), swatter.getBounds());
  }

  swat(): void {
    this.emit('selected');
  }
}
