import Phaser from 'phaser';
import config from '../config';

export default class GameOver extends Phaser.Scene {
    constructor(objConf) {
        objConf = Object.assign({}, objConf, { key: 'gameover' });
        super(objConf);
    }

    preload() {}

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

            let replayBtn = this.add.dom(
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
                'replay'
            );
            replayBtn.setVisible(false);
            replayBtn.addListener('click');
            replayBtn.on('click', () => {
                this.events.emit('replay');
            });

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
                        onComplete: () => replayBtn.setVisible(true),
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
