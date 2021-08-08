import Phaser from 'phaser';
import config from '../config';
import HoverBtn from '../gameObjects/HoverBtn';

export default class GameOver extends Phaser.Scene {
    constructor(objConf) {
        objConf = Object.assign({}, objConf, { key: 'gameover' });
        super(objConf);
    }

    preload() {
        if (!this.load.textureManager.exists('buttons')) {
            this.load.multiatlas('buttons', 'assets/spritesheets/buttons.json', 'assets/spritesheets');
        }
    }

    async create(data) {
        await this.playGameOverSequence(data);
        this.events.emit('done');
    }

    playGameOverSequence(data) {
        return new Promise((resolve, reject) => {
            let bg = this.add.rectangle(0, 0, config.gameWidth, config.gameHeight, 0x000000);
            bg.setAlpha(0);
            bg.setOrigin(0, 0);

            let gameTxt = this.add.text(config.gameWidth / 2, -100, 'Game', {
                fontSize: '200px',
                color: '#fff',
                align: 'center'
            });
            let overTxt = this.add.text(config.gameWidth / 2, config.gameHeight + 100, 'Over', {
                fontSize: '200px',
                color: '#fff',
                align: 'center'
            });
            let playerTxt = null;
            if (data.survivingPlayer) {
                playerTxt = this.add.text(
                    config.gameWidth / 2,
                    -100,
                    `Player ${data.survivingPlayer.playerConf.key}\n`,
                    {
                        fontSize: '50px',
                        color: data.survivingPlayer.playerConf.cssColor,
                        align: 'center'
                    }
                );
            } else {
                playerTxt = this.add.text(config.gameWidth / 2, -100, 'No One\n', {
                    fontSize: '50px',
                    color: '#fff',
                    align: 'center'
                });
            }
            let winsTxt = this.add.text(config.gameWidth / 2, config.gameHeight + 20, '\nwins!', {
                fontSize: '50px',
                color: '#fff',
                align: 'center'
            });
            gameTxt.setOrigin(0.5, 0.5);
            overTxt.setOrigin(0.5, 0.5);
            playerTxt.setOrigin(0.5, 0.5);
            winsTxt.setOrigin(0.5, 0.5);

            let replayBtn = new HoverBtn(this, config.gameWidth / 2, config.gameHeight - 100, 'buttons', {
                off: 'replay_btn-off.png',
                over: 'replay_btn-over.png',
                on: 'replay_btn-on.png'
            })
                .on('pressed', () => {
                    this.events.emit('replay');
                })
                .setVisible(false);

            let homeBtn = new HoverBtn(this, 80, config.gameHeight - 100, 'buttons', {
                off: 'home_btn-off.png',
                over: 'home_btn-over.png',
                on: 'home_btn-on.png'
            })
                .on('pressed', () => {
                    this.events.emit('home');
                })
                .setVisible(false);

            this.tweens.timeline({
                ease: 'Bounce.easeOut',
                onComplete: () => {
                    resolve();
                },
                tweens: [
                    {
                        targets: bg,
                        ease: 'Linear',
                        duration: 500,
                        alpha: 0.6
                    },
                    {
                        targets: gameTxt,
                        duration: 1000,
                        y: config.gameHeight / 2 - 150,
                        offset: 0
                    },
                    {
                        targets: overTxt,
                        duration: 1000,
                        y: config.gameHeight / 2 + 150,
                        onComplete: () => {
                            replayBtn.setVisible(true);
                            homeBtn.setVisible(true);
                        },
                        offset: 1000
                    },
                    {
                        targets: [playerTxt, winsTxt],
                        ease: 'Bounce.easeOut',
                        duration: 500,
                        y: config.gameHeight / 2,
                        offset: 2000
                    }
                ]
            });
        });
    }
}
