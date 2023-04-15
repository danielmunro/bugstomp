import Rectangle = Phaser.Geom.Rectangle;

export default interface SwattableObject {
  swat(): void;
  getHitBounds(): Array<Rectangle>;
  x: number;
  y: number;
  active: boolean;
}
