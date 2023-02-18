import BattleScene from './scenes/BattleScene';
import MainMenuScene from "./scenes/MainMenuScene"

export const width = 800;
export const height = 600;

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [
        MainMenuScene,
        BattleScene,
    ],
};
