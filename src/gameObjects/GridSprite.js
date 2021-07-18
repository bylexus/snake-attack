import Phaser from 'phaser';
import PHASER_CONST from 'phaser/src/physics/arcade/const';
import PlayerSprite from './PlayerSprite';

const DEFAULT_TEXTURE = 'bg-fill';

export default class GridSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, DEFAULT_TEXTURE, null);
        this.propertyOfPlayer = null;

        this.setOrigin(0, 0);
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, PHASER_CONST.STATIC_BODY);
    }

    /**
     * Makes this tile property of the player given by key.
     *
     * @param {PlayerSprite} playerKey
     */
    annex(player) {
        this.propertyOfPlayer = player ? player : null;
        this.updateTexture();
    }

    updateTexture() {
        let textureKey = this.propertyOfPlayer ? `over-${this.propertyOfPlayer.playerConf.key}` : DEFAULT_TEXTURE;
        if (this.texture.key !== textureKey) {
            this.setTexture(textureKey);
        }
    }
}
