import BattleScene from "../scenes/BattleScene";

export default class Bug extends Phaser.Physics.Arcade.Sprite {
    private readonly textureKey: string;
    public readonly score: number;

    constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number, texture: string, score: number, moveTimeout: number, attackTimeout: number) {
        super(scene, x, y, texture);
        this.score = score;
        this.textureKey = texture;
        group.add(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 1);
        this.anims.play(texture, true);
        setTimeout(() => {
            if (this.active) {
                this.anims.play(`${this.textureKey}-attacking`, true);
                setTimeout(() => {
                    if (this.active) {
                        this.disableBody(true, true);
                        scene.gotHit();
                    }
                }, attackTimeout);
            }
        }, moveTimeout);
    }

    changeVelocity() {
        if (this.active) {
            this.setVelocity(Phaser.Math.Between(-150, 150), Phaser.Math.Between(-150, 150));
            setTimeout(() => this.changeVelocity(), Phaser.Math.Between(1000, 4000));
        }
    }
}
