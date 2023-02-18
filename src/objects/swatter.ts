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
}
