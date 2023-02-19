import Button from "../objects/ui/Button"
import Swatter from "../objects/Swatter"

export default class CreditsScene extends Phaser.Scene {
  private swatter: Swatter;
  private backButton: Button;

  constructor() {
    super('credits');
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
    this.backButton = new Button(this, width / 2, height / 2, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(this.backButton);
    this.add.text(this.backButton.x, this.backButton.y, 'Back')
      .setOrigin(0.5);
    this.backButton.on('selected', () => {
      this.scene.start('main-menu');
    });
    const fontStyle = { fontSize: '32px', fill: '#FFF' };
    this.add.text(16, 16, 'Made by Evergreen Studios', fontStyle);
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
  }

  update() {
    const pointer = this.input.activePointer;
    this.swatter.setPosition(pointer.x, pointer.y + 16);
    const uiButton = this.backButton as Phaser.GameObjects.Image;
    uiButton.setTint(0xffffff);
    if (this.swatter.hoversOver(this.backButton)) {
      uiButton.setTint(0x66ff7f);
    }
  }

  private swat() {
    this.swatter.playSwatAnim();
    if (this.swatter.hoversOver(this.backButton)) {
      this.backButton.swat();
    }
  }
}
