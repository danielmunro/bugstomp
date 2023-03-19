import {Scene} from "phaser";

export default function ui(scene: Scene) {
  scene.load.image('glass-panel', 'assets/glassPanel.png');
  return () => {};
}
