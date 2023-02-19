import { width, height } from '../config';
import Bug from '../objects/Bug';
import Fly from '../objects/Fly';
import Hornet from '../objects/Hornet';
import Swatter from '../objects/Swatter';
import Life from "../objects/Life"
import Powerup from "../objects/Powerup"
import SwattableObject from "../interfaces/SwattableObject"

export default class BattleScene extends Phaser.Scene {
    private score = 0;
    private scoreText: Phaser.GameObjects.Text;
    private livesText: Phaser.GameObjects.Text;
    private timerLabel: Phaser.GameObjects.Text;
    private swatter: Swatter;
    private swattables: Phaser.GameObjects.Group;
    private lives = 3;
    private gameOver = false;
    private gameTimer = 0;
    private flyCreateCounter = 0
    private hornetCreateCounter = 0;
    private intervals: Array<NodeJS.Timer> = [];

    constructor() {
        super({ key: 'battle-scene' });
    }

    preload(): void {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('life', 'assets/level-up.png');
        this.load.image('powerup', 'assets/power-up.png');
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
        this.swattables = this.physics.add.group();
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
        this.intervals.push(setInterval(() => this.updateGameTimer(), 1000));
        this.intervals.push(setInterval(() => this.sendWave(), 8000));
        this.intervals.push(setInterval(() => this.create1Up(), 18000));
        this.intervals.push(setInterval(() => this.createPowerUp(), 10000));
    }

    update() {
        if (this.gameOver) {
            this.intervals.forEach((interval) => clearInterval(interval));
            this.swattables.children.iterate((bug) => {
                bug.setActive(false);
            });
            this.input.setDefaultCursor('auto');
            return;
        }
        const pointer = this.input.activePointer;
        this.swatter.setPosition(pointer.x, pointer.y + 16);
    }

    gotHit() {
        if (this.lives < 1) {
            this.physics.pause();
            this.gameOver = true;
            return;
        }
        this.lives -= 1;
        this.livesText.setText(`lives: ${this.lives}`);
    }

    incrementLife() {
        this.lives++;
        this.livesText.setText(`lives: ${this.lives}`);
    }

    powerUpSwatter() {
        this.swatter.doPowerUp();
    }

    addScore(score: number) {
        this.score += score;
        this.scoreText.setText(`score: ${this.score}`);
    }

    private createPowerUp() {
        const y = height + 16;
        const x = Phaser.Math.Between(100, width - 100);
        const powerup = new Powerup(this, this.swattables, x, y, 'powerup');
        powerup.setVelocityY(-100);
        const moveInt = setInterval(() => {
            if (powerup.y < 0) {
                powerup.disableBody(true, true);
            }
            if (powerup.active) {
                powerup.setVelocityX(Phaser.Math.Between(0, 1) == 1 ? -50 : 50);
            } else {
                clearTimeout(moveInt);
            }
        }, 800);
    }

    private create1Up() {
        const y = height + 16;
        const x = Phaser.Math.Between(100, width - 100);
        const life = new Life(this, this.swattables, x, y, 'life');
        life.setVelocityY(-100);
        const moveInt = setInterval(() => {
            if (life.y < 0) {
                life.disableBody(true, true);
            }
            if (life.active) {
                life.setVelocityX(Phaser.Math.Between(0, 1) == 1 ? -50 : 50);
            } else {
                clearTimeout(moveInt);
            }
        }, 800);
    }

    private sendWave() {
        if (this.gameTimer < 20) {
            this.sendFlyWave();
        } else {
            this.sendHornetWave();
        }
    }

    private swat() {
        this.swatter.playSwatAnim();
        this.swattables.children.iterate((swat: any) => {
            const swattable = swat as SwattableObject;
            if (this.swatter.hoversOver(swattable)) {
                swattable.swat();
            }
        });
    }

    private createFly() {
        this.flyCreateCounter++;
        if (this.flyCreateCounter < 30 || this.gameTimer > 10 && this.flyCreateCounter < 15) {
            return;
        }
        this.flyCreateCounter = 0;
        const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
        const fly = new Fly(this, this.swattables, x ? 100 : width - 100, y ? 100 : height - 100);
        fly.changeVelocity();
    }

    private createHornet() {
        this.hornetCreateCounter++;
        if (this.gameTimer < 10 || this.gameTimer < 27 && this.hornetCreateCounter < 30 || this.hornetCreateCounter < 20) {
            return;
        }
        this.hornetCreateCounter = 0;
        const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
        const hornet = new Hornet(this, this.swattables, x ? 100 : width - 100, y ? 100 : height - 100);
        hornet.changeVelocity();
    }

    private updateGameTimer() {
        this.gameTimer++;
        this.timerLabel.setText(this.gameTimer.toString());
    }

    private sendFlyWave() {
        const side = Phaser.Math.Between(0, 4);
        const velocity = side < 2 ? -150 : 150;
        const coords = BattleScene.getCoords(side);
        coords.forEach((coord) => {
            const bug = new Fly(this, this.swattables, coord[0], coord[1]);
            if (side % 2 == 0) {
                bug.setVelocityY(velocity);
            } else {
                bug.setVelocityX(velocity);
            }
            setTimeout(() => bug.changeVelocity(), Phaser.Math.Between(3000, 5000));
        });
    }

    private sendHornetWave() {
        const side = Phaser.Math.Between(0, 4);
        const velocity = side < 2 ? -150 : 150;
        const coords = BattleScene.getCoords(side);
        coords.forEach((coord) => {
            const bug = new Hornet(this, this.swattables, coord[0], coord[1]);
            if (side % 2 == 0) {
                bug.setVelocityY(velocity);
            } else {
                bug.setVelocityX(velocity);
            }
            setTimeout(() => bug.changeVelocity(), Phaser.Math.Between(2000, 4000));
        });
    }

    private static getCoords(side: number): Array<Array<number>> {
        const coords: Array<Array<number>> = [];
        const x = width / 4;
        const y = height / 4;
        if (side === 0) {
            coords.push([x, y * 3]);
            coords.push([x * 2, y * 3]);
            coords.push([x * 3, y * 3]);
        } else if (side === 1) {
            coords.push([x * 3, y]);
            coords.push([x * 3, y * 2]);
            coords.push([x * 3, y * 3]);
        } else if (side === 2) {
            coords.push([x, y]);
            coords.push([x * 2, y]);
            coords.push([x * 3, y]);
        } else if (side === 3) {
            coords.push([x, y]);
            coords.push([x, y * 2]);
            coords.push([x, y * 3]);
        }
        return coords;
    }
}
