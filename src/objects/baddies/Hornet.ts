import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';
import {getSettings} from "../../userConfig";

export default class Hornet extends Bug {
    constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'hornet', 15, 2500, 1500);
    }

    changeVelocity() {
        if (this.active) {
            const maxVelocity = getSettings().hornetMaxVelocity;
            const velocity = () => Phaser.Math.Between(-maxVelocity, maxVelocity);
            this.setVelocity(velocity(), velocity());
            setTimeout(() => this.changeVelocity(), Phaser.Math.Between(1000, 4000));
        }
    }

    attack() {
        if (this.active) {
            const scene = this.scene as BattleScene;
            this.setVelocity(0, 0);
            let created = 0;
            this.scene.sound.play('shooting');
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
