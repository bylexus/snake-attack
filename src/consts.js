import Phaser from 'phaser';

export default {
    PLAYER_BLUE: {
        key: 'blue',
        color: 0x4444ff,
        cssColor: '#4444ff',
        gridOverFillColor: 0x0000aa,
        gridOverStrokeColor: 0x000088,
        gridMarkedFillColor: 0x4444aa,
        gridMarkedStrokeColor: 0x444488,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.Q,
        keyRight: Phaser.Input.Keyboard.KeyCodes.W,
        startGridPos: [6, 6], // positive: from top, left, negative: from bottom, right
        startVector: [1, 0]
    },
    PLAYER_RED: {
        key: 'red',
        color: 0xff4444,
        cssColor: '#ff4444',
        gridOverFillColor: 0xaa0000,
        gridOverStrokeColor: 0x880000,
        gridMarkedFillColor: 0xaa4444,
        gridMarkedStrokeColor: 0x884444,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.O,
        keyRight: Phaser.Input.Keyboard.KeyCodes.P,
        startGridPos: [-6, 6],
        startVector: [-1, 0]
    },
    PLAYER_GREEN: {
        key: 'green',
        color: 0x44ff44,
        cssColor: '#44ff44',
        gridOverFillColor: 0x00aa00,
        gridOverStrokeColor: 0x008800,
        gridMarkedFillColor: 0x44aa44,
        gridMarkedStrokeColor: 0x448844,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.X,
        keyRight: Phaser.Input.Keyboard.KeyCodes.C,
        startGridPos: [6, -6],
        startVector: [1, 0]
    },
    PLAYER_PINK: {
        key: 'pink',
        color: 0xf37fca,
        cssColor: '#f37fca',
        gridOverFillColor: 0xf1039d,
        gridOverStrokeColor: 0x940461,
        gridMarkedFillColor: 0xf181c9,
        gridMarkedStrokeColor: 0x940461,
        keyLeft: Phaser.Input.Keyboard.KeyCodes.N,
        keyRight: Phaser.Input.Keyboard.KeyCodes.M,
        startGridPos: [-6, -6],
        startVector: [-1, 0]
    }
};
