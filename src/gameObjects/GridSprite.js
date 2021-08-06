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
        this.previousPlayer = null; // marks the player PREVIOUSLY assigned to this tile

        this.state = STATES.FREE;
        this.floodMark = false; // used for flood-filling

        this.setOrigin(0, 0);
        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.sys.arcadePhysics.world.enableBody(this, PHASER_CONST.STATIC_BODY);
    }

    free() {
        // If a previous player is assigned, this means that this tile was
        // previously annexed by the previous player, but marked for eating from the actual
        // player. In this case, the tile will get returned to the previous player:
        if (this.previousPlayer) {
            this.propertyOfPlayer = this.previousPlayer;
            this.previousPlayer = null;
            this.state = STATES.ANNEXED;
        } else {
            // otherwise, must be free before, so free it:
            this.propertyOfPlayer = null;
            this.state = STATES.FREE;
        }
        this.updateTexture();
    }

    /**
     * Makes this tile property of the player given by key.
     *
     * @param {PlayerSprite} playerKey
     */
    mark(player) {
        this.previousPlayer = this.propertyOfPlayer;
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
        this.previousPlayer = null;
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

    destroy() {
        super.destroy();
        this.propertyOfPlayer = null;
        this.previousPlayer = null;
    }
}
