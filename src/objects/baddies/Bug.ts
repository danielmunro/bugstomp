import BattleScene from "../../scenes/BattleScene";
import SwattableObject from "../../interfaces/SwattableObject";
import Swatter from "../Swatter";
import ExplosionAffect from "../affects/ExplosionAffect";

export default abstract class Bug extends Phaser.Physics.Arcade.Sprite implements SwattableObject {
  private readonly textureKey: string;
  private readonly attackTimeout: number;
  public readonly score: number;

  protected constructor(
    scene: BattleScene,
    group: Phaser.GameObjects.Group,
    x: number,
    y: number,
    texture: string,
    score: number,
    moveTimeout: number,
    attackTimeout: number,
  ) {
    super(scene, x, y, texture);
    this.score = score;
    this.textureKey = texture;
    group.add(this);
    scene.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(1, 1);
    this.anims.play(texture, true);
    this.attackTimeout = attackTimeout;
    setTimeout(() => this.startLifecycle(), moveTimeout);
    this.on('score', () => {
      scene.addScore(this.score);
    });
  }

  abstract changeVelocity(): void;

  abstract attack(): void;

  private startLifecycle() {
    if (this.active) {
      this.anims.play(`${this.textureKey}-attacking`, true);
      setTimeout(() => this.attack(), this.attackTimeout);
    }
  }

  swat() {
    this.disableBody(true, true);
    this.emit('score', this.score);
  }
}
