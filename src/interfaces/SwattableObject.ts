import BattleScene from "../scenes/BattleScene"
import Rectangle = Phaser.Geom.Rectangle;

export default interface SwattableObject {
  swat(scene: BattleScene): void;
  getBounds(): Rectangle;
}
