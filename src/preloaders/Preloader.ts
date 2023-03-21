import {Scene} from "phaser";

export default interface Preloader {
  (scene: Scene): () => void;
}
