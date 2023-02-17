import { Bug } from './bug';

export class Fly extends Bug {
    constructor(scene: Phaser.Scene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'fly', 10);
    }
}
