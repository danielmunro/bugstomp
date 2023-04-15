import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';
import {getSettings} from "../../userConfig";

export default class Beetle extends Bug {
  private hp = 2;

  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, group, x, y, 'beetle', 10, 4000, 3000);
  }

  changeVelocity() {
    if (this.active && this.alive) {
      const towardRandomizer = Phaser.Math.Between(0, 2);
      const speed = Phaser.Math.Between(40, getSettings().flyMaxVelocity);
      const scene = this.scene as BattleScene;
      const swatter = scene.getSwatter();
      const xVelocity = this.x > swatter.x && towardRandomizer < 2 ? -speed : speed;
      this.setVelocity(
        xVelocity,
        this.y > swatter.y && towardRandomizer < 2 ? -speed : speed,
      );
      this.flipX = xVelocity < 0;
      setTimeout(() => this.changeVelocity(), 500);
    }
  }

  attack() {
    if (this.active && this.alive) {
      const scene = this.scene as BattleScene;
      this.setVelocity(0, 0);
      let created = 0;
      this.scene.sound.play('shooting');
      const {width, height} = this.scene.scale;
      const third = height / 3;
      const targets = [
        {x: width / 2,  y: 0},
        {x: width, y: third},
        {x: width, y: third * 2},
        {x : width / 2, y: height},
        {x: 0, y: third * 2},
        {x: 0, y: third},
      ];
      const createAttackInt = setInterval(() => {
        if (created >= targets.length) {
          clearInterval(createAttackInt);
          this.changeVelocity();
          this.startLifecycle();
          return;
        }
        scene.createProjectile(this.x, this.y + (this.height / 2), targets[created].x, targets[created].y, 200);
        created++;
      }, 100);
    }
  }

  swat() {
    this.hp--;
    this.play('beetle-hit');
    this.scene.sound.play('beetle-hit');
    setTimeout(() => this.play('beetle'), 200);
    if (this.hp == 0) {
      super.swat();
    }
  }
}
