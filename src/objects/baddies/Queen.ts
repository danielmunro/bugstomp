import Container = Phaser.GameObjects.Container;
import BattleScene from "../../scenes/BattleScene";
import GameObject = Phaser.GameObjects.GameObject;
import Group = Phaser.GameObjects.Group;

export default class Queen extends Container {
  constructor(scene: BattleScene, group: Group, x: number, y: number) {
    const wl = scene.add.image(0, 0, 'queen-legs-wings');
    const abdomen = scene.add.image(0, 32, 'queen-abdomen');
    const head = scene.add.image(0, -15, 'queen-head');
    const thorax = scene.add.image(0, 0, 'queen-thorax');
    const children: Array<GameObject> = [
      wl,
      abdomen,
      head,
      thorax,
    ];
    super(scene, x, y, children);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-25, -35, 50, 100),
      Phaser.Geom.Rectangle.Contains,
    ).on('pointerup', () => {
      console.log('yolo'); // queen hit
    });
    scene.add.existing(this);
    group.add(this);
  }

  swat(): void {}
}
