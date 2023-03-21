import {Scene} from "phaser";
import Preloader from "./Preloader";

const ui: Preloader = (scene: Scene) => {
  scene.load.image('glass-panel', 'assets/glassPanel.png');
  return () => {};
};

export default ui;
