import {Scene} from "phaser";
import Preloader from "./Preloader";

const queenPreloader: Preloader = (scene: Scene) => {
  scene.load.spritesheet('queen',
    'assets/queen.png',
    {frameWidth: 80, frameHeight: 82}
  );
  scene.load.audio('swat', 'assets/swat.mp3');
  return () => {};
};

export default queenPreloader;
