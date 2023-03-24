import {Scene} from "phaser";
import Preloader from "./Preloader";

const beetlePreloader: Preloader = (scene: Scene) => {
  scene.load.spritesheet('beetle',
    'assets/beetle.png',
    {frameWidth: 32, frameHeight: 32}
  );
  scene.load.spritesheet('beetle-attacking',
    'assets/beetle-attacking.png',
    {frameWidth: 32, frameHeight: 32}
  );
  scene.load.audio('pop', 'assets/pop.mp3');
  scene.load.audio('swat', 'assets/swat.mp3');
  scene.load.audio('beetle-hit', 'assets/beetle-hit.mp3');
  return () => {
    scene.anims.create({
      key: 'beetle',
      frames: scene.anims.generateFrameNumbers('beetle', {start: 0, end: 2}),
      frameRate: 20,
      repeat: -1,
    });
    scene.anims.create({
      key: 'beetle-attacking',
      frames: scene.anims.generateFrameNumbers('beetle-attacking', {
        start: 0,
        end: 5
      }),
      frameRate: 20,
      repeat: -1,
    });
    scene.anims.create({
      key: 'beetle-hit',
      frames: scene.anims.generateFrameNumbers('beetle', {
        start: 3,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });
  };
};

export default beetlePreloader;
