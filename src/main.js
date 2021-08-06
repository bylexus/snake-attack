import Phaser from 'phaser';
import config from './config';
import GameStartMenuScene from './scenes/GameStartMenu';
import PlaygroundScene from './scenes/Playground';
import ReadyScene from './scenes/Ready';
import GameOverScene from './scenes/GameOver';

let gameConfig = {
    type: Phaser.AUTO,
    parent: 'game',
    width: config.gameWidth,
    height: config.gameHeight,
    scale: {
        mode: Phaser.Scale.NONE
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: !!config.debugArcade,
            gravity: { x: 0, y: 0 }
        }
    },
    scene: [GameStartMenuScene, PlaygroundScene, ReadyScene, GameOverScene],
    dom: {
        createContainer: true
    }
};

window.game = new Phaser.Game(gameConfig);
