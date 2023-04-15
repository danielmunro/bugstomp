import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';

export default class Dragonfly extends Bug {
  private readonly startOnLeft: boolean;

  constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
    super(scene, group, x, y, 'dragonfly', 10, 0, 1000);
    this.setCollideWorldBounds(false);
    this.startOnLeft = x === 0;
    if (!this.startOnLeft) {
      this.flipX = true;
    }
  }

  changeVelocity() {
    if (this.active) {
      const speed = Phaser.Math.Between(100, 200);
      this.setVelocityX(this.startOnLeft ? speed : -speed);
    }
  }

  attack() {
    if (this.active) {
      const scene = this.scene as BattleScene;
      let created = 0;
      this.scene.sound.play('falling-bomb');
      const createAttackInt = setInterval(() => {
        if (created >= 3) {
          clearInterval(createAttackInt);
          return;
        }
        const swatter = scene.getSwatter();
        scene.createProjectile(this.x, this.y + (this.height / 2), swatter.x, swatter.y, 200);
        created++;
      }, 100);
    }
  }
}
