export class Bug extends Phaser.Physics.Arcade.Sprite {
    private textureKey: string;

    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.textureKey = texture;
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

    attack(flyInt: number, attackInt: number, hit: () => void) {
        setTimeout(() => {
            if (this.active) {
                this.anims.play(`${this.textureKey}-attacking`, true);
                setTimeout(() => {
                    if (this.active) {
                        this.disableBody(true, true);
                        hit();
                    }
                }, attackInt);
            }
        }, flyInt)
    }
}