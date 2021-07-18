import Phaser from 'phaser';

export default {
    PLAYER_BLUE: {
        key: 'blue',
        color: 0x4444ff,
        gridOverFillColor: 0x0000aa,
        gridOverStrokeColor: 0x000088,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.Q,
        keyRight: Phaser.Input.Keyboard.KeyCodes.W,
        startGridPos: [1, 1], // positive: from top, left, negative: from bottom, right
        startVector: [1, 0]
    },
    PLAYER_RED: {
        key: 'red',
        color: 0xff4444,
        gridOverFillColor: 0xaa0000,
        gridOverStrokeColor: 0x880000,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.O,
        keyRight: Phaser.Input.Keyboard.KeyCodes.P,
        startGridPos: [-1, 1],
        startVector: [-1, 0]
    },
    PLAYER_GREEN: {
        key: 'green',
        color: 0x44ff44,
        gridOverFillColor: 0x00aa00,
        gridOverStrokeColor: 0x008800,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.X,
        keyRight: Phaser.Input.Keyboard.KeyCodes.C,
        startGridPos: [1, -1],
        startVector: [1, 0]
    },
    PLAYER_YELLOW: {
        key: 'yellow',
        color: 0xffff44,
        gridOverFillColor: 0xaaaa00,
        gridOverStrokeColor: 0x888800,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.N,
        keyRight: Phaser.Input.Keyboard.KeyCodes.M,
        startGridPos: [1, -1],
        startVector: [-1, 0]
    }
};
