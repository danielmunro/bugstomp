import {Scene} from "phaser";

export default function swatter (scene: Scene) {
  scene.load.spritesheet('hand',
    'assets/swatter.png',
    {frameWidth: 32, frameHeight: 48}
  );
  scene.load.audio('swat', 'assets/swat.mp3');
}
