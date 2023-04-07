import Container = Phaser.GameObjects.Container;
import BattleScene from "../../scenes/BattleScene";
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.GameObjects.Group;
import {getSettings} from "../../userConfig";
import SwattableObject from "../../interfaces/SwattableObject";

export default class Queen extends Container implements SwattableObject {
  constructor(scene: BattleScene, group: Group, x: number, y: number) {
    const wl = scene.add.image(15, 15, 'queen-legs-wings');
    const abdomen = scene.add.image(15, 47, 'queen-abdomen');
    const head = scene.add.image(15, 0, 'queen-head');
    const thorax = scene.add.image(15, 15, 'queen-thorax');
    const children: Array<GameObject> = [
      wl,
      abdomen,
      head,
      thorax,
    ];
    super(scene, x, y, children);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-10, -20, 50, 100),
      Phaser.Geom.Rectangle.Contains,
    ).on('pointerup', () => {
      console.log('yolo'); // queen hit
    });
    scene.add.existing(this);
    group.add(this);
    // this.changeVelocity();
    scene.physics.world.enable(this);
    (this.body as any).setBounce(1, 1).setCollideWorldBounds(true);
  }

  swat(): void {}

  changeVelocity() {
    if (this.active) {
      const maxVelocity = getSettings().hornetMaxVelocity;
      const velocity = () => Phaser.Math.Between(-maxVelocity, maxVelocity);
      this.body.velocity.x = velocity();
      this.body.velocity.y = velocity();
      // setTimeout(() => this.changeVelocity(), Phaser.Math.Between(3000, 5000));
    }
  }

  isUnderneath(): boolean {
    return false;
  }
}
