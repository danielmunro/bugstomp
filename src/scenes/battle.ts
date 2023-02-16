import { width, height } from '../config';
import { Bug } from '../objects/bug';
import { Swatter } from '../objects/swatter';

export class BattleScene extends Phaser.Scene {
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private livesText: Phaser.GameObjects.Text;
    private timerLabel: Phaser.GameObjects.Text;
    private swatter: Swatter;
    private flies: Phaser.GameObjects.Group;
    private hornets: Phaser.GameObjects.Group;
    private lives = 3;
    private gameOver = false;
    private gameTimer = 0;
    private flyCreateCounter = 0
    private hornetCreateCounter = 0;
    private intervals: Array<NodeJS.Timer> = [];

    constructor() {
        super({ key: 'BattleScene' });
    }

    preload(): void {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('fly',
            'assets/fly.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('fly-attacking',
            'assets/fly-attacking.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('hornet',
            'assets/hornet.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('hornet-attacking',
            'assets/hornet-attacking.png',
            { frameWidth: 32, frameHeight: 32 }
        );
        this.load.spritesheet('hand',
            'assets/swatter.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create(): void {
        this.add.image(width / 2, height / 2, 'sky');
        this.flies = this.physics.add.group();
        this.hornets = this.physics.add.group();
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('fly', { start: 0, end: 1 }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'fly-attacking',
            frames: this.anims.generateFrameNumbers('fly-attacking', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'hornet',
            frames: this.anims.generateFrameNumbers('hornet', { start: 0, end: 1 }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'hornet-attacking',
            frames: this.anims.generateFrameNumbers('hornet-attacking', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1,
        });

        const fontStyle = { fontSize: '32px', fill: '#000' };
        this.scoreText = this.add.text(16, 16, 'score: 0', fontStyle);
        this.livesText = this.add.text(16, 48, `lives: ${this.lives}`, fontStyle);
        this.timerLabel = this.add.text((width / 2) - 16, 16, this.gameTimer.toString(), fontStyle);

        this.swatter = new Swatter(this);

        this.anims.create({
            key: 'swatting',
            frames: this.anims.generateFrameNumbers('hand', { start: 0, end: 2 }),
            frameRate: 20,
        });

        this.input.on('pointerup', this.swat.bind(this));
        
        this.input.setDefaultCursor('none');
        
        this.flyCreateCounter = 1000;
        this.createFly();
        
        this.intervals.push(setInterval(() => this.createFly(), 100));
        this.intervals.push(setInterval(() => this.createHornet(), 100));
        this.intervals.push(setInterval(this.updateGameTimer.bind(this), 1000));
    }

    update() {
        if (this.gameOver) {
            this.intervals.forEach((interval) => clearInterval(interval));
            this.flies.children.iterate((bug) => {
                bug.setActive(false);
            });
            this.hornets.children.iterate((bug) => {
                bug.setActive(false);
            });
            this.input.setDefaultCursor('auto');
            return;
        }
        const pointer = this.input.activePointer;
        this.swatter.setPosition(pointer.x, pointer.y + 16);
    }

    private swat() {
        this.swatter.playSwatAnim();
        const pos = this.swatter.getBounds();
        pos.height = 16;
        pos.width = 16;
        pos.x = pos.x + 8;
        pos.y = pos.y + 8;
        this.checkSwat(pos, this.flies);
        this.checkSwat(pos, this.hornets);
    }

    private checkSwat(pos: Phaser.Geom.Rectangle, bugs: Phaser.GameObjects.Group) {
        bugs.children.iterate((bug: Bug) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(pos, bug.getBounds())) {
                this.swatBug(bug);
            }
        });
    }

    private swatBug(bug: Bug) {
        bug.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`score: ${this.score}`);
    }

    private createFly() {
        this.flyCreateCounter++;
        if (this.flyCreateCounter < 30 || this.gameTimer > 10 && this.flyCreateCounter < 15) {
            return;
        }
        this.flyCreateCounter = 0;
        if (this.flies.countActive(true) > 5) {
            return;
        }
        const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
        const fly = new Bug(this, this.flies, x ? 100 : width - 100, y ? 100 : height - 100, 'fly');
        fly.changeVelocity();
        fly.attack(4000, 3000, this.gotHit.bind(this));
    }

    private createHornet() {
        this.hornetCreateCounter++;
        if (this.gameTimer < 10 || this.gameTimer < 27 && this.hornetCreateCounter < 30 || this.hornetCreateCounter < 20) {
            return;
        }
        this.hornetCreateCounter = 0;
        if (this.hornets.countActive(true) > 1 || this.gameTimer > 27 && this.hornets.countActive(true) > 2) {
            return;
        }
        const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
        const hornet = new Bug(this, this.hornets, x ? 100 : width - 100, y ? 100 : height - 100, 'hornet');
        hornet.changeVelocity();
        hornet.attack(2500, 1500, this.gotHit.bind(this));
    }

    private gotHit() {
        if (this.lives < 1) {
            this.physics.pause();
            this.gameOver = true;
            return;
        }
        this.lives -= 1;
        this.livesText.setText(`lives: ${this.lives}`);
    }

    private updateGameTimer() {
        this.gameTimer++;
        this.timerLabel.setText(this.gameTimer.toString());
    }
}
