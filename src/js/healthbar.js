class Healthbar extends PIXI.Container {

    constructor({ x, y, width, height }) {
        super();

        if (x) this.position.x = x;
        if (y) this.position.y = y;

        this.maxWidth = width;
        this.fixedHeight = height;

        this.backgroundRect = new PIXI.Graphics();
        this.backgroundRect.position.set(0, 0);
        this.backgroundRect.beginFill(0x080841, 1);
        this.backgroundRect.drawRoundedRect(0, 0, this.maxWidth, this.fixedHeight, 10);
        this.backgroundRect.endFill();

        this.fillRect = new PIXI.Graphics();
        this.fillRect.position.set(1, 1);
        this.fillRect.beginFill(0xb91313, 1);
        this.fillRect.drawRoundedRect(0, 0, this.maxWidth - 2, this.fixedHeight - 2, 10);
        this.fillRect.endFill();

        this.addChild(this.backgroundRect);
        this.addChild(this.fillRect);
    }

    updateHealthbar(rate) {
        let width = Math.max(rate * (this.maxWidth - 2), 0);
        let height = this.fixedHeight - 2;

        if (width <= 0) {
            this.removeChild(this.fillRect);
            return;
        }

        this.fillRect.clear();
        this.fillRect.beginFill(0xb91313, 1);
        this.fillRect.drawRoundedRect(0, 0, width, height, 10);
        this.fillRect.endFill();
    }
}

export default Healthbar;