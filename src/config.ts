import { BattleScene } from './scenes/battle';

export const width = 800;
export const height = 600;

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BattleScene],
};;
