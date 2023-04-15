import Rectangle = Phaser.Geom.Rectangle;

export default interface SwattableObject {
  swat(): void;
  getBounds(): Rectangle;
  x: number;
  y: number;
  active: boolean;
}
