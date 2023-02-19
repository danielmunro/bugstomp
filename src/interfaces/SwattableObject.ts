import BattleScene from "../scenes/BattleScene"
import Rectangle = Phaser.Geom.Rectangle;

export default interface SwattableObject {
  swat(): void;
  getBounds(): Rectangle;
}
