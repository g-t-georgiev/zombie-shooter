let _app;
let _player;

class Zombie extends PIXI.Sprite {

    constructor({ app, player, texture, speed = 2, size = 16 }) {
        _app = app;
        _player = player;

        const r = randomSpawnPoint();

        if (!texture) {
            const circle = new PIXI.Graphics();
            circle.beginFill(0xFF0000, 1);
            circle.drawCircle(0, 0, size);
            circle.endFill();
            texture = app.renderer.generateTexture(circle);
        }
        
        super(texture);
        this.width = size * 2;
        this.height = size * 2;
        this.position.set(r.x, r.y);
        this.anchor.set(.5);
        this.speed = speed;
        _app.stage.addChild(this);
    }

    update(dt) {
        const e = new Victor(this.position.x, this.position.y);
        const s = new Victor(_player.position.x, _player.position.y);

        if (e.distance(s) < _player.width) {
            let r = randomSpawnPoint();
            this.position.set(r.x, r.y);
        }

        const d = s.subtract(e);
        const v = d.normalize().multiplyScalar(this.speed);
        this.position.set(this.position.x + v.x, this.position.y + v.y);
    }
}

function randomSpawnPoint() {
    const edge = Math.floor(Math.random() * 4);
    const point = new Victor(0, 0);
    const canvasSize = _app.screen.width;
    switch (edge) {
        case 0: {
            point.x = canvasSize * Math.random();
            point.y = 0;
            break;
        }
        case 1: {
            point.x = canvasSize;
            point.y = canvasSize * Math.random();
            break;
        }
        case 2: {
            point.x = canvasSize * Math.random();
            point.y = canvasSize;
            break;
        }
        case 3: {
            point.x = 0;
            point.y = canvasSize * Math.random();
            break;
        }
        default: {
            break;
        }
    }

    return point;
}

export default Zombie;