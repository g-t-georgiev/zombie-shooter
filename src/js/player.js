import Shooter from "./shooter.js";
import Healthbar from "./healthbar.js";

class Player extends PIXI.Sprite {
    #app;
    #stage;
    #view;

    constructor({ app, texture, size = 32 }) {
        if (!app) {
            throw new Error('Missing app reference argument');
        }

        if (!texture) {
            const circle = new PIXI.Graphics();
            circle.position.set(0, 0);
            circle.beginFill(0xFFFFFF, 1);
            circle.drawCircle(0, 0, size);
            circle.endFill();
            texture = app.renderer.generateTexture(circle);
            circle.destroy();
        }

        super(texture);
        this.#app = app;
        this.#stage = app.stage;
        this.#view = app.view;
        this.anchor.set(0.5);
        this.position.set(app.screen.width / 2, app.screen.height / 2);
        this.width = this.height = size;
        this.tint = 0xFFFFFF;
        this.visible = false;
    }

    init() {
        this.visible = true;
        this.#stage.addChild(this);

        // Health
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.dead = false;

        if (!this.healthbar) {
            const paddingInline = 20
            const healthbarWidth = 150;
            const healthbarHeight = 10;
            const healthbarX = this.#app.screen.width - healthbarWidth - paddingInline;
            const healthbarY = 20;

            this.healthbar = new Healthbar({ 
                x: healthbarX,
                y: healthbarY,
                width: healthbarWidth,
                height: healthbarHeight
            });
            this.healthbar.zIndex = 1;
            this.#stage.sortableChildren = true;
        }

        if (this.healthbar.isEmpty) {
            this.healthbar.reset();
        }

        this.healthbar.visible = true;
        this.#stage.addChild(this.healthbar);
        
        // Shooter
        if (!this.shooter) {
            this.shooter = new Shooter({ app: this.#app, player: this });
            this.fire = () => {
                this.shooter.requestGunFire();
            };
        }
        
        this.#view.addEventListener("pointerup", this.fire);
    }

    destroy() {
        this.#view.removeEventListener("pointerup", this.fire);
        this.shooter.destroy();

        this.visible = false;
        this.#stage.removeChild(this);

        this.healthbar.visible = false;
        this.#stage.removeChild(this.healthbar);
    }

    takeDamage(damage = 0) {
        this.health -= damage;
        this.health = Math.max(this.health, 0);
        // console.log(this.health);
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