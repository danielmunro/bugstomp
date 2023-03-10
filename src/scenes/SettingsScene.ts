import Button from "../objects/ui/Button"
import Swatter from "../objects/Swatter"
import Settings from "../Settings";
import SwattableObject from "../interfaces/SwattableObject";

export default class SettingsScene extends Phaser.Scene {
  private swatter: Swatter;
  private buttons: Array<Phaser.GameObjects.Image> = [];
  private easyButton: Phaser.GameObjects.Image;
  private normalButton: Phaser.GameObjects.Image;
  private hardButton: Phaser.GameObjects.Image;
  private caratText: Phaser.GameObjects.Text;

  constructor() {
    super('settings');
  }

  preload() {
    this.load.image('glass-panel', 'assets/glassPanel.png');
    this.load.spritesheet('hand',
      'assets/swatter.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create() {
    const {width, height} = this.scale;

    // back button
    const backButton = new Button(this, width / 2, height / 2, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(backButton);
    this.add.text(backButton.x, backButton.y, 'Back')
      .setOrigin(0.5);
    backButton.on('selected', () => {
      this.scene.start('main-menu');
    });
    this.buttons.push(backButton);

    // difficulty
    const textStyle = {
      fontSize: '16px',
      fill: '#fff',
    };
    this.add.text(200, 64, 'Difficulty:', textStyle);
    this.easyButton = new Button(this, 400, 64, 'glass-panel')
      .setDisplaySize(92, 50);
    this.add.existing(this.easyButton);
    this.add.text(this.easyButton.x, this.easyButton.y, 'easy')
      .setOrigin(0.5);
    this.easyButton.on('selected', () => {
      Settings.chosenDifficulty = 'easy';
    });
    this.buttons.push(this.easyButton);
    this.normalButton = new Button(this, 500, 64, 'glass-panel')
      .setDisplaySize(92, 50);
    this.add.existing(this.normalButton);
    this.add.text(this.normalButton.x, this.normalButton.y, 'normal')
      .setOrigin(0.5);
    this.normalButton.on('selected', () => {
      Settings.chosenDifficulty = 'normal';
    });
    this.buttons.push(this.normalButton);
    this.hardButton = new Button(this, 600, 64, 'glass-panel')
      .setDisplaySize(92, 50);
    this.add.existing(this.hardButton);
    this.add.text(this.hardButton.x, this.hardButton.y, 'hard')
      .setOrigin(0.5);
    this.hardButton.on('selected', () => {
      Settings.chosenDifficulty = 'hard';
    });
    this.buttons.push(this.hardButton);

    this.load.spritesheet('hand',
      'assets/swatter.png',
      { frameWidth: 32, frameHeight: 48 }
    );

    this.anims.create({
      key: 'swatting',
      frames: this.anims.generateFrameNumbers('hand', { start: 0, end: 2 }),
      frameRate: 20,
    });

    this.input.on('pointerup', this.swat.bind(this));
    this.input.setDefaultCursor('none');
    this.swatter = new Swatter(this);
    const caratStyle = {
      fill: '#fff',
      fontSize: '24pt',
    };
    let caratX = 0;
    if (Settings.chosenDifficulty === 'easy') {
      caratX = this.easyButton.x - this.easyButton.width / 2;
    } else if (Settings.chosenDifficulty === 'normal') {
      caratX = this.normalButton.x - this.normalButton.width / 2;
    } else if (Settings.chosenDifficulty === 'hard') {
      caratX = this.hardButton.x - this.hardButton.width / 2;
    }
    this.caratText = this.add.text(caratX, 128, '^', caratStyle);
  }

  update() {
    const pointer = this.input.activePointer;
    this.swatter.setPosition(pointer.x, pointer.y + 16);
    this.buttons.forEach((button) => {
      button.setTint(0xffffff);
      const b = (button as any) as SwattableObject;
      if (this.swatter.hoversOver(b)) {
        button.setTint(0x66ff7f);
      }
    });
    this.caratText.x = this.getCaratX();
  }

  private getCaratX() {
    if (Settings.chosenDifficulty === 'easy') {
      return this.easyButton.x - 10;
    } else if (Settings.chosenDifficulty === 'normal') {
      return this.normalButton.x - 10;
    } else if (Settings.chosenDifficulty === 'hard') {
      return this.hardButton.x - 10;
    }
  }

  private swat() {
    this.swatter.playSwatAnim();
    this.buttons.forEach((button) => {
      button.setTint(0xffffff);
      const b = (button as any) as SwattableObject;
      if (this.swatter.hoversOver(b)) {
        b.swat();
      }
    });
  }
}
