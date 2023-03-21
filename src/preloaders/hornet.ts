import Preloader from "./Preloader";
import {Scene} from "phaser";

const hornetPreloader: Preloader = (scene: Scene) => {
  scene.load.spritesheet('hornet',
    'assets/hornet.png',
    {frameWidth: 32, frameHeight: 32}
  );
  scene.load.spritesheet('hornet-attacking',
    'assets/hornet-attacking.png',
    {frameWidth: 32, frameHeight: 32}
  );
  scene.load.audio('shooting', 'assets/shooting.mp3');
  return () => {
    scene.anims.create({
      key: 'hornet',
      frames: scene.anims.generateFrameNumbers('hornet', {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1,
    });
    scene.anims.create({
      key: 'hornet-attacking',
      frames: scene.anims.generateFrameNumbers('hornet-attacking', {
        start: 0,
        end: 3
      }),
      frameRate: 20,
      repeat: -1,
    });
  };
};

export default hornetPreloader;
