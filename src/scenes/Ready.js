import Phaser from 'phaser';
import config from '../config';

export default class Ready extends Phaser.Scene {
    constructor(objConf) {
        objConf = Object.assign({}, objConf, { key: 'ready' });
        super(objConf);
    }

    preload() {}

    async create() {
        await this.playGetReadySequence();
        this.events.emit('done');
    }

    playGetReadySequence() {
        return new Promise((resolve, reject) => {
            // Add Start Counter
            let count3 = this.add.text(-20, config.gameHeight / 2 - 100, '3', {
                fontSize: '200px',
                color: '#fff',
                align: 'center'
            });
            let count2 = this.add.text(-20, config.gameHeight / 2 - 100, '2', {
                fontSize: '200px',
                color: '#fff',
                align: 'center'
            });
            let count1 = this.add.text(-20, config.gameHeight / 2 - 100, '1', {
                fontSize: '200px',
                color: '#fff',
                align: 'center'
            });
            count3.setAlpha(0);
            count2.setAlpha(0);
            count1.setAlpha(0);
            count3.setScale(10, 10);
            count2.setScale(10, 10);
            count1.setScale(10, 10);

            this.tweens.timeline({
                ease: 'Quad.easeIn',
                onComplete: () => {
                    count1.destroy(true);
                    count2.destroy(true);
                    count3.destroy(true);
                    resolve();
                },
                tweens: [
                    {
                        targets: count3,
                        duration: 300,
                        x: config.gameWidth / 2,
                        alpha: 1,
                        scaleX: 1,
                        scaleY: 1
                    },
                    {
                        targets: count3,
                        duration: 300,
                        x: config.gameWidth + 20,
                        offset: 1000,
                        alpha: 0
                    },

                    {
                        targets: count2,
                        duration: 300,
                        offset: 1000,
                        x: config.gameWidth / 2,
                        alpha: 1,
                        scaleX: 1,
                        scaleY: 1
                    },
                    {
                        targets: count2,
                        duration: 300,
                        x: config.gameWidth + 20,
                        ease: 'Quad.easeIn',
                        offset: 2000,
                        alpha: 0
                    },

                    {
                        targets: count1,
                        duration: 300,
                        offset: 2000,
                        ease: 'Quad.easeIn',
                        x: config.gameWidth / 2,
                        alpha: 1,
                        scaleX: 1,
                        scaleY: 1
                    },
                    {
                        targets: count1,
                        duration: 300,
                        x: config.gameWidth + 20,
                        ease: 'Quad.easeIn',
                        offset: 3000,
                        alpha: 0
                    }
                ]
            });
        });
    }
}
