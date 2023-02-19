import SwattableObject from "../../interfaces/SwattableObject";

export default class Button extends Phaser.GameObjects.Image implements SwattableObject {
  swat(): void {
    this.emit('selected');
  }
}
