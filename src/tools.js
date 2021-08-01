import config from './config';

export function gridToPixel(gridX, gridY) {
    return {
        x: (gridX >= 0 ? gridX : config.countGridX - 1 + gridX) * config.gridWidth + config.gridOffsetX,
        y: (gridY >= 0 ? gridY : config.countGridY - 1 + gridY) * config.gridWidth + config.gridOffsetY
    };
}

export function pixelToGrid(pixelX, pixelY) {
    return {
        x: Math.floor((pixelX - config.gridOffsetX) / config.gridWidth),
        y: Math.floor((pixelY - config.gridOffsetY) / config.gridWidth)
    };
}

export class BoundingBox {
    constructor(top = 0, left = 0, bottom = 0, right = 0) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    get width() {
        return this.right - this.left;
    }

    get height() {
        return this.bottom - this.top;
    }
}
