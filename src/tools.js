import config from './config';

export function gridToPixel(gridX, gridY) {
    // console.log(config.countGridX, config.countGridY);
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
