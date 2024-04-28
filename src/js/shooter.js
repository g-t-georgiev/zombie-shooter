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
            circle.beginFill(0xFFFFFF, 1);
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

        this.bulletSpeed = 15;
        this.bullets = [];
        this.bulletSize = 4;
        this.maxBulletsCount = 3;
    }

    destroy() {
        this.bullets.forEach(bullet => bullet.destroy?.());
        this.bullets.length = 0;
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

        // console.log('requestGunFire', this);
        this.#createBullet.call(this);
    }

    #createBullet() {
        // console.log('#createBullet', this);
        const directionAngle = this.#player.rotation;
        const offset = {
            x: Math.cos(directionAngle) * (this.#player.width / 2),
            y: Math.sin(directionAngle) * (this.#player.height / 2)
        };
        const position = { 
            x: this.#player.position.x + offset.x,
            y: this.#player.position.y + offset.y 
        };
        const velocity = {
            x: Math.cos(directionAngle) * this.bulletSpeed,
            y: Math.sin(directionAngle) * this.bulletSpeed
        }

        const bullet = new Bullet({ app: this.#app, player: this.#player, size: this.bulletSize, speed: this.bulletSpeed });
        bullet.position = position;
        bullet.velocity = velocity;

        this.bullets.push(bullet);
        this.#stage.addChild(bullet);
    }

    update(dt) {
        this.bullets = this.bullets.filter(bullet => {
            if (!bullet.visible) bullet.destroy();
            return bullet.visible;
        });
        
        this.bullets.forEach(bullet => {
            if (!bullet.visible) {
                bullet.destroy();
                return;
            }

            if (
                bullet.position.x < 0 || 
                bullet.position.x > this.#app.view.width || 
                bullet.position.y < 0 || 
                bullet.position.y > this.#app.view.height
            ) {
                bullet.visible = false;
                bullet.destroy();
                return;
            }

            bullet.position.set(
                bullet.position.x + bullet.velocity.x * dt,
                bullet.position.y + bullet.velocity.y * dt
            );
        });
    }
}

export default Shooter;