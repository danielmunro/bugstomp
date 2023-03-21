import {Scene} from "phaser";

export default function fly(scene: Scene) {
  scene.load.spritesheet('fly',
    'assets/fly.png',
    {frameWidth: 32, frameHeight: 32}
  );
  scene.load.spritesheet('fly-attacking',
    'assets/fly-attacking.png',
    {frameWidth: 32, frameHeight: 32}
  );
  scene.load.audio('pop', 'assets/pop.mp3');
  scene.load.audio('swat', 'assets/swat.mp3');
  return () => {
    scene.anims.create({
      key: 'fly',
      frames: scene.anims.generateFrameNumbers('fly', {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1,
    });
    scene.anims.create({
      key: 'fly-attacking',
      frames: scene.anims.generateFrameNumbers('fly-attacking', {
        start: 0,
        end: 3
      }),
      frameRate: 20,
      repeat: -1,
    });
  };
}
