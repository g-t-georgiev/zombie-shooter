import Shooter from "./shooter.js";

let _app;

class Player extends PIXI.Sprite {

    lastMouseButton;

    constructor({ app, texture, size = 32 }) {
        _app = app;
        
        if (!texture) {
            texture = PIXI.Texture.WHITE;
        }

        super(texture);
        this.anchor.set(0.5);
        this.position.set(app.screen.width / 2, app.screen.height / 2);
        this.width = this.height = size;
        this.tint = 0xea985d;

        _app.stage.addChild(this);
        
        this.shooter = new Shooter({ app, player: this });
    }


    update(dt) {
        const mouse = _app.renderer.plugins.interaction.mouse;
        const cursorPos = mouse.global;
        const angle = Math.atan2(
            cursorPos.y - this.position.y, 
            cursorPos.x - this.position.x
        );
        this.rotation = angle;

        if (mouse.buttons !== this.lastMouseButton) {
            this.shooter.changeState(mouse.buttons !== 0);
            this.lastMouseButton = mouse.buttons;
        }
        this.shooter.update(dt);
    }
}

export default Player;