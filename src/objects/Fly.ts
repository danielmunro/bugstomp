import BattleScene from '../scenes/BattleScene';
import Bug from './Bug';

export default class Fly extends Bug {
    constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'fly', 10, 4000, 3000);
    }
}
