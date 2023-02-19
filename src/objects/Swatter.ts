import {width, height} from '../config';
import SwattableObject from "../interfaces/SwattableObject"

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
    }

    hoversOver(sprite: SwattableObject) {
        const pos = this.getBounds();
        const size = this.poweredUp ? 32 : 16;
        pos.height = size;
        pos.width = size;
        pos.x = pos.x + 8;
        pos.y = pos.y + 8;
        return Phaser.Geom.Intersects.RectangleToRectangle(pos, sprite.getBounds());
    }

    superSize() {
        let scale = 2;
        this.setScale(scale, scale);
        this.poweredUp = true;
        if (this.powerUpTimeout) {
            clearTimeout(this.powerUpTimeout);
        }
        this.powerUpTimeout = setTimeout(() => {
            let amount = 0;
            const wearOutInt = setInterval(() => {
                scale = scale === 2 ? 1 : 2;
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
