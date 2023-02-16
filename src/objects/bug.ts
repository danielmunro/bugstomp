export class Bug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        group.add(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 1);
        this.anims.play(texture, true);
    }

    changeVelocity() {
        if (this.active) {
            this.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
            setTimeout(() => this.changeVelocity(), Phaser.Math.Between(1000, 4000));
        }
    }
}