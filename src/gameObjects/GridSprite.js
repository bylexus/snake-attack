import Phaser from 'phaser';
import PHASER_CONST from 'phaser/src/physics/arcade/const';

const DEFAULT_TEXTURE = 'bg-fill';

export const STATES = {
    FREE: 0, // empty, free
    MARKED: 1, // over-run by player, but not yet annexed (not yet part of player area)
    ANNEXED: 2 // part of player area
};

export default class GridSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, DEFAULT_TEXTURE, null);
        this.propertyOfPlayer = null;

        this.state = STATES.FREE;

        this.setOrigin(0, 0);
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, PHASER_CONST.STATIC_BODY);
    }

    free() {
        this.propertyOfPlayer = null;
        this.state = STATES.FREE;
        this.updateTexture();
    }

    /**
     * Makes this tile property of the player given by key.
     *
     * @param {PlayerSprite} playerKey
     */
    mark(player) {
        this.propertyOfPlayer = player;
        this.state = STATES.MARKED;
        this.updateTexture();
    }

    /**
     * Makes this tile property of the player given by key.
     *
     * @param {PlayerSprite} playerKey
     */
    annex(player) {
        this.propertyOfPlayer = player;
        this.state = STATES.ANNEXED;
        this.updateTexture();
    }

    updateTexture() {
        let textureKey = null;
        switch (this.state) {
            case STATES.MARKED:
                textureKey = `marked-${this.propertyOfPlayer.playerConf.key}`;
                break;
            case STATES.ANNEXED:
                textureKey = `over-${this.propertyOfPlayer.playerConf.key}`;
                break;
            default:
                textureKey = DEFAULT_TEXTURE;
        }

        if (this.texture.key !== textureKey) {
            this.setTexture(textureKey);
        }
    }
}
