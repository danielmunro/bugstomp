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
        const width = 20;
        const height = 17;
        const xOffset = 6;
        const yOffset = 3;
        pos.height = this.poweredUp ? height * 1.5 : height;
        pos.width = this.poweredUp ? width * 1.5 : width;
        pos.x = pos.x + (this.poweredUp ? xOffset * 1.5 : xOffset);
        pos.y = pos.y + (this.poweredUp ? yOffset * 1.5 : yOffset);
        return Phaser.Geom.Intersects.RectangleToRectangle(pos, sprite.getBounds());
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
