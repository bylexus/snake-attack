import Phaser from 'phaser';
import config from '../config';
import CONST from '../consts';
import { gridToPixel, pixelToGrid } from '../tools';
import GridSprite, { STATES as GRID_STATES } from '../gameObjects/GridSprite';
import PlayerSprite from '../gameObjects/PlayerSprite';
import WallSprite from '../gameObjects/WallSprite';
import { BoundingBox } from '../tools';

export default class Playground extends Phaser.Scene {
    constructor(objConf) {
        objConf = Object.assign({}, objConf, { key: 'playground' });
        super(objConf);

        this.bgTiles = [];
        this.players = null;

        this.walls = null;
    }

    preload() {}

    async create() {
        // ---------- Create tile textures -------------------
        let bgTexture = new Phaser.GameObjects.Graphics(this);
        bgTexture.lineStyle(1, 0x111111);
        bgTexture.strokeRect(0, 0, config.gridWidth, config.gridWidth);
        bgTexture.fillStyle(0x333333);
        bgTexture.fillRoundedRect(0, 0, config.gridWidth - 1, config.gridWidth - 1, 3);
        bgTexture.generateTexture('bg-fill', config.gridWidth, config.gridWidth);

        [CONST.PLAYER_BLUE, CONST.PLAYER_GREEN, CONST.PLAYER_RED, CONST.PLAYER_PINK].forEach((playerConf) => {
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

            let markedTexture = new Phaser.GameObjects.Graphics(this);
            markedTexture.lineStyle(1, playerConf.gridMarkedStrokeColor);
            markedTexture.fillStyle(playerConf.gridMarkedFillColor);
            markedTexture.fillRoundedRect(0, 0, config.gridWidth, config.gridWidth, 3);
            markedTexture.strokeRect(0, 0, config.gridWidth, config.gridWidth);
            markedTexture.generateTexture(`marked-${playerConf.key}`, config.gridWidth, config.gridWidth);
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
        this.players.add(new PlayerSprite(this, CONST.PLAYER_RED));
        this.players.add(new PlayerSprite(this, CONST.PLAYER_GREEN));
        // this.players.add(new PlayerSprite(this, CONST.PLAYER_PINK));

        // ------------------- Create annexed start tiles for players: ---------------------
        this.players.getChildren().forEach((player) => {
            let gridPos = pixelToGrid(player.x, player.y);
            this.bgTiles[gridPos.y - 1][gridPos.x - 1].annex(player);
            this.bgTiles[gridPos.y - 1][gridPos.x].annex(player);
            this.bgTiles[gridPos.y - 1][gridPos.x + 1].annex(player);
            this.bgTiles[gridPos.y][gridPos.x - 1].annex(player);
            this.bgTiles[gridPos.y][gridPos.x].annex(player);
            this.bgTiles[gridPos.y][gridPos.x + 1].annex(player);
            this.bgTiles[gridPos.y + 1][gridPos.x - 1].annex(player);
            this.bgTiles[gridPos.y + 1][gridPos.x].annex(player);
            this.bgTiles[gridPos.y + 1][gridPos.x + 1].annex(player);
        });

        // --------------- Surrounding Walls ------------------
        this.walls = this.physics.add.staticGroup();
        // top wall
        this.walls.add(new WallSprite(this, 0, 0, config.gameWidth, config.gridWidth));
        // bottom wall
        this.walls.add(
            new WallSprite(
                this,
                0,
                config.gameHeight - config.gridOffsetY - config.gridWidth,
                config.gameWidth,
                config.gridWidth
            )
        );
        // left wall
        this.walls.add(new WallSprite(this, 0, 0, config.gridWidth, config.gameHeight));
        // right wall
        this.walls.add(
            new WallSprite(
                this,
                config.gameWidth - config.gridOffsetX - config.gridWidth,
                0,
                config.gridWidth,
                config.gameHeight
            )
        );
        // DEBUG:
        // this.walls.setVisible(false);

        this.physics.add.collider(this.walls, this.players, (wall, player) => {
            player.die();
        });
        this.physics.add.collider(this.players, this.players, (player1, player2) => {
            player1.die();
            player2.die();
        });

        this.scene.get('ready').events.on('done', () => {
            this.players.getChildren().forEach((player) => player.start());
        });
        this.scene.get('gameover').events.on('replay', () => {
            this.scene.stop('gameover');
            this.scene.restart(this);
        });
        this.scene.launch('ready');
        // this.scene.launch('gameover', { survivingPlayer: this.players.getChildren()[0] });

        // this.addTestArea();
        // this.fillAnnexedArea(this.players.getChildren()[0]);
    }

    // update(time, delta) {}

    getTileForPixel(x, y) {
        let { x: tileX, y: tileY } = pixelToGrid(x, y);
        if (tileX >= 0 && tileY >= 0 && tileY < this.bgTiles.length && tileX < this.bgTiles[tileY].length) {
            return this.bgTiles[tileY][tileX];
        }
        return null;
    }

    removeMarkedTiles(player) {
        this.bgTiles.forEach((line) => {
            line.forEach((tile) => {
                if (tile.propertyOfPlayer === player && tile.state === GRID_STATES.MARKED) {
                    tile.free();
                }
            });
        });
    }

    removePlayerTiles(player) {
        this.bgTiles.forEach((line) => {
            line.forEach((tile) => {
                if (tile.propertyOfPlayer === player) {
                    tile.free();
                }
            });
        });
    }

    fillAnnexedArea(player) {
        // 1. Find bounding box of player's existing tiles, +1 border
        let bbox = this.prepareFloodBox(player);
        // 2. flood-fill the OUTER tiles (fill means: mark as outer tile), beginning at 0/0 of the bounding box:
        this.floodBBox(player, bbox, bbox.left, bbox.top);
        // 3. now all non-marked tiles must be the player's tiles. Annex them:
        for (let y = bbox.top; y <= bbox.bottom; y++) {
            for (let x = bbox.left; x <= bbox.right; x++) {
                if (this.bgTiles[y][x].floodMark !== true) {
                    this.bgTiles[y][x].annex(player);
                }
            }
        }
    }

    prepareFloodBox(player) {
        let box = new BoundingBox();
        box.left = Infinity;
        box.top = Infinity;
        box.right = -Infinity;
        box.bottom = -Infinity;

        this.bgTiles.forEach((line, y) => {
            line.forEach((tile, x) => {
                tile.floodMark = false;
                if (tile.propertyOfPlayer === player) {
                    box.left = Math.min(box.left, x);
                    box.right = Math.max(box.right, x);
                    box.top = Math.min(box.top, y);
                    box.bottom = Math.max(box.bottom, y);
                }
            });
        });
        // resize box on all size +1:
        box.left -= 1;
        box.top -= 1;
        box.right += 1;
        box.bottom += 1;
        return box;
    }

    floodBBox(player, bbox, x, y) {
        // cancel criterias for flood-fill:
        // out of bounding box:
        if (y < bbox.top || y > bbox.bottom || x < bbox.left || x > bbox.right) {
            return;
        }
        let tile = this.bgTiles[y][x];
        // already in player's area:
        if (tile.propertyOfPlayer === player) {
            return;
        }
        // already flood-marked:
        if (tile.floodMark === true) {
            return;
        }

        // start flooding by recursively mark all perpendicular surrounding tiles:
        tile.floodMark = true;
        tile.updateTexture();
        this.floodBBox(player, bbox, x - 1, y); // left
        this.floodBBox(player, bbox, x + 1, y); // right
        this.floodBBox(player, bbox, x, y - 1); // top
        this.floodBBox(player, bbox, x, y + 1); // top
    }

    checkGameOver() {
        let activePlayerCount = 0;
        let survivingPlayer = null;
        this.players.getChildren().forEach((p) => {
            if (p.isAlive()) {
                survivingPlayer = p;
                activePlayerCount++;
            }
        });
        if (activePlayerCount <= 1) {
            this.playGameOver(survivingPlayer);
        }
    }

    playGameOver(survivingPlayer) {
        this.scene.launch('gameover', { survivingPlayer });
        this.scene.pause(this);
    }

    addTestArea() {
        let p = this.players.getChildren()[0];
        this.bgTiles[6][8].mark(p);
        this.bgTiles[6][9].mark(p);
        this.bgTiles[5][9].mark(p);
        this.bgTiles[4][9].mark(p);
        this.bgTiles[3][9].mark(p);
        this.bgTiles[2][9].mark(p);
        this.bgTiles[1][9].mark(p);
        this.bgTiles[1][10].mark(p);
        this.bgTiles[1][11].mark(p);
        this.bgTiles[1][12].mark(p);
        this.bgTiles[2][12].mark(p);
        this.bgTiles[3][12].mark(p);
        this.bgTiles[3][13].mark(p);
        this.bgTiles[3][14].mark(p);
        this.bgTiles[3][15].mark(p);
        this.bgTiles[3][16].mark(p);
        this.bgTiles[2][16].mark(p);
        this.bgTiles[1][16].mark(p);
        this.bgTiles[1][17].mark(p);
        this.bgTiles[1][18].mark(p);
        for (let y = 2; y < 10; y++) {
            this.bgTiles[y][18].mark(p);
        }
        for (let x = 17; x > 0; x--) {
            this.bgTiles[9][x].mark(p);
        }
        this.bgTiles[8][1].mark(p);
        this.bgTiles[7][1].mark(p);
        this.bgTiles[6][1].mark(p);
        this.bgTiles[6][2].mark(p);
        this.bgTiles[6][3].mark(p);
        this.bgTiles[5][3].mark(p);
        this.bgTiles[4][3].mark(p);
        this.bgTiles[4][2].mark(p);
        this.bgTiles[4][1].mark(p);
        this.bgTiles[3][1].mark(p);
        this.bgTiles[2][1].mark(p);
        this.bgTiles[1][1].mark(p);
        this.bgTiles[1][2].mark(p);
        this.bgTiles[1][3].mark(p);
        this.bgTiles[1][4].mark(p);
        this.bgTiles[2][4].mark(p);
        this.bgTiles[3][4].mark(p);
        this.bgTiles[3][5].mark(p);
        this.bgTiles[3][6].mark(p);
        this.bgTiles[4][6].mark(p);
    }
}
