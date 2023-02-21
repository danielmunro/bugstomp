import BattleScene from "../../scenes/BattleScene"

export default class LifeAffect extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: BattleScene, x: number, y: number) {
    super(scene, x, y, 'life-affect');
    scene.add.existing(this);
  }
}
