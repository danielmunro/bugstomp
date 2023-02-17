import { Bug } from './bug';

export class Hornet extends Bug {
    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'hornet', 15);
    }
}