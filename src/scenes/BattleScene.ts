import {width, height} from '../config';
import Fly from '../objects/baddies/Fly';
import Hornet from '../objects/baddies/Hornet';
import Swatter from '../objects/Swatter';
import Life from "../objects/powerups/Life";
import SuperSize from "../objects/powerups/SuperSize";
import SwattableObject from "../interfaces/SwattableObject";
import LifeAffect from "../objects/affects/LifeAffect";
import ExplosionAffect from "../objects/affects/ExplosionAffect";
import Projectile from "../objects/baddies/Projectile";
import Bomb from "../objects/powerups/Bomb";
import Dragonfly from "../objects/baddies/Dragonfly";
import Button from "../objects/ui/Button";
import { swatter, ui } from "../preloaders";
import LoaderAwareScene from "./LoaderAwareScene";
import {getSettings} from "../userConfig";

export default class BattleScene extends LoaderAwareScene {
  private score = 0;
  private highScoreText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private timerLabel: Phaser.GameObjects.Text;
  private swatter: Swatter;
  private swattables: Phaser.GameObjects.Group;
  private projectiles: Phaser.GameObjects.Group;
  private lives = getSettings().startLives;
  private gameOver = false;
  private gameTimer = 0;
  private flyCreateCounter = 0;
  private hornetCreateCounter = 0;
  private dragonflyCreateCounter = 0;
  private intervals: Array<NodeJS.Timer> = [];
  private invincible = false;
  private lifeAffect: Phaser.GameObjects.Sprite;
  private music: Array<Phaser.Sound.BaseSound> = [];
  private musicIndex = 0;
  private buttons: Array<Button> = [];
  private static maxScoreThisSession = 0;
  private background: Phaser.GameObjects.Image;

  constructor() {
    super('battle');
  }

  preload(): void {
    this.addLoader(swatter(this));
    this.addLoader(ui(this));
    this.load.image('bg', 'assets/bg-clouds.jpg');
    this.load.image('life', 'assets/level-up.png');
    this.load.image('powerup', 'assets/power-up.png');
    this.load.image('projectile', 'assets/projectile.png');
    this.load.spritesheet('fly',
      'assets/fly.png',
      {frameWidth: 32, frameHeight: 32}
    );
    this.load.spritesheet('fly-attacking',
      'assets/fly-attacking.png',
      {frameWidth: 32, frameHeight: 32}
    );
    this.load.spritesheet('hornet',
      'assets/hornet.png',
      {frameWidth: 32, frameHeight: 32}
    );
    this.load.spritesheet('hornet-attacking',
      'assets/hornet-attacking.png',
      {frameWidth: 32, frameHeight: 32}
    );
    this.load.spritesheet('dragonfly',
      'assets/dragonfly.png',
      {frameWidth: 48, frameHeight: 32}
    );
    this.load.spritesheet('life-affect',
      'assets/life-affect.png',
      {frameWidth: 32, frameHeight: 48}
    );
    this.load.spritesheet('explosion-affect',
      'assets/explosion-affect.png',
      {frameWidth: 48, frameHeight: 48}
    );
    this.load.spritesheet('bomb',
      'assets/bomb-power-up.png',
      {frameWidth: 32, frameHeight: 32}
    );
    this.load.audio('got-hit', 'assets/got-hit.mp3');
    this.load.audio('shooting', 'assets/shooting.mp3');
    this.load.audio('falling-bomb', 'assets/falling-bomb.mp3');
    this.load.audio('pop', 'assets/pop.mp3');
    this.load.audio('euphoria', 'assets/euphoria.mp3');
    this.load.audio('modern-summer', 'assets/modern-summer.mp3');
    this.load.audio('rock-the-party', 'assets/rock-the-party.mp3');
    this.load.audio('trap', 'assets/trap.mp3');
    this.load.audio('game-over', 'assets/game-over.mp3');
  }

  create(): void {
    this.callLoaders();
    this.score = 0;
    this.gameTimer = 0;
    this.background = this.add.image(width / 2, height / 2, 'bg');
    this.swattables = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('fly', {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'fly-attacking',
      frames: this.anims.generateFrameNumbers('fly-attacking', {
        start: 0,
        end: 3
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'hornet',
      frames: this.anims.generateFrameNumbers('hornet', {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'hornet-attacking',
      frames: this.anims.generateFrameNumbers('hornet-attacking', {
        start: 0,
        end: 3
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'dragonfly',
      frames: this.anims.generateFrameNumbers('dragonfly', {
        start: 0,
        end: 2
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'life-affect',
      frames: this.anims.generateFrameNumbers('life-affect', {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: 'explosion-affect',
      frames: this.anims.generateFrameNumbers('explosion-affect', {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: 0,
    });
    this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb', {
        start: 0,
        end: 2,
      }),
      frameRate: 4,
      repeat: -1,
    });

    const fontStyle = {fontSize: '32px', fill: '#000'};
    this.scoreText = this.add.text(16, 16, 'score: 0', fontStyle);
    this.livesText = this.add.text(16, 48, `lives: ${this.lives}`, fontStyle);
    this.highScoreText = this.add.text(16, 80, '', fontStyle);
    if (BattleScene.maxScoreThisSession > 0) {
      this.highScoreText.setText('high score: ' + BattleScene.maxScoreThisSession);
    }
    this.timerLabel = this.add.text((width / 2) - 16, 16, this.gameTimer.toString(), fontStyle);

    this.swatter = new Swatter(this);

    this.input.on('pointerup', this.swat.bind(this));

    this.input.setDefaultCursor('none');

    this.flyCreateCounter = 1000;
    this.createFly();
    const settings = getSettings();

    this.intervals.push(setInterval(() => this.createFly(), 100));
    setTimeout(
      () => this.intervals.push(setInterval(() => this.createHornet(), 100)),
      settings.hornetAppear,
    );
    setTimeout(
      () => this.intervals.push(setInterval(() => this.createDragonfly(), 100)),
      settings.dragonflyAppear,
    );
    this.intervals.push(setInterval(() => this.updateGameTimer(), 1000));
    this.intervals.push(setInterval(() => this.sendWave(), settings.sendSmallWave));
    this.intervals.push(setInterval(() => this.sendMegaWave(), settings.sendMegaWave));
    this.intervals.push(setInterval(() => this.create1Up(), 18000));
    this.intervals.push(setInterval(() => this.createPowerUp(), 10000));
    this.intervals.push(setInterval(() => this.createBomb(), 18000));
    this.music.push(this.sound.add('euphoria'));
    this.music.push(this.sound.add('modern-summer'));
    this.music.push(this.sound.add('action-workout'));
    this.music.push(this.sound.add('rock-the-party'));
    this.music.push(this.sound.add('trap'));
    this.music[this.musicIndex].play();
  }

  update() {
    const pointer = this.input.activePointer;
    this.swatter.setPosition(pointer.x, pointer.y + 16);
    if (this.lifeAffect) {
      this.lifeAffect.setPosition(pointer.x, pointer.y + 16);
    }
    if (this.gameOver) {
      if (this.music[this.musicIndex].isPlaying) {
        this.music[this.musicIndex].stop();
      }
      return;
    }
    this.projectiles.children.each((projectile) => {
      const p = projectile as Projectile;
      if (Phaser.Geom.Intersects.RectangleToRectangle(p.getBounds(), this.swatter.getBounds())) {
        this.gotHit();
      }
    });
    this.swattables.children.each((swattable) => {
      if (!swattable.active) {
        this.swattables.remove(swattable);
      }
    });
    if (!this.music[this.musicIndex].isPlaying) {
      this.musicIndex += 1;
      if (this.musicIndex >= this.music.length) {
        this.musicIndex = 0;
      }
      this.music[this.musicIndex].play();
    }
  }

  getSwatter(): Swatter {
    return this.swatter;
  }

  flyExploded(explosion: ExplosionAffect) {
    const explosionBounds = explosion.getBounds();
    const swatterBounds = this.swatter.getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(explosionBounds, swatterBounds)) {
      this.gotHit();
    }
  }

  createProjectile(h: Hornet, speed: number) {
    const p = new Projectile(this, this.projectiles, h.x, h.y + (h.height / 2));
    const angleDeg = (Math.atan2(this.swatter.y - p.y , this.swatter.x - p.x) * 180 / Math.PI);
    const velocity = this.physics.velocityFromAngle(angleDeg, speed);
    p.setVelocity(velocity.x, velocity.y);
  }

  gotHit() {
    if (this.invincible || this.gameOver) {
      return;
    }
    this.sound.play('got-hit');
    if (this.lives < 1) {
      this.physics.pause();
      this.doGameOver();
      return;
    }
    this.lives -= 1;
    this.livesText.setText(`lives: ${this.lives}`);
    this.invincible = true;
    const flashInt = setInterval(
      () => this.swatter.setAlpha(this.swatter.alpha === 0.25 ? 1 : 0.25),
      50,
      );
    setTimeout(() => {
      clearInterval(flashInt);
      this.swatter.clearAlpha();
      this.invincible = false;
    }, 600);
  }

  destroyAll() {
    this.swattables.children.each((swattable: any) => {
      if (swattable instanceof Bomb) {
        return;
      }
      if (swattable instanceof Life || swattable instanceof SuperSize) {
        swattable.disableBody(true, true);
        return;
      }
      const sw = swattable as SwattableObject;
      const explosion = new ExplosionAffect(this, sw.x, sw.y);
      explosion.anims.play('explosion-affect')
        .once(
          Phaser.Animations.Events.ANIMATION_COMPLETE,
          () => {
            explosion.destroy(true);
            sw.swat();
          },
        );
    });
  }

  incrementLife() {
    this.lives++;
    this.livesText.setText(`lives: ${this.lives}`);
    this.lifeAffect = new LifeAffect(this, this.swatter.x, this.swatter.y);
    this.lifeAffect.setDepth(2);
    if (this.swatter.poweredUp) {
      this.lifeAffect.setScale(1.5, 1.5);
    }
    this.lifeAffect.anims.play('life-affect');
    setTimeout(() => {
      this.lifeAffect.destroy(true);
    }, 1000);
  }

  superSizeSwatter() {
    this.swatter.superSize();
  }

  addScore(score: number) {
    this.score += score;
    this.scoreText.setText(`score: ${this.score}`);
  }

  private doGameOver() {
    this.gameOver = true;
    if (this.score > BattleScene.maxScoreThisSession) {
      BattleScene.maxScoreThisSession = this.score;
    }
    this.tweens.add({
      targets: this.background,
      duration: 1000,
      alpha: 0.1,
    });
    this.music[this.musicIndex].stop();
    this.sound.play('game-over');
    this.intervals.forEach((interval) => clearInterval(interval));
    this.swattables.children.iterate((bug) => {
      bug.setActive(false);
      this.tweens.add({
        targets: bug,
        duration: 1000,
        alpha: 0.1,
      });
    });
    const startOverButton = new Button(this, width / 2, height - 100, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(startOverButton);
    this.add.text(startOverButton.x, startOverButton.y, 'Play Again')
      .setOrigin(0.5);
    startOverButton.on('selected', () => {
      this.lives = getSettings().startLives;
      this.gameOver = false;
      this.scene.start('battle');
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      startOverButton.off('selected');
    });

    const mainMenuButton = new Button(this, width / 2, height - 40, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(mainMenuButton);
    this.add.text(mainMenuButton.x, mainMenuButton.y, 'Main Menu')
      .setOrigin(0.5);
    mainMenuButton.on('selected', () => {
      this.lives = getSettings().startLives;
      this.gameOver = false;
      this.scene.start('main-menu');
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      mainMenuButton.off('selected');
    });
    this.buttons.push(startOverButton, mainMenuButton);
  }

  private createBomb() {
    const y = height + 16;
    const x = Phaser.Math.Between(100, width - 100);
    const powerup = new Bomb(this, this.swattables, x, y);
    powerup.setVelocityY(-100);
    const moveInt = setInterval(() => {
      if (powerup.y < 0) {
        powerup.disableBody(true, true);
        this.swattables.remove(powerup);
      }
      if (powerup.active) {
        powerup.setVelocityX(Phaser.Math.Between(0, 1) == 1 ? -50 : 50);
      } else {
        clearTimeout(moveInt);
      }
    }, 800);
  }

  private createPowerUp() {
    const y = height + 16;
    const x = Phaser.Math.Between(100, width - 100);
    const powerup = new SuperSize(this, this.swattables, x, y);
    powerup.setVelocityY(-100);
    const moveInt = setInterval(() => {
      if (powerup.y < 0) {
        powerup.disableBody(true, true);
        this.swattables.remove(powerup);
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
    const life = new Life(this, this.swattables, x, y);
    life.setVelocityY(-100);
    const moveInt = setInterval(() => {
      if (life.y < 0) {
        life.disableBody(true, true);
        this.swattables.remove(life);
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

  private sendMegaWave() {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => this.createFly(true, ), Phaser.Math.Between(50, 2000));
    }
  }

  private swat() {
    this.swatter.playSwatAnim();
    this.buttons.forEach((button) => {
      if (this.swatter.hoversOver(button)) {
        button.swat();
      }
    });
    if (this.gameOver) {
      return;
    }
    this.swattables.children.iterate((swat: any) => {
      const swattable = swat as SwattableObject;
      if (this.swatter.hoversOver(swattable)) {
        swattable.swat();
      }
    });
  }

  private createFly(ignoreCounter = false) {
    if (!ignoreCounter) {
      this.flyCreateCounter++;
      if (this.flyCreateCounter < 30 || this.gameTimer > 10 && this.flyCreateCounter < 20) {
        return;
      }
      this.flyCreateCounter = 0;
    }
    const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
    const fly = new Fly(this, this.swattables, x ? 100 : width - 100, y ? 100 : height - 100);
    fly.changeVelocity();
  }

  private createHornet() {
    this.hornetCreateCounter++;
    if (this.gameTimer < 27 && this.hornetCreateCounter < 30 || this.hornetCreateCounter < 20) {
      return;
    }
    this.hornetCreateCounter = 0;
    const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
    const hornet = new Hornet(this, this.swattables, x ? 100 : width - 100, y ? 100 : height - 100);
    hornet.changeVelocity();
  }

  private createDragonfly() {
    this.dragonflyCreateCounter++;
    if (this.dragonflyCreateCounter < 60) {
      return;
    }
    this.dragonflyCreateCounter = 0;
    const left = Phaser.Math.Between(0, 1);
    const dragonfly = new Dragonfly(this, this.swattables, left ? 0 : width, 50);
    dragonfly.changeVelocity();
    const destroyInterval = setInterval(() => {
      if (dragonfly.x > 800) {
        dragonfly.disableBody(true, true);
        this.swattables.remove(dragonfly);
        clearInterval(destroyInterval);
      }
    }, 100);
  }

  private updateGameTimer() {
    this.gameTimer++;
    this.timerLabel.setText(this.gameTimer.toString());
  }

  private sendFlyWave() {
    const side = Phaser.Math.Between(0, 4);
    const settings = getSettings();
    const velocity = side < 2 ? -settings.flyMaxVelocity : settings.flyMaxVelocity;
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
    const settings = getSettings();
    const velocity = side < 2 ? -settings.hornetMaxVelocity : settings.hornetMaxVelocity;
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
