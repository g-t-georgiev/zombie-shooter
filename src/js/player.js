import Shooter from "./shooter.js";
import Healthbar from "./healthbar.js";

class Player extends PIXI.Sprite {
    #app;
    #stage;

    constructor({ app, texture, size = 32 }) {

        if (!texture) {
            texture = PIXI.Texture.WHITE;
        }

        super(texture);
        this.#app = app;
        this.#stage = app.stage;
        this.anchor.set(0.5);
        this.position.set(app.screen.width / 2, app.screen.height / 2);
        this.width = this.height = size;
        this.tint = 0xea985d;

        this.#stage.addChild(this);

        // Health
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.dead = false;

        const paddingInline = 20
        const healthbarWidth = 150;
        const healthbarHeight = 10;
        const healthbarX = app.screen.width - healthbarWidth - paddingInline;
        const healthbarY = 20;
        this.healthbar = new Healthbar({ 
            x: healthbarX,
            y: healthbarY,
            width: healthbarWidth,
            height: healthbarHeight
        });
        this.healthbar.zIndex = 1;
        app.stage.addChild(this.healthbar);
        app.stage.sortableChildren = true;
        
        // Shooter
        this.shooter = new Shooter({ app, player: this });
        app.view.addEventListener("pointerup", () => {
            this.shooter.requestGunFire();
        });
    }

    takeDamage(damage = 0) {
        this.health -= damage;
        this.healthbar.updateHealthbar(this.health / this.maxHealth);

        if (this.health <= 0) {
            this.dead = true;
        }
    }

    update(dt) {
        const mouse = this.#app.renderer.plugins.interaction.mouse;
        const cursorPos = mouse.global;
        this.rotation = Math.atan2(
            cursorPos.y - this.position.y, 
            cursorPos.x - this.position.x
        );

        this.shooter.update(dt);
    }
}

export default Player;