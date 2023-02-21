import BattleScene from "../../scenes/BattleScene"

export default class ExplosionAffect extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: BattleScene, x: number, y: number) {
    super(scene, x, y, 'explosion');
    scene.add.existing(this);
  }
}
