import GameStartScreen from "./src/js/game-start.js";
import GameOverScreen from "./src/js/game-over.js";
import ScoreScreen from "./src/js/score.js";
import Player from "./src/js/player.js";
import Zombie from "./src/js/zombie.js";
import Spawner from "./src/js/spawner.js";

const canvasSize = 512;
const canvas = document.getElementById("app");

const ticker = PIXI.Ticker.shared;
const app = new PIXI.Application({
    view: canvas,
    width: canvasSize,
    height: canvasSize,
    backgroundColor: 0x5c812f,
});
const stage = app.stage;
const gameOverScreen = new GameOverScreen({ app });
const gameStartScreen = new GameStartScreen({ app });
const scoreScreen = new ScoreScreen({ app });
const player = new Player({ app });
const zSpawner = new Spawner({ app, maxSpawnCount: 30, factoryFn: () => new Zombie({ app, player }) });

let started = false;
let score = 0;
let maxScore = 0;

gameStartScreen.show();
ticker.autoStart = false;
ticker.add(onUpdate);

window.addEventListener('focus', function () {
    if (started) {
        // console.log('Game resumed');
        app.paused = false;
        zSpawner.init();
        ticker.start();
    }
    
});
window.addEventListener('blur', function () {
    if (started) {
        // console.log('Game puased');
        app.paused = true;
        ticker.stop();
    }
});

document.addEventListener("click", start, { once: true });

function start() {
    score = 0;
    started = true;

    if (gameStartScreen.visible) {
        gameStartScreen.hide();
    }

    if (gameOverScreen.visible) {
        gameOverScreen.hide();
    }

    scoreScreen.init();
    player.init();
    zSpawner.init();
    ticker.start();
}

function stop() {
    started = false;
    if (score > maxScore) {
        maxScore = score;
    }
    // console.log('You score: ', score);
    // console.log('Max score: ', maxScore);

    scoreScreen.destroy();
    ticker.stop();
    zSpawner.destroy();
    player.destroy();
    gameOverScreen.show({ score, maxScore });
    document.addEventListener("click", start, { once: true });
}

function onUpdate(dt) {
    if (!started) return;

    if (player.dead) {
        stop();
        return;
    }

    player.update(dt);
    zSpawner.spawns.forEach(zombie => zombie.update(dt));
    if (bulletHitTest({ bullets: player.shooter.bullets, zombies: zSpawner.spawns })) {
        score += 1;
        scoreScreen.update(score);
    }
}

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