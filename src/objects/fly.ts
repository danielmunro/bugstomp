import { BattleScene } from '../scenes/battle';
import { Bug } from './bug';

export class Fly extends Bug {
    constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'fly', 10, 4000, 3000);
    }
}
