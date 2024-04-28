class Zombie extends PIXI.Sprite {
    #app;
    #stage;
    #player;

    #attacking = false;

    constructor({ app, player, texture, speed = 2, size = 16, damage = 1 }) {
        if (!app) {
            throw new Error('Missing app reference argument');
        }

        if (!player) {
            throw new Error('Missing player reference argument');
        }

        const r = randomSpawnPoint(app.view.width, app.view.height);

        if (!texture) {
            const circle = new PIXI.Graphics();
            circle.position.set(0, 0);
            circle.beginFill(0xFF0000, 1);
            circle.drawCircle(0, 0, size);
            circle.endFill();
            
            texture = app.renderer.generateTexture(circle);
            circle.destroy();
        }
        
        super(texture);
        this.#app = app;
        this.#player = player;
        this.#stage = app.stage;

        this.halfWidth = size;
        this.halfHeight = size;
        this.width = size * 2;
        this.height = size * 2;
        this.position.set(r.x, r.y);
        this.anchor.set(.5);
        this.speed = speed;
        this.damage = damage;
        this.visible = false;
    }

    init() {
        this.visible = true;
        this.#stage.addChild(this);
    }

    destroy() {
        window.clearInterval(this.attackInterval);
        this.#attacking = false;
        this.visible = false;
        this.#stage.removeChild(this);
    }

    kill() {
        window.clearInterval(this.attackInterval);
        this.#attacking = false;
        this.#stage.removeChild(this);
    }

    attack() {
        if (this.#attacking) return;

        this.#attacking = true;
        this.#player.takeDamage(this.damage);
        this.attackInterval = window.setInterval(() => {
            if (this.#app.paused) {
                window.clearInterval(this.attackInterval);
                this.#attacking = false;
                return;
            }

            this.#player.takeDamage(this.damage);
        }, 500);
    }

    update(dt) {
        if (!this.visible) {
            this.kill();
            return;
        }

        let zHalfSize = this.width / 2;
        let pHalfSize = this.#player.width / 2;
        let halfSizes = zHalfSize + pHalfSize;

        let dx = this.#player.position.x - this.position.x;
        let dy = this.#player.position.y - this.position.y;
        let distance = Math.hypot(dx, dy);

        if (distance < halfSizes) {
            // let r = randomSpawnPoint();
            // this.position.set(r.x, r.y);
            this.attack();
            return;
        }

        let direction = Math.atan2(
            this.#player.position.y - this.position.y,
            this.#player.position.x - this.position.x
        );

        this.vx = Math.cos(direction) * this.speed;
        this.vy = Math.sin(direction) * this.speed;

        this.position.x += this.vx * dt;
        this.position.y += this.vy * dt;
    }
}

function randomSpawnPoint(canvasWidth, canvasHeight) {
    const edge = Math.floor(Math.random() * 4);
    const point = { x: 0, y: 0 };

    switch (edge) {
        case 0: {
            point.x = canvasWidth * Math.random();
            point.y = 0;
            break;
        }
        case 1: {
            point.x = canvasWidth;
            point.y = canvasHeight * Math.random();
            break;
        }
        case 2: {
            point.x = canvasWidth * Math.random();
            point.y = canvasHeight;
            break;
        }
        case 3: {
            point.x = 0;
            point.y = canvasHeight * Math.random();
            break;
        }
        default: {
            break;
        }
    }

    return point;
}

export default Zombie;