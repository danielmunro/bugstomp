import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';

export default class Hornet extends Bug {
    constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'hornet', 15, 2500, 1500);
    }

    changeVelocity() {
        if (this.active) {
            this.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
            setTimeout(() => this.changeVelocity(), Phaser.Math.Between(1000, 4000));
        }
    }

    attack() {
        if (this.active) {
            const scene = this.scene as BattleScene;
            this.setVelocity(0, 0);
            let created = 0;
            const createAttackInt = setInterval(() => {
                if (created >= 3) {
                    clearInterval(createAttackInt);
                    this.changeVelocity();
                    this.startLifecycle();
                    return;
                }
                scene.createProjectile(this, 200);
                created++;
            }, 100);
        }
    }
}
