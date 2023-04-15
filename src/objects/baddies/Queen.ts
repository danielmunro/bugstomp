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
    return [
      new Rectangle(this.x + 40, this.y - 30, 20, 16),
      new Rectangle(this.x + 40, this.y - 16, 28, 20),
      new Rectangle(this.x + 41, this.y + 16, 36, 46),
    ];
  }
}
