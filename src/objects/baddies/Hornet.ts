import BattleScene from '../../scenes/BattleScene';
import Bug from './Bug';
import Swatter from "../Swatter";
import ExplosionAffect from "../affects/ExplosionAffect";

export default class Hornet extends Bug {
    constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'hornet', 15, 2500, 1500);
    }

    changeVelocity(swatter: Swatter) {
        if (this.active) {
            this.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
            setTimeout(() => this.changeVelocity(swatter), Phaser.Math.Between(1000, 4000));
        }
    }

    attack() {
        if (this.active) {
            this.disableBody(true, true);
            const scene = this.scene as BattleScene;
            const explosion = new ExplosionAffect(scene, this.x, this.y);
            explosion.anims.play('explosion-affect')
              .once(
                Phaser.Animations.Events.ANIMATION_COMPLETE,
                () => explosion.destroy(true),
              );
            scene.gotHit();
        }
    }
}
