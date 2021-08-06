import Phaser from 'phaser';
import config from '../config';
import CONST from '../consts';

export default class GameStartMenu extends Phaser.Scene {
    constructor(objConf) {
        objConf = Object.assign({}, objConf, { key: 'gamestart' });
        super(objConf);
    }

    preload() {
        this.load.spritesheet('playerbuttons', 'assets/spritesheets/player-menus.png', {
            frameWidth: 200,
            frameHeight: 200
        });
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

        let b1 = this.add.sprite(150, 500, 'playerbuttons', 0);
        let b2 = this.add.sprite(150 + 1 * 326.66, 500, 'playerbuttons', 2);
        let b3 = this.add.sprite(150 + 2 * 326.66, 500, 'playerbuttons', 4);
        let b4 = this.add.sprite(150 + 3 * 326.66, 500, 'playerbuttons', 6);

        b1.player = CONST.PLAYER_BLUE;
        b2.player = CONST.PLAYER_RED;
        b3.player = CONST.PLAYER_GREEN;
        b4.player = CONST.PLAYER_PINK;

        b1.setInteractive();
        b2.setInteractive();
        b3.setInteractive();
        b4.setInteractive();

        b1.on('pointerdown', () => this.toggleBtn(b1));
        b2.on('pointerdown', () => this.toggleBtn(b2));
        b3.on('pointerdown', () => this.toggleBtn(b3));
        b4.on('pointerdown', () => this.toggleBtn(b4));

        let startBtn = this.add.dom(
            config.gameWidth / 2,
            config.gameHeight - 100,
            'button',
            {
                width: '200px',
                height: '80px',
                borderRadius: '10px',
                fontSize: '20pt',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#00aa00'
            },
            'Start!'
        );
        startBtn.addListener('click');
        startBtn.on('click', () => {
            this.startGame([b1, b2, b3, b4]);
        });
    }

    toggleBtn(btn) {
        if (btn.isSelected) {
            btn.setFrame(btn.frame.name - 1);
            btn.isSelected = false;
        } else {
            btn.setFrame(btn.frame.name + 1);
            btn.isSelected = true;
        }
    }

    startGame(playerBtns) {
        let players = [];
        playerBtns.forEach((btn) => {
            if (btn.isSelected) {
                players.push(btn.player);
            }
        });
        if (players.length > 0) {
            this.scene.stop(this);
            this.scene.launch('playground', { players });
        }
    }
}
