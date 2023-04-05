import {width, height} from '../config';
import SwattableObject from "../interfaces/SwattableObject"
import Rectangle = Phaser.Geom.Rectangle;

export default class Swatter extends Phaser.Physics.Arcade.Sprite {
    poweredUp: boolean;
    powerUpTimeout: NodeJS.Timeout;

    constructor(scene: Phaser.Scene) {
        super(scene, width / 2, height / 2, 'hand');
        this.depth = 1;
        scene.add.existing(this);
    }

    playSwatAnim() {
        this.anims.play('swatting', true);
        this.scene.sound.play('swat');
    }

    superSize() {
        let scale = 1.5;
        this.setScale(scale, scale);
        this.poweredUp = true;
        if (this.powerUpTimeout) {
            clearTimeout(this.powerUpTimeout);
        }
        this.powerUpTimeout = setTimeout(() => {
            let amount = 0;
            const wearOutInt = setInterval(() => {
                scale = scale === 1.5 ? 1 : 1.5;
                this.setScale(scale);
                if (amount > 3) {
                    this.setScale(1, 1);
                    this.poweredUp = false;
                    clearInterval(wearOutInt);
                }
                amount++;
            }, 500);

        }, 10000);
    }
}
