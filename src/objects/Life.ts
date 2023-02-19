import SwattableObject from "../interfaces/SwattableObject";

export default class Life extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  swat(): void {
    this.disableBody(true, true);
    // scene.incrementLife();
  }
}
