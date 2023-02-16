export class Bug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        group.add(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 1);
    }
}