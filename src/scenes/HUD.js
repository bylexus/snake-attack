import Phaser from 'phaser';
import config from '../config';

export default class HUD extends Phaser.Scene {
    constructor(objConf) {
        super(objConf);

        this.players = null;
        this.nrOfWins = {};
        this.points = {};
        this.initialized = false;
    }

    preload() {
        // if (!this.load.textureManager.exists('buttons')) {
        //     this.load.multiatlas('buttons', 'assets/spritesheets/buttons.json', 'assets/spritesheets');
        // }
    }

    create(data) {
        if (!this.initialized) {
            this.initialized = true;
            this.scene.get('playground').events.on('win', (player) => {
                if (player) {
                    this.increaseNrOfWins(player.playerConf.key);
                }
            });
        }
        this.players = data.players || [];
        this.players.forEach((p) => this.createPlayerHUD(p));
    }

    reset() {
        this.nrOfWins = {};
        this.points = {};
    }

    createPlayerHUD(player) {
        let left = player.startGridPos[0] >= 0;
        let top = player.startGridPos[1] >= 0;

        // Player color
        this.add
            .text(0, 0, '⬤')
            .setStyle({
                color: player.cssColor,
                fontSize: '12px'
            })
            .setOrigin(left ? 0 : 1, top ? 0 : 1)
            .setPosition(left ? 16 : config.gameWidth - 16, top ? 2 : config.gameHeight - 2);

        // Player keys
        this.add
            .text(0, 0, `[${String.fromCodePoint(player.keyLeft)}|${String.fromCharCode(player.keyRight)}]`)
            .setStyle({
                color: '#fff',
                fontSize: '12px'
            })
            .setOrigin(left ? 0 : 1, top ? 0 : 1)
            .setPosition(left ? 32 : config.gameWidth - 32, top ? 2 : config.gameHeight - 2);

        // nr of wins:
        this.nrOfWins[player.key] = this.add
            .text(0, 0, ` W: 0 `)
            .setStyle({
                color: '#fff',
                fontSize: '12px'
            })
            .setOrigin(left ? 0 : 1, top ? 0 : 1)
            .setPosition(left ? 80 : config.gameWidth - 80, top ? 2 : config.gameHeight - 2);
        this.updateNrOfWins(player.key, 0);
    }

    increaseNrOfWins(playerKey) {
        this.nrOfWins[playerKey].setData('wins', (this.nrOfWins[playerKey].getData('wins') || 0) + 1);
        this.updateNrOfWins(playerKey, this.nrOfWins[playerKey].getData('wins'));
    }

    updateNrOfWins(playerKey, wins) {
        this.nrOfWins[playerKey].setData('wins', wins);
        this.nrOfWins[playerKey].setText(` W: ${wins} `);
    }
}
