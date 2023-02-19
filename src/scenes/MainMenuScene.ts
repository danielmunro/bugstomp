import Swatter from "../objects/Swatter"
import Button from "../objects/ui/Button"
import SwattableObject from "../interfaces/SwattableObject"

export default class MainMenuScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private buttons: SwattableObject[] = [];
  private swatter: Swatter;

  constructor() {
    super('main-menu');
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image('glass-panel', 'assets/glassPanel.png');
    this.load.spritesheet('hand',
      'assets/swatter.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create() {
    const { width, height } = this.scale;

    // Play button
    const playButton = new Button(this, width / 2, height / 2, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(playButton.x, playButton.y, 'Play')
      .setOrigin(0.5);

    // Settings button
    const settingsButton = new Button(this, playButton.x, playButton.y + playButton.displayHeight + 40, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(settingsButton.x, settingsButton.y, 'Settings')
      .setOrigin(0.5);

    // Credits button
    const creditsButton = new Button(this, settingsButton.x, settingsButton.y + settingsButton.displayHeight + 40, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(creditsButton.x, creditsButton.y, 'Credits')
      .setOrigin(0.5);

    this.buttons.push(playButton);
    this.buttons.push(settingsButton);
    this.buttons.push(creditsButton);

    playButton.on('selected', () => {
      this.scene.start('battle-scene');
    });

    settingsButton.on('selected', () => {
      console.log('settings')
    });

    creditsButton.on('selected', () => {
      console.log('credits')
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      playButton.off('selected');
      settingsButton.off('selected');
      creditsButton.off('selected');
    });

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

  private swat() {
    this.swatter.playSwatAnim();
    this.buttons.forEach((button) => {
      if (this.swatter.hoversOver(button)) {
        button.swat();
      }
    });
  }

  update() {
    const pointer = this.input.activePointer;
    this.swatter.setPosition(pointer.x, pointer.y + 16);
    this.buttons.forEach((button) => {
      // button.setTint(0xffffff);
      if (this.swatter.hoversOver(button)) {
        // button.setTint(0x66ff7f);
      }
    });
  }
}
