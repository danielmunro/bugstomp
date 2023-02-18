import {width, height} from '../config';

export default class Swatter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, width / 2, height / 2, 'hand');
        this.depth = 1;
        scene.add.existing(this);
    }

    playSwatAnim() {
        this.anims.play('swatting', true);
    }

    hoversOver(button: Phaser.GameObjects.Image) {
        const pos = this.getBounds();
        pos.height = 16;
        pos.width = 16;
        pos.x = pos.x + 8;
        pos.y = pos.y + 8;
        return Phaser.Geom.Intersects.RectangleToRectangle(pos, button.getBounds());
    }
}
