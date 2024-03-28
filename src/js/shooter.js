class Bullet extends PIXI.Sprite {
    #app;
    #stage;
    #player;

    constructor({ app, player, texture, size = 4, speed = 8, damage = 2 }) {
        if (!app) {
            throw new Error('Missing app reference argument');
        }

        if (!player) {
            throw new Error('Missing player reference argument');
        }

        if (!texture) {
            const circle = new PIXI.Graphics();
            circle.position.set(0, 0);
            circle.beginFill(0x0000FF, 1);
            circle.drawCircle(0, 0, size);
            circle.endFill();

            texture = app.renderer.generateTexture(circle);
            circle.destroy();
        }

        super(texture);
        this.#app = app;
        this.#stage = app.stage;
        this.#player = player;

        this.halfWidth = size;
        this.halfHeight = size;
        this.width = size * 2;
        this.height = size * 2;
        this.anchor.set(.5);
        this.position.set(
            player.position.x,
            player.position.y
        );
        this.speed = speed;
        this.damage = damage;
    }

    destroy() {
        this.#stage.removeChild(this);
    }
}

class Shooter {
    #app;
    #stage;
    #player;
    #timer = null;
    #timeout = 0;

    constructor({ app, player }) {
        if (!app) {
            throw new Error('Missing app reference argument');
        }

        if (!player) {
            throw new Error('Missing player reference argument');
        }

        this.#app = app;
        this.#stage = app.stage;
        this.#player = player;

        this.bulletSpeed = 8;
        this.bullets = [];
        this.bulletSize = 4;
        this.maxBulletsCount = 3;
    }

    requestGunFire() {
        if (this.#timeout > 0) return;

        this.#timeout = 200;
        this.#timer = window.setInterval(() => {
            this.#timeout -= 200;

            if (this.#timeout <= 0) {
                window.clearInterval(this.#timer); 
            }
        }, 200);

        this.#createBullet();
    }

    #createBullet() {
        const bullet = new Bullet({ app: this.#app, player: this.#player, size: this.bulletSize, speed: this.bulletSpeed });
        
        const directionAngle = this.#player.rotation;
        bullet.velocity = new Victor(
            Math.cos(directionAngle),
            Math.sin(directionAngle)
        ).multiplyScalar(bullet.speed);

        this.bullets.push(bullet);
        this.#stage.addChild(bullet);
    }

    update(dt) {
        this.bullets.forEach((bullet, i) => {
            if (
                bullet.position.x < 0 || 
                bullet.position.x > this.#app.view.width || 
                bullet.position.y < 0 || 
                bullet.position.y > this.#app.view.height
            ) {
                const timeoutId = window.setTimeout(() => {
                    window.clearTimeout(timeoutId);
                    this.bullets.splice(i, 1);
                    this.#stage.removeChild(bullet);
                }, 0);
                return;
            }

            bullet.position.set(
                bullet.position.x + bullet.velocity.x,
                bullet.position.y + bullet.velocity.y
            );
        });
    }
}

export default Shooter;