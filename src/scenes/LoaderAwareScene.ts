export default class LoaderAwareScene extends Phaser.Scene {
  protected createCallbacks: Array<() => void> = [];

  protected callLoaders() {
    this.createCallbacks.forEach((loader) => loader());
  }

  protected addLoader(loader: () => void) {
    this.createCallbacks.push(loader);
  }
}
