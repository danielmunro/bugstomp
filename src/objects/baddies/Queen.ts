import BattleScene from "../../scenes/BattleScene";
import Group = Phaser.GameObjects.Group;
import {getSettings} from "../../userConfig";
import Bug from "./Bug";
import Rectangle = Phaser.Geom.Rectangle;

export default class Queen extends Bug {
  constructor(scene: BattleScene, group: Group, x: number, y: number) {
    super(scene, group, x, y, 'queen', 10, 0, 1000);
  }

  swat(): void {
    console.log("SWAT called");
  }

  attack(): void {
    throw new Error("Method not implemented.");
  }

  changeVelocity() {
    if (this.active) {
      const maxVelocity = getSettings().hornetMaxVelocity;
      const velocity = () => Phaser.Math.Between(-maxVelocity, maxVelocity);
      this.body.velocity.x = velocity();
      this.body.velocity.y = velocity();
      // setTimeout(() => this.changeVelocity(), Phaser.Math.Between(3000, 5000));
    }
  }

  getHitBounds(): Array<Rectangle> {
    const bounds = this.getBounds();
    return [
      new Rectangle(bounds.x + 20, bounds.y, bounds.width - 40, bounds.height),
    ];
  }
}
