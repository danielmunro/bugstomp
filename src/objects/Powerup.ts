import SwattableObject from "../interfaces/SwattableObject";

export default class Powerup extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  swat(): void {
    this.disableBody(true, true);
    // scene.powerUpSwatter();
  }
}
