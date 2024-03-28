import Player from "./src/js/player.js";
import Zombie from "./src/js/zombie.js";
import Spawner from "./src/js/spawner.js";

const canvasSize = 512;
const canvas = document.getElementById("app");
const app = new PIXI.Application({
    view: canvas,
    width: canvasSize,
    height: canvasSize,
    backgroundColor: 0x5c812f,
});

const player = new Player({ app });
const zSpawner = new Spawner({ maxSpawnCount: 30, factoryFn: () => new Zombie({ app, player }) });

app.ticker.add((dt) => {
    player.update(dt);
    zSpawner.spawns.forEach(zombie => zombie.update(dt));
    if (bulletHitTest({ bullets: player.shooter.bullets, zombies: zSpawner.spawns })) {
        console.log('Hit');
    }
});

function bulletHitTest({ bullets, zombies }) {
    return bullets.some((bullet, i) => {
        return zombies.some((zombie, j) => {
            const dx = zombie.position.x - bullet.position.x;
            const dy = zombie.position.y - bullet.position.y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            const hasHit = distance < bullet.halfWidth + zombie.halfWidth;

            if (hasHit) {
                bullet.destroy();
                zombie.kill();
                bullets.splice(i, 1);
                zombies.splice(j, 1);
            }

            return hasHit;
        });
    });
}