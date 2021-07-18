import Phaser from 'phaser';
import CONST from 'phaser/src/physics/arcade/const';
import config from '../config';
import { gridToPixel, pixelToGrid } from '../tools';

export const DIR_LEFT = 'l';
export const DIR_RIGHT = 'r';

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, playerConf) {
        super(scene, 0, 0, `player-${playerConf.key}`, null);
        this.playerConf = playerConf;

        // Local variables:
        /** @var {String} The next direction the snake will take, as soon as turning is possible */
        this.nextTurn = null;
        this.dirVector = playerConf.startVector; // x, y direction vector, to be multiplied with x/y velocity
        this.lKey = null;
        this.rKey = null;

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, CONST.DYNAMIC_BODY);

        // Player start pos:
        let startPos = gridToPixel(playerConf.startGridPos[0], playerConf.startGridPos[1]);
        console.log(startPos);
        this.setPosition(startPos.x + config.gridWidth / 2, startPos.y + config.gridWidth / 2);

        // add key handlers:
        this.lKey = scene.input.keyboard.addKey(playerConf.keyLeft);
        this.lKey.on('down', () => {
            if (!this.nextTurn) {
                this.nextTurn = DIR_LEFT;
            }
        });

        this.rKey = scene.input.keyboard.addKey(playerConf.keyRight);
        this.rKey.on('down', () => {
            if (!this.nextTurn) {
                this.nextTurn = DIR_RIGHT;
            }
        });
    }

    start() {
        this.setVelocity(this.dirVector[0] * config.playerSpeed, this.dirVector[1] * config.playerSpeed);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

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
            let { x: gridX, y: gridY } = pixelToGrid(this.x, this.y);
            let { x: snappedX, y: snappedY } = gridToPixel(gridX, gridY);
            // center on grid:
            snappedX += config.gridWidth / 2;
            snappedY += config.gridWidth / 2;

            // set new positions:
            this.setPosition(snappedX, snappedY);
            this.setVelocity(this.dirVector[0] * config.playerSpeed, this.dirVector[1] * config.playerSpeed);
            this.nextTurn = null;
        }
    }
}
