import Phaser from 'phaser';
import config from '../config';
import CONST from '../consts';
import HoverBtn from '../gameObjects/HoverBtn';

export default class GameStartMenu extends Phaser.Scene {
    constructor(objConf) {
        objConf = Object.assign({}, objConf, { key: 'gamestart' });
        super(objConf);
    }

    preload() {
        if (!this.load.textureManager.exists('buttons')) {
            this.load.multiatlas('buttons', 'assets/spritesheets/buttons.json', 'assets/spritesheets');
        }
        if (!this.load.textureManager.exists('playerbuttons')) {
            this.load.multiatlas('playerbuttons', 'assets/spritesheets/player-menu.json', 'assets/spritesheets');
        }
    }

    create(data) {
        let t = this.add.text(config.gameWidth / 2, 50, 'Snake Attack!', {
            fontSize: '60px',
            fontFamily: 'monospace',
            fontStyle: 'bold',
            color: '#fff'
        });
        t.setOrigin(0.5, 0.5);

        t = this.add.text(config.gameWidth / 2, 350, 'Choose Players:', {
            fontSize: '30px',
            fontFamily: 'monospace',
            fontStyle: 'normal',
            color: '#fff'
        });
        t.setOrigin(0.5, 0.5);

        let b1 = new HoverBtn(this, 150, 500, 'playerbuttons', {
            off: 'player-blue-off.png',
            over: 'player-blue-over.png',
            on: 'player-blue-on.png'
        }).enableToggle(true);

        let b2 = new HoverBtn(this, 150 + 1 * 326, 500, 'playerbuttons', {
            off: 'player-red-off.png',
            over: 'player-red-over.png',
            on: 'player-red-on.png'
        }).enableToggle(true);
        let b3 = new HoverBtn(this, 150 + 2 * 326, 500, 'playerbuttons', {
            off: 'player-green-off.png',
            over: 'player-green-over.png',
            on: 'player-green-on.png'
        }).enableToggle(true);
        let b4 = new HoverBtn(this, 150 + 3 * 326, 500, 'playerbuttons', {
            off: 'player-pink-off.png',
            over: 'player-pink-over.png',
            on: 'player-pink-on.png'
        }).enableToggle(true);

        b1.player = CONST.PLAYER_BLUE;
        b2.player = CONST.PLAYER_RED;
        b3.player = CONST.PLAYER_GREEN;
        b4.player = CONST.PLAYER_PINK;

        let startBtn = new HoverBtn(this, config.gameWidth / 2, config.gameHeight - 100, 'buttons', {
            off: 'start_btn-off.png',
            over: 'start_btn-over.png',
            on: 'start_btn-on.png'
        }).on('pressed', () => {
            this.startGame([b1, b2, b3, b4]);
        });
    }

    startGame(playerBtns) {
        let players = [];
        playerBtns.forEach((btn) => {
            if (btn.isPressed) {
                players.push(btn.player);
            }
        });
        if (players.length > 0) {
            this.scene.stop(this);
            this.scene.launch('playground', { players });
        }
    }
}
