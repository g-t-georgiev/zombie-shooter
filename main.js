import GameStartScreen from "./src/js/game-start.js";
import GameOverScreen from "./src/js/game-over.js";
import ScoreScreen from "./src/js/score.js";
import Player from "./src/js/player.js";
import Zombie from "./src/js/zombie.js";
import Spawner from "./src/js/spawner.js";

const wrapper = document.querySelector('.wrapper');
const canvas = wrapper.querySelector('canvas');

const ticker = PIXI.Ticker.shared;
const app = new PIXI.Application({
    view: canvas,
    backgroundColor: 0x000000,
    antialias: true, 
    transparent: false, 
    resolution: 1,
    resizeTo: wrapper
});

app.loader
    .add('PressStart2P', './src/assets/fonts/PressStart2P/PressStart2P_Regular.ttf')
    .load(onLoadCompleted);

const stage = app.stage;
const gameOverScreen = new GameOverScreen({ app });
const gameStartScreen = new GameStartScreen({ app });
const scoreScreen = new ScoreScreen({ app });
const player = new Player({ app });
const zSpawner = new Spawner({ app, maxSpawnCount: 30, factoryFn: () => new Zombie({ app, player }) });

let started = false;
let score = 0;
let maxScore = 0;

function onLoadCompleted() {
    gameStartScreen.show();
    ticker.autoStart = false;
    ticker.add(onUpdate);
    
    window.addEventListener('focus', function () {
        if (started) {
            app.paused = false;
            zSpawner.init();
            ticker.start();
        }       
    });

    window.addEventListener('blur', function () {
        if (started) {
            app.paused = true;
            ticker.stop();
        }
    });
    
    document.addEventListener("click", start, { once: true });
}

function start() {
    score = 0;
    let maxScoreFromCache = window.localStorage.getItem('highScore');
    maxScore = (maxScoreFromCache && parseInt(maxScoreFromCache)) || 0;
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
        window.localStorage.setItem('highScore', maxScore);
    }
    // console.log('You score: ', score);
    // console.log('Max score: ', maxScore);

    scoreScreen.destroy();
    ticker.stop();
    zSpawner.destroy();
    player.destroy();
    gameOverScreen.show({ score, maxScore });
    let timeoutId = window.setTimeout(function () {
        window.clearInterval(timeoutId);
        document.addEventListener("click", start, { once: true });
    }, 1500);
}

function onUpdate(dt) {
    if (!started) return;

    if (player.dead) {
        stop();
        return;
    }

    player.update(dt);
    zSpawner.spawns = zSpawner.spawns.filter(zombie => zombie.visible);
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
                bullet.visible = false;
                bullet.destroy();

                zombie.visible = false;
                zombie.kill();
            }

            return hasHit;
        });
    });
}