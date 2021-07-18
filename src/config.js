export default {
    gameWidth: 1280,
    gameHeight: 960,
    // gameWidth: 640,
    // gameHeight: 480,
    gridWidth: 16,
    gridOffsetX: 16,
    gridOffsetY: 16,

    get countGridX() {
        if (!this._countGridX) {
            this._countGridX = (this.gameWidth - 2 * this.gridOffsetX) / this.gridWidth;
        }
        return this._countGridX;
    },

    get countGridY() {
        if (!this._countGridY) {
            this._countGridY = (this.gameHeight - 2 * this.gridOffsetY) / this.gridWidth;
        }
        return this._countGridY;
    },

    playerSpeed: 200,

    debugArcade: false
};
