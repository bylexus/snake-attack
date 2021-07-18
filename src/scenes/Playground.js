import Phaser from 'phaser';
import config from '../config';
import CONST from '../consts';
import { gridToPixel, pixelToGrid } from '../tools';
import GridSprite from '../gameObjects/GridSprite';
import PlayerSprite from '../gameObjects/PlayerSprite';
import WallSprite from '../gameObjects/WallSprite';

export default class Playground extends Phaser.Scene {
    constructor(config) {
        super(config);

        this.bgTiles = [];
        this.players = null;

        this.walls = null;
    }

    preload() {
        console.log('Playground preload');
    }

    create() {
        console.log('Playground create');

        // ---------- Create tile textures -------------------
        let bgTexture = new Phaser.GameObjects.Graphics(this);
        bgTexture.lineStyle(1, 0x111111);
        bgTexture.strokeRect(0, 0, config.gridWidth, config.gridWidth);
        bgTexture.fillStyle(0x333333);
        bgTexture.fillRoundedRect(0, 0, config.gridWidth - 1, config.gridWidth - 1, 3);
        bgTexture.generateTexture('bg-fill', config.gridWidth, config.gridWidth);

        [CONST.PLAYER_BLUE, CONST.PLAYER_GREEN, CONST.PLAYER_RED, CONST.PLAYER_YELLOW].forEach((playerConf) => {
            let playerTexture = new Phaser.GameObjects.Graphics(this);
            playerTexture.fillStyle(playerConf.color);
            playerTexture.fillCircle(config.gridWidth / 2, config.gridWidth / 2, config.gridWidth / 2);
            playerTexture.generateTexture(`player-${playerConf.key}`, config.gridWidth, config.gridWidth);

            let overTexture = new Phaser.GameObjects.Graphics(this);
            overTexture.lineStyle(1, playerConf.gridOverStrokeColor);
            overTexture.fillStyle(playerConf.gridOverFillColor);
            overTexture.fillRoundedRect(0, 0, config.gridWidth, config.gridWidth, 3);
            overTexture.strokeRect(0, 0, config.gridWidth, config.gridWidth);
            overTexture.generateTexture(`over-${playerConf.key}`, config.gridWidth, config.gridWidth);
        });

        // ----------------- Create background tiles ------------------------

        this.bgTiles = [];
        for (let y = 0; y < config.countGridY; y++) {
            let row = [];
            for (let x = 0; x < config.countGridX; x++) {
                let pixelCoords = gridToPixel(x, y);
                let sprite = new GridSprite(this, pixelCoords.x, pixelCoords.y, 'bg-fill');
                row.push(sprite);
            }
            this.bgTiles.push(row);
        }

        // --------------------- create player sprites -------------------
        this.players = this.physics.add.group();
        this.players.add(new PlayerSprite(this, CONST.PLAYER_BLUE));
        // this.players.add(new PlayerSprite(this, CONST.PLAYER_RED));

        // --------------- Surrounding Walls ------------------
        this.walls = this.physics.add.staticGroup();
        this.walls.add(new WallSprite(this, 0, 0, config.gameWidth, config.gridOffsetY));
        this.walls.add(
            new WallSprite(this, 0, config.gameHeight - config.gridOffsetY, config.gameWidth, config.gridOffsetY)
        );
        this.walls.add(new WallSprite(this, 0, 0, config.gridOffsetX, config.gameHeight));
        this.walls.add(
            new WallSprite(this, config.gameWidth - config.gridOffsetX, 0, config.gridOffsetX, config.gameHeight)
        );

        this.physics.add.collider(this.walls, this.players, (o1, o2) => {
            console.log(o1, o2);
        });

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
        this.tweens.timeline({
            ease: 'Quad.easeIn',
            onComplete: () => {
                count1.destroy(true);
                count2.destroy(true);
                count3.destroy(true);
                this.players.getChildren().forEach(player => player.start());
            },
            tweens: [
                {
                    targets: count3,
                    duration: 300,
                    x: config.gameWidth / 2,
                    alpha: 1
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
                    alpha: 1
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
                    alpha: 1
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
    }

    update(time, delta) {
        this.players.getChildren().forEach((player) => {
            let { x, y } = pixelToGrid(player.x, player.y);
            let tile = this.bgTiles[y][x];
            tile.annex(player);
        });
        // console.log(x, y);
    }
}
