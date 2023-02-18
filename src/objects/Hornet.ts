import BattleScene from '../scenes/BattleScene';
import Bug from './Bug';

export default class Hornet extends Bug {
    constructor(scene: BattleScene, group: Phaser.GameObjects.Group, x: number, y: number) {
        super(scene, group, x, y, 'hornet', 15, 2500, 1500);
    }
}
