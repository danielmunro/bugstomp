import Button from "../objects/ui/Button"
import Swatter from "../objects/Swatter"
import { swatter, ui } from "../preloaders";
import LoaderAwareScene from "./LoaderAwareScene";

export default class CreditsScene extends LoaderAwareScene {
  private swatter: Swatter;
  private backButton: Button;

  constructor() {
    super('credits');
  }

  preload() {
    this.addLoader(swatter(this));
    this.addLoader(ui(this));
  }

  create() {
    const {width, height} = this.scale;
    this.callLoaders();
    this.backButton = new Button(this, width / 2, height - 40, 'glass-panel')
      .setDisplaySize(150, 50);
    this.add.existing(this.backButton);
    this.add.text(this.backButton.x, this.backButton.y, 'Back')
      .setOrigin(0.5);
    this.backButton.on('selected', () => {
      this.scene.start('main-menu');
    });
    const titleStyle = {
      fontSize: '24px',
      color: '#FFF',
    };
    const textStyle = {
      fontSize: '18px',
      color: '#FFF',
    };
    const yOffset = 16;
    const lineHeight = 30;
    const titleLineHeight = 42;
    let currentY = yOffset;
    const calcLineY = (titleLine: boolean = false) => {
      const y = currentY + (titleLine ? 10 : 0);
      currentY += titleLine ? titleLineHeight : lineHeight;
      return y;
    }
    const link = (text: string, href: string) => {
      const clickable = this.add.text(16, calcLineY(), text, textStyle)
        .setInteractive()
        .on('pointerup', () => {
          window.open(href);
        }, this)
        .on('pointerover', () => {
          clickable.setStyle({color: '#133480'});
        })
        .on('pointerout', () => {
          clickable.setStyle({color: '#FFF'});
        });
    }
    this.add.text(16, calcLineY(true), 'Made by Evergreen Studios', titleStyle);
    this.add.text(16, calcLineY(true), 'Images', titleStyle);
    link(
      'Background     ... Pexels',
      'https://pixabay.com/users/pexels-2286921/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1282314',
    );
    this.add.text(16, calcLineY(true), 'Sound Effects', titleStyle);
    link(
      'Swat           ... Universfield',
      'https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=140236',
    );
    link(
      'Ouch           ... beetpro',
      'https://pixabay.com/users/beetpro-16097074/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=11844',
    );
    link(
      'Shooting       ... Pixabay',
      'https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=14443',
    );
    link(
      'Falling bomb   ... Pixabay',
      'https://pixabay.com/sound-effects/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=41038',
    );
    link(
      'Pop            ... Pixabay',
      'https://pixabay.com/sound-effects/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=85563',
    );
    link(
      'Game over      ... Lightyeartraxx',
      'https://pixabay.com/users/lightyeartraxx-26697863/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=142453',
    );
    this.add.text(16, calcLineY(true), 'Music', titleStyle);
    link(
      'Euphoria       ... Playsound',
      'https://pixabay.com/users/playsound-24686998/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=121294',
    );
    link(
      'Modern Summer  ... Alex_MakeMusic',
      'https://pixabay.com/users/alex_makemusic-24186663/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=10534',
    );
    link(
      'Trap           ... The_Mountain',
      'https://pixabay.com/users/the_mountain-3616498/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=139518',
    );
    link(
      'Rock the Party ... AlexiAction',
      'https://pixabay.com/users/alexiaction-26977400/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=110947',
    );
    link(
      'Action Workout ... QubeSounds',
      'https://pixabay.com/users/qubesounds-24397640/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=99524',
    );

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
