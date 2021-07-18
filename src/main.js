import Phaser from 'phaser';
import config from './config';
import PlaygroundScrene from './scenes/Playground';

let gameConfig = {
    type: Phaser.AUTO,
    parent: 'game',
    width: config.gameWidth,
    height: config.gameHeight,
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: !!config.debugArcade,
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [PlaygroundScrene]
};

const game = new Phaser.Game(gameConfig);
