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
import {queen, swatter, ui, fly, hornet, beetle} from "../preloaders";
import PreloaderAwareScene from "./PreloaderAwareScene";
import {getSettings} from "../userConfig";
import Beetle from "../objects/baddies/Beetle";
import Tempo from "../Tempo";
import Queen from "../objects/baddies/Queen";
import Rectangle = Phaser.GameObjects.Rectangle;

export default class BattleScene extends PreloaderAwareScene {
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
  private intervals: Array<NodeJS.Timer> = [];
  private invincible = false;
  private lifeAffect: Phaser.GameObjects.Sprite;
  private music: Array<Phaser.Sound.BaseSound> = [];
  private musicIndex = 0;
  private buttons: Array<Button> = [];
  private static maxScoreThisSession = 0;
  private background: Phaser.GameObjects.Image;
  private tempo = new Tempo(this);
  private tracker: Rectangle;
  private queen: Queen;

  constructor() {
    super('battle');
  }

  preload(): void {
    this.preloaders([
      swatter,
      fly,
      hornet,
      beetle,
      ui,
      queen,
    ]);
    this.load.image('bg', 'assets/bg-clouds.jpg');
    this.load.image('life', 'assets/level-up.png');
    this.load.image('powerup', 'assets/power-up.png');
    this.load.image('projectile', 'assets/projectile.png');
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
    this.load.audio('falling-bomb', 'assets/falling-bomb.mp3');
    this.load.audio('euphoria', 'assets/euphoria.mp3');
    this.load.audio('modern-summer', 'assets/modern-summer.mp3');
    this.load.audio('rock-the-party', 'assets/rock-the-party.mp3');
    this.load.audio('trap', 'assets/trap.mp3');
    this.load.audio('game-over', 'assets/game-over.mp3');
  }

  create(): void {
    this.callCreate();
    this.score = 0;
    this.gameTimer = 0;
    this.background = this.add.image(width / 2, height / 2, 'bg');
    this.swattables = this.physics.add.group();
    this.projectiles = this.physics.add.group();
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
    this.intervals.push(setInterval(() => {
      this.updateGameTimer();
      this.tempo.pulse(this.gameTimer);
    }, 1000));

    this.music.push(this.sound.add('euphoria'));
    this.music.push(this.sound.add('modern-summer'));
    this.music.push(this.sound.add('action-workout'));
    this.music.push(this.sound.add('rock-the-party'));
    this.music.push(this.sound.add('trap'));
    this.music[this.musicIndex].play();
  }

  update() {
    if (this.tracker && this.queen) {
      this.tracker.x = this.queen.x;
      this.tracker.y = this.queen.y;
    }
    const pointer = this.input.activePointer;
    this.swatter.setPosition(pointer.x, pointer.y + 16);
    if (this.lifeAffect) {
      this.lifeAffect.setPosition(pointer.x, pointer.y + 16);
    }
    if (this.gameOver) {
      this.stopMusic();
      this.disableBugs();
      return;
    }
    this.checkForHit();
    this.removeDisabledSwattables();
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

  createProjectile(startX: number, startY: number, targetX: number, targetY: number, speed: number) {
    const p = new Projectile(this, this.projectiles, startX, startY);
    const angleDeg = (Math.atan2(targetY - p.y , targetX - p.x) * 180 / Math.PI);
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
    for (const swattable of this.swattables.getChildren()) {
      if (swattable instanceof Bomb || swattable instanceof Life || swattable instanceof SuperSize) {
        return;
      }
      const sw = (swattable as any) as SwattableObject;
      const explosion = new ExplosionAffect(this, sw.x, sw.y);
      explosion.anims.play('explosion-affect')
        .once(
          Phaser.Animations.Events.ANIMATION_COMPLETE,
          () => {
            explosion.destroy(true);
            sw.swat();
          },
        );
    }
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

  createBomb() {
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

  createPowerUp() {
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

  create1Up() {
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

  createBeetle() {
    const left = Phaser.Math.Between(0, 1);
    const beetle = new Beetle(this, this.swattables, left ? 0 : width, 50);
    beetle.changeVelocity();
  }

  createFly() {
    const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
    const fly = new Fly(this, this.swattables, x ? 100 : width - 100, y ? 100 : height - 100);
    fly.changeVelocity();
  }

  createHornet() {
    const x = Phaser.Math.Between(0, 1), y = Phaser.Math.Between(0, 1);
    const hornet = new Hornet(this, this.swattables, x ? 100 : width - 100, y ? 100 : height - 100);
    hornet.changeVelocity();
  }

  createDragonfly() {
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

  createQueen() {
    const x = width / 2, y = height / 2;
    this.queen = new Queen(this, this.swattables, x, y);
    // const bounds = this.queen.getBounds();
    // this.tracker = this.add.rectangle(bounds.x, bounds.y, bounds.width, bounds.height, 0xff0000);
  }

  sendWave() {
    if (this.gameTimer < 20) {
      this.sendFlyWave();
    } else {
      this.sendHornetWave();
    }
  }

  sendMegaWave(intensity: number) {
    const amount = BattleScene.getAmountForMegaWave(intensity);
    for (let i = 0; i < amount; i++) {
      setTimeout(() => this.createFly(), Phaser.Math.Between(50, 2000));
    }
  }

  private static getAmountForMegaWave(intensity: number) {
    switch (intensity) {
      case 0: return 10;
      case 1: return 30;
      case 2: return 90;
      case 3: return 800;
      default: return 180;
    }
  }

  private stopMusic() {
    if (this.music[this.musicIndex].isPlaying) {
      this.music[this.musicIndex].stop();
    }
  }

  private removeDisabledSwattables() {
    for (const swattable of this.swattables.getChildren()) {
      if (!swattable.active) {
        this.swattables.remove(swattable);
      }
    }
  }

  private checkForHit() {
    for (const projectile of this.projectiles.getChildren()) {
      const p = projectile as Projectile;
      if (Phaser.Geom.Intersects.RectangleToRectangle(p.getBounds(), this.swatter.getBounds())) {
        this.gotHit();
      }
    }
  }

  private disableBugs() {
    for (const bug of this.swattables.getChildren()) {
      if (bug.active) {
        bug.setActive(false);
        this.tweens.add({
          targets: bug,
          duration: 1000,
          alpha: 0.1,
        });
      }
    }
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
    this.stopMusic();
    this.sound.play('game-over');
    this.tempo.endPhase();
    this.intervals.forEach((interval) => clearInterval(interval));
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

  private swat() {
    this.swatter.playSwatAnim();
    this.buttons.forEach((button) => {
      if (button.isUnderneath(this.swatter)) {
        button.swat();
      }
    });
    if (this.gameOver) {
      return;
    }
    for (const swat of this.swattables.getChildren()) {
      const swattable = (swat as any) as SwattableObject;
      if (swattable.isUnderneath(this.swatter)) {
        swattable.swat();
      }
    }
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
