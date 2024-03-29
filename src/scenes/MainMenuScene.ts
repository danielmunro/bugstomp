import Swatter from "../objects/Swatter"
import Button from "../objects/ui/Button"
import SwattableObject from "../interfaces/SwattableObject"
import { swatter, ui } from "../preloaders";
import PreloaderAwareScene from "./PreloaderAwareScene";

export default class MainMenuScene extends PreloaderAwareScene {
  private buttons: Button[] = [];
  private swatter: Swatter;
  private introSong: Phaser.Sound.BaseSound;

  constructor() {
    super('main-menu');
  }

  preload() {
    this.preloaders([
      swatter,
      ui,
    ]);
    this.loadFont('pe', './assets/pixelemulator.ttf');
    this.load.audio('action-workout', './assets/action-workout.mp3');
  }

  create() {
    this.callCreate();
    const { width, height } = this.scale;
    if (!this.introSong) {
      const songConfig = {
        loop: true,
      };
      this.introSong = this.sound.add('action-workout', songConfig);
      this.introSong.play();
    }

    const logoStyle = {
      fontSize: '64px',
      fill: '#fff',
      fontFamily: "pe",
    };
    this.add.text(width / 2, 100, 'Bug Smash', logoStyle).setOrigin(0.5);

    // Play button
    const playButton = new Button(this, width / 2, height / 2, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(playButton);

    this.add.text(playButton.x, playButton.y, 'Play')
      .setOrigin(0.5);

    // Settings button
    const settingsButton = new Button(this, playButton.x, playButton.y + playButton.displayHeight + 40, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(settingsButton);

    this.add.text(settingsButton.x, settingsButton.y, 'Settings')
      .setOrigin(0.5);

    // Credits button
    const creditsButton = new Button(this, settingsButton.x, settingsButton.y + settingsButton.displayHeight + 40, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(creditsButton);

    this.add.text(creditsButton.x, creditsButton.y, 'Credits')
      .setOrigin(0.5);

    this.buttons.push(playButton);
    this.buttons.push(settingsButton);
    this.buttons.push(creditsButton);

    playButton.on('selected', () => {
      this.introSong.stop();
      this.scene.start('battle');
    });

    settingsButton.on('selected', () => {
      this.scene.start('settings');
    });

    creditsButton.on('selected', () => {
      this.scene.start('credits');
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      playButton.off('selected');
      settingsButton.off('selected');
      creditsButton.off('selected');
    });
    this.input.on('pointerup', this.swat.bind(this));
    this.input.setDefaultCursor('none');
    this.swatter = new Swatter(this);
  }

  private loadFont(name: string, url: string) {
    const newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
      document.fonts.add(loaded);
    }).catch(function (error) {
      return error;
    });
  }

  private swat() {
    this.swatter.playSwatAnim();
    this.buttons.forEach((button) => {
      if (button.isUnderneath(this.swatter)) {
        button.swat();
      }
    });
  }

  update() {
    if (!this.introSong.isPlaying) {
      this.introSong.play();
    }
    const pointer = this.input.activePointer;
    this.swatter.setPosition(pointer.x, pointer.y + 16);
    this.buttons.forEach((button: any) => {
      const uiButton = button as Phaser.GameObjects.Image;
      uiButton.setTint(0xffffff);
      if (button.isUnderneath(this.swatter)) {
        uiButton.setTint(0x66ff7f);
      }
    });
  }
}
