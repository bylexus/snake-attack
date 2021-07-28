import Phaser from 'phaser';
import CONST from 'phaser/src/physics/arcade/const';
import config from '../config';

export default class LaserSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, null);
        this.setOrigin(0, 0);
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, CONST.DYNAMIC_BODY);
        this.setBodySize(config.gridWidth, config.gridWidth, false);
        this.setDisplaySize(config.gridWidth, config.gridWidth);
        this.setOffset(0, 0);

        this.player = null;
    }

    resizeToPlayer() {
        if (this.player) {
            if (this.player.body.velocity.x !== 0) {
                this.setBodySize(this.player.x - this.x, false);
                this.setDisplaySize(this.player.x - this.x);
                this.setOffset(0, 0);
            } else if (this.player.body.velocity.y !== 0) {
                this.setBodySize(this.player.y - this.y, false);
                this.setDisplaySize(this.player.y - this.y);
            }
        }
    }

    // resize() {
    //     laser.setSize(config.gridWidth * 1, config.gridWidth * 50);
    //     laser.setOrigin(0, 0);
    //     laser.setBodySize(config.gridWidth * 1, config.gridWidth * 50);
    //     laser.setDisplaySize(config.gridWidth * 1, config.gridWidth * 50);
    //     laser.setOffset(0, 0);
    // }
}
