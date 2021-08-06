import Phaser from 'phaser';
import CONST from 'phaser/src/physics/arcade/const';
import config from '../config';

export default class WallSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, width, height) {
        let wallTexture = new Phaser.GameObjects.Graphics(scene);
        wallTexture.fillStyle(0x888888);
        wallTexture.fillRect(0, 0, width, height);
        wallTexture.generateTexture(`wall-fill-${width}x${height}`, width, height);

        super(scene, x, y, `wall-fill-${width}x${height}`, null);
        this.setOrigin(0, 0);
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, CONST.STATIC_BODY);
        this.setBodySize(width, height, false);
    }

    destroy() {
        super.destroy();
    }
}
