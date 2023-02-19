import {width, height} from '../config';

export default class Swatter extends Phaser.Physics.Arcade.Sprite {
    poweredUp: boolean;

    constructor(scene: Phaser.Scene) {
        super(scene, width / 2, height / 2, 'hand');
        this.depth = 1;
        scene.add.existing(this);
    }

    playSwatAnim() {
        this.anims.play('swatting', true);
    }

    hoversOver(sprite: Phaser.GameObjects.Image) {
        const pos = this.getBounds();
        const size = this.poweredUp ? 32 : 16;
        pos.height = size;
        pos.width = size;
        pos.x = pos.x + 8;
        pos.y = pos.y + 8;
        return Phaser.Geom.Intersects.RectangleToRectangle(pos, sprite.getBounds());
    }
}
