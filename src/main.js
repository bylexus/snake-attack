import Phaser from 'phaser';
import config from './config';
import CONST from './consts';
import GameStartMenuScene from './scenes/GameStartMenu';
import PlaygroundScene from './scenes/Playground';
import HUDScene from './scenes/HUD';
import ReadyScene from './scenes/Ready';
import GameOverScene from './scenes/GameOver';

let gameConfig = {
    type: Phaser.AUTO,
    parent: 'game',
    width: config.gameWidth,
    height: config.gameHeight,
    input: {
        mouse: true,
        keyboard: true
    },
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
    scene: [
        //GameStartMenuScene,
        // PlaygroundScene,
        // ReadyScene,
        // GameOverScene
    ],
    dom: {
        createContainer: true
    }
};

const game = new Phaser.Game(gameConfig);

game.scene.add('gamestart', new GameStartMenuScene());
game.scene.add('playground', new PlaygroundScene());
game.scene.add('hud', new HUDScene());
game.scene.add('ready', new ReadyScene());
game.scene.add('gameover', new GameOverScene());

game.scene.run('gamestart');
// game.scene.run('playground', {
//     players: [CONST.PLAYER_BLUE, CONST.PLAYER_PINK]
// });
