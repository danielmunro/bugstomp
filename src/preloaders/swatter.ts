import {Scene} from "phaser";
import Preloader from "./Preloader";

const swatterPreloader: Preloader = (scene: Scene) => {
  scene.load.spritesheet('hand',
    'assets/swatter.png',
    {frameWidth: 32, frameHeight: 48}
  );
  scene.load.audio('swat', 'assets/swat.mp3');

  return () => {
    scene.anims.create({
      key: 'swatting',
      frames: scene.anims.generateFrameNumbers('hand', {start: 0, end: 2}),
      frameRate: 20,
    });
  };
};

export default swatterPreloader;
