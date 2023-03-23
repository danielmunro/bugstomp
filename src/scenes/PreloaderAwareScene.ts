import Preloader from "../preloaders/Preloader";

export default class PreloaderAwareScene extends Phaser.Scene {
  protected callbacks: Array<() => void> = [];

  protected preloaders(preloaders: Array<Preloader>) {
    this.callbacks = preloaders.map((preloader) => preloader(this));
  }

  protected callCreate() {
    this.callbacks.forEach((callback) => callback());
  }
}
