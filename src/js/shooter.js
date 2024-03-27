let _app;
let _player;

class Shooter {

    constructor({ app, player }) {
        _app = app;
        _player = player;
        this.bulletSpeed = 4;
        this.bullets = [];
        this.bulletSize = 8;
        this.maxBulletsCount = 3;
    }

    changeState(fire = false) {
        if (fire) {
            this.fire();
            this.interval = window.setInterval(() => this.fire(), 500);
        } else {
            if (this.interval)
                window.clearInterval(this.interval);
        }
    }

    fire() {
        const bullet = new PIXI.Graphics();
        bullet.position.set(
            _player.position.x,
            _player.position.y
        );
        bullet.beginFill(0x0000FF, 1);
        bullet.drawCircle(0, 0, this.bulletSize);
        bullet.endFill();

        const angle = _player.rotation;
        bullet.velocity = new Victor(
            Math.cos(angle),
            Math.sin(angle)
        ).multiplyScalar(this.bulletSpeed);
        this.bullets.push(bullet);
        _app.stage.addChild(bullet);
    }

    update(dt) {
        if (this.bullets.length >= this.maxBulletsCount) {
            const timeoutId = window.setTimeout(() => {
                window.clearTimeout(timeoutId);
                const deleteCount = this.bullets.length - this.maxBulletsCount;
                const removedBullets = this.bullets.splice(0, deleteCount);
                removedBullets.forEach(bullet => {
                    _app.stage.removeChild(bullet);
                });
            });
        }


        this.bullets.forEach((bullet, i) => {
            if (
                bullet.position.x < 0 || 
                bullet.position.x > _app.view.width || 
                bullet.position.y < 0 || 
                bullet.position.y > _app.view.height
            ) {
                const timeoutId = window.setTimeout(() => {
                    window.clearTimeout(timeoutId);
                    this.bullets.splice(i, 1);
                    _app.stage.removeChild(bullet);
                });
                return;
            }

            bullet.position.set(
                bullet.position.x + bullet.velocity.x,
                bullet.position.y + bullet.velocity.y
            );
        });

        console.log(this.bullets.length, _app.stage.children.length);
    }
}

export default Shooter;