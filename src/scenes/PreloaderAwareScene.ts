import Preloader from "../preloaders/Preloader";

export default class PreloaderAwareScene extends Phaser.Scene {
  protected preloaders: Array<Preloader> = [];
  protected callbacks: Array<() => void> = [];

  protected callPreloader() {
    this.callbacks = this.preloaders.map((preloader) => preloader(this));
  }

  protected callCreate() {
    this.callbacks.forEach((callback) => callback());
  }

  protected addPreloader(preloader: Preloader) {
    this.preloaders.push(preloader);
  }
}
