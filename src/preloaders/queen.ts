import {Scene} from "phaser";
import Preloader from "./Preloader";

const queenPreloader: Preloader = (scene: Scene) => {
  scene.load.image('queen-abdomen',
    'assets/queen-abdomen.png',
  );
  scene.load.image('queen-head',
    'assets/queen-head.png',
  );
  scene.load.image('queen-legs-wings',
    'assets/queen-legs-wings.png',
  );
  scene.load.image('queen-thorax',
    'assets/queen-thorax.png',
  );
  scene.load.audio('pop', 'assets/pop.mp3');
  scene.load.audio('swat', 'assets/swat.mp3');
  return () => {
  };
};

export default queenPreloader;
