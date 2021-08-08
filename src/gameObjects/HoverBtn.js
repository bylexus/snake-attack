import Phaser from 'phaser';

export default class HoverBtn extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, stateFrames) {
        stateFrames = {
            off: stateFrames ? stateFrames.off : 'off',
            over: stateFrames ? stateFrames.over : 'over',
            on: stateFrames ? stateFrames.on : 'on'
        };

        super(scene, x, y, texture, stateFrames.off);
        this.stateFrames = stateFrames;
        this.enableToggle(false)
            .setInteractive()
            .on('pointerdown', () => this.btnDown())
            .on('pointerup', () => this.btnUp())
            .on('pointermove', () => this.highlightBtn())
            .on('pointerout', () => this.unhighlightBtn());

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);

        this.setData('isPressed', false);
    }

    enableToggle(toggleOn) {
        this.toggle = !!toggleOn;
        return this;
    }

    btnDown() {
        if (this.toggle) {
            if (this.getData('isPressed')) {
                this.setFrame(this.stateFrames.off);
                this.setData('isPressed', false);
            } else {
                this.setFrame(this.stateFrames.on);
                this.setData('isPressed', true);
            }
            this.emit('toggled', this.getData('isPressed'));
        } else {
            this.setFrame(this.stateFrames.on);
        }
    }

    btnUp() {
        if (!this.toggle) {
            this.setFrame(this.stateFrames.off);
            this.emit('pressed');
        }
    }

    highlightBtn() {
        if (!this.getData('isPressed')) {
            this.setFrame(this.stateFrames.over);
        }
    }
    unhighlightBtn() {
        if (!this.getData('isPressed')) {
            this.setFrame(this.stateFrames.off);
        }
    }

    destroy() {
        super.destroy();
    }

    get isPressed() {
        return this.getData('isPressed') === true;
    }
}
