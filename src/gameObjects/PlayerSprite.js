import Phaser from 'phaser';
import CONST from 'phaser/src/physics/arcade/const';
import config from '../config';
import { gridToPixel, pixelToGrid } from '../tools';
import LaserSprite from './LaserSprite';
import { STATES as TILE_STATE } from './GridSprite';

export const DIR_LEFT = 'l';
export const DIR_RIGHT = 'r';

export const ALIVE = 1;
export const DEATH = 0;

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, playerConf) {
        super(scene, 0, 0, `player-${playerConf.key}`, null);
        this.playerConf = playerConf;
        this.state = ALIVE;

        // Local variables:
        /** @var {String} The next direction the snake will take, as soon as turning is possible */
        this.nextTurn = null;
        this.dirVector = playerConf.startVector; // x, y direction vector, to be multiplied with x/y velocity
        this.lKey = null;
        this.rKey = null;
        this.previousTile = null;

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, CONST.DYNAMIC_BODY);

        // Player start pos:
        let startPos = gridToPixel(playerConf.startGridPos[0], playerConf.startGridPos[1]);
        this.setPosition(startPos.x + config.gridWidth / 2, startPos.y + config.gridWidth / 2);

        // add key handlers:
        this.lKey = scene.input.keyboard.addKey(playerConf.keyLeft);
        this.lKey.on('down', () => {
            if (this.active && !this.nextTurn) {
                this.nextTurn = DIR_LEFT;
            }
        });

        this.rKey = scene.input.keyboard.addKey(playerConf.keyRight);
        this.rKey.on('down', () => {
            if (this.active && !this.nextTurn) {
                this.nextTurn = DIR_RIGHT;
            }
        });

        this.setActive(false);
    }

    start() {
        this.setVelocity(this.dirVector[0] * config.playerSpeed, this.dirVector[1] * config.playerSpeed);
        this.setActive(true);
        this.setAlive();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        let { x: gridX, y: gridY } = pixelToGrid(this.x, this.y);
        let { x: snappedX, y: snappedY } = gridToPixel(gridX, gridY);
        let tile = this.scene.getTileForPixel(this.x, this.y);

        if (this.nextTurn === DIR_LEFT) {
            // turn left: [x', y'] = [y, -x]
            this.dirVector = [this.dirVector[1], -1 * this.dirVector[0]];
        } else if (this.nextTurn === DIR_RIGHT) {
            // turn right: [x', y'] = [-y, x]
            this.dirVector = [-1 * this.dirVector[1], this.dirVector[0]];
        }

        if (this.nextTurn) {
            // snap to grid:
            // calc grid position, then back to pixel position of the center of the actual grid:
            // center on grid:
            snappedX += config.gridWidth / 2;
            snappedY += config.gridWidth / 2;

            // set new positions:
            this.setPosition(snappedX, snappedY);
            this.setVelocity(this.dirVector[0] * config.playerSpeed, this.dirVector[1] * config.playerSpeed);
            this.nextTurn = null;
        }

        /** Entered a new tile, so let's see what's to do: */
        if (this.state === ALIVE && this.previousTile !== tile) {
            if (tile.state === TILE_STATE.FREE) {
                // Mine! This is now mine!
                tile.mark(this);
            } else if (tile.state === TILE_STATE.ANNEXED && tile.propertyOfPlayer !== this) {
                // Also mine, but tentatively: this is annexed by another player, I need to
                // close my line to make it permanent:
                tile.mark(this);
            } else if (tile.state === TILE_STATE.MARKED && tile.propertyOfPlayer === this) {
                // Boom! Oops, run into my own tail:
                this.die();
            } else if (tile.state === TILE_STATE.MARKED && tile.propertyOfPlayer !== this) {
                // Ran into another player's tail: needs to clean up its tail
                tile.propertyOfPlayer.die();
                tile.mark(this);
            } else if (
                this.previousTile &&
                this.previousTile.state === TILE_STATE.MARKED &&
                tile.state === TILE_STATE.ANNEXED &&
                tile.propertyOfPlayer === this
            ) {
                // OK, reached back home - now fill the captured area
                this.scene.fillAnnexedArea(this);
            }
        }

        this.previousTile = tile;
    }

    setAlive() {
        this.setActive(true);
        this.state = ALIVE;
    }

    die() {
        this.setVelocity(0, 0);
        this.setActive(false);
        this.state = DEATH;
        this.scene.removeMarkedTiles(this);
    }
}
