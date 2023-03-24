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
            const xVelocity = velocity();
            this.setVelocity(xVelocity, velocity());
            this.flipX = xVelocity < 0;
            setTimeout(() => this.changeVelocity(), Phaser.Math.Between(1000, 4000));
        }
    }

    attack() {
        if (this.active && this.alive) {
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
                const swatter = scene.getSwatter();
                scene.createProjectile(this.x, this.y + (this.height / 2), swatter.x, swatter.y, 200);
                created++;
            }, 100);
        }
    }
}
