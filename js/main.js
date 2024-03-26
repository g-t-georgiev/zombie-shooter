const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const SPAWN_INTERVAL = 1250;
const BULLET_INITIAL_SPEED = 10;

const appHolder = document.querySelector("#app");
const keys = {};
const enemies = [];

let app;
let canvasWidth;
let canvasHeight;

let startScreen;

let headbar;
let healthbar;
let scorebar;

let player;
let bullets = [];
let aimingAngle = 0;

let canSpawnEnemies = false;
let enemySpawnInterval = SPAWN_INTERVAL;

window.onload = function() {
    app = new PIXI.Application({
        width: 800,
        height: 600,
        antialias: true,
        transparent: false,
        backgroundColor: 0xAAAAAA
    });

    canvasWidth = app.view.width;
    canvasHeight = app.view.height;

    appHolder.appendChild(app.view);

    app.loader.baseUrl = "images";
    app.loader
        .add("player", "player.png")
        .add("bullet", "bullet.png");

    app.loader.onComplete.add(onLoaderComplete);
    app.loader.onError.add(onLoaderError);
    app.loader.load();

    startScreen = new PIXI.Container();
    const txt1 = new PIXI.Text("Start Game");
    txt1.x = canvasWidth / 2;
    txt1.y = canvasHeight / 5;
    txt1.anchor.set(.5);
    txt1.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 90,
        fontFamily: 'Arcade Classic'
    });
    startScreen.addChild(txt1);

    headbar = new PIXI.Container();
    headbar.x = 0;
    headbar.y = 0;

    healthbar = new PIXI.Container();
    healthbar.x = canvasWidth - 300;
    healthbar.y = 20;

    const healthbarEmpty = new PIXI.Graphics();
    healthbarEmpty.beginFill(0x040552);
    healthbarEmpty.drawRect(0, 0, 254, 16);
    healthbarEmpty.endFill();

    const healthbarFull = new PIXI.Graphics();
    healthbarFull.beginFill(0xa70b0b);
    healthbarFull.drawRect(2, 2, 250, 12);
    healthbarFull.endFill();

    healthbar.addChild(healthbarEmpty);
    healthbar.addChild(healthbarFull);
    headbar.addChild(healthbar);

    scorebar = new PIXI.Container();
    scorebar.x = 30;
    scorebar.y = 20;

    const scoreLabel = new PIXI.Text("Score");
    scoreLabel.x = 0;
    scoreLabel.y = 0;
    scoreLabel.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 24,
        fontFamily: 'Arcade Classic'
    });

    const scoreNum = new PIXI.Text("200");
    const scoreLabelTextMetrics = PIXI.TextMetrics.measureText("Score", scoreLabel.style);
    scoreNum.x = scoreLabel.x + scoreLabelTextMetrics.width + 7;
    scoreNum.y = 0;
    scoreNum.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 25,
        fontFamily: 'Arcade Classic'
    });

    scorebar.addChild(scoreLabel);
    scorebar.addChild(scoreNum);
    headbar.addChild(scorebar);
}

function onLoaderComplete() {
    player = PIXI.Sprite.from(app.loader.resources.player.texture);
    player.anchor.set(.5);
    player.x = canvasWidth / 2;
    player.y = canvasHeight / 2;
    player.hp = 100;
    player.attack = 3;
    player.score = 0;

    Object.defineProperties(player, {
        centerX: {
            get() {
                return this.x + this.width / 2;
            },
            enumerable: true,
            configurable: true
        },
        centerY: {
            get() {
                return this.y + this.height / 2;
            },
            enumerable: true,
            configurable: true
        }
    });

    app.stage.addChild(player);

    app.stage.addChild(headbar);

    app.stage.addChild(startScreen);

    appHolder.addEventListener("pointerup", function () {
        if (startScreen) {
            app.stage.removeChild(startScreen);
        }

        // window.addEventListener("keydown", keyDownHandler);
        // window.addEventListener("keyup", keyUpHandler);

        app.stage.interactive = true;
        document.addEventListener("pointermove", rotateHandler);
        appHolder.addEventListener("pointerdown", shootBullets);

        canSpawnEnemies = true;
    });

    app.ticker.add(gameLoop);
}

function onLoaderError(ev) {
    console.log('ERROR', ev.message);
}

function rotateHandler(ev) {
    const bounds = player.getBounds();
    let centerX = bounds.x + bounds.width / 2;
    let centerY = bounds.y + bounds.height / 2;
    let mouseX = ev.clientX - centerX;
    let mouseY = ev.clientY - centerY;
    let angle = Math.atan2(mouseX, -mouseY);
    aimingAngle = angle;
}

function keyDownHandler(ev) {
    if (ev.code === 'KeyW') {
        keys.w = true;
    } else if (ev.code === 'KeyA') {
        keys.a = true;
    } else if (ev.code === 'KeyD') {
        keys.d = true;
    } else if (ev.code === 'KeyS') {
        keys.s = true;
    }
}

function keyUpHandler(ev) {
    if (ev.code === 'KeyW') {
        keys.w = false;
    } else if (ev.code === 'KeyA') {
        keys.a = false;
    } else if (ev.code === 'KeyD') {
        keys.d = false;
    } else if (ev.code === 'KeyS') {
        keys.s = false;
    }
}

function gameLoop(dt) {
    updateBullets(dt);
    updatePlayer(dt);
    updateEnemies(dt);
    spawnEnemies();
}

function updatePlayer(dt) {
    player.rotation = aimingAngle;

    // if (keys.w) {
    //     player.y -= 5;
    // }
    
    // if (keys.a) {
    //     player.x -= 5;
    // } 
    
    // if (keys.d) {
    //     player.x += 5;
    // }
    
    // if (keys.s) {
    //     player.y += 5;
    // }
}

function shootBullets(ev) {
    let mouseX = ev.clientX - player.centerX;
    let mouseY = ev.clientY - player.centerY;
    let angle = Math.atan2(mouseX, -mouseY);

    let bullet = createBullet(angle);
    // console.log(bullets);
    bullets.push(bullet);
}

function updateBullets(dt) {
    for (const bullet of bullets) {
        if (
            bullet.position.y < 0 || 
            bullet.position.x < 0 || 
            bullet.position.y > app.view.height || 
            bullet.position.x > app.view.width
        ) {
            bullet.visible = false;
            window.setTimeout(function () {
                app.stage.removeChild(bullet);
                let bulledIdx = bullets.findIndex(b => b === bullet);
                if (bulledIdx !== -1) {
                    bullets.splice(bulledIdx, 1);
                }
            });
            continue;
        }

        bullet.position.x += bullet.speed * Math.cos(bullet.aimingAngle);
        bullet.position.y += bullet.speed * Math.sin(bullet.aimingAngle);
    }
}

function createBullet(aimingAngle) {
    aimingAngle -= 90 * D2R;
    const bullet = PIXI.Sprite.from(app.loader.resources.bullet.texture);
    bullet.anchor.set(.5);
    bullet.aimingAngle = aimingAngle;
    bullet.position.x = player.x + player.width / 2 * Math.cos(aimingAngle);
    bullet.position.y = player.y + player.width / 2 * Math.sin(aimingAngle);
    bullet.speed = BULLET_INITIAL_SPEED;
    app.stage.addChild(bullet);
    return bullet;
}

function createEnemy({ x = 0, y = 0, size = 20, speed = 2, color = 0x6a1391, hp = 20, attack = 5 }) {
    const enemy = new PIXI.Graphics();
    enemy.beginFill(color);
    enemy.drawCircle(x, y, size / 2);
    enemy.endFill();
    enemy.hp = hp;
    enemy.attack = attack;
    enemy.speed = speed;

    const deltaX = player.centerX - enemy.x;
    const deltaY = player.centerY - enemy.y;
    enemy.directionAngle = Math.atan2(deltaX, -deltaY);

    enemies.push(enemy);
    app.stage.addChild(enemy);
    return enemy;
}

function randomSpawnPoint() {
    let edge = Math.floor(Math.random() * 4);
    let spawnPoint = { x: 0, y: 0 };
    if (edge === 0) {
        spawnPoint.x = canvasWidth * Math.random();
        spawnPoint.y = 0;
    } else if (edge === 1) {
        spawnPoint.x = canvasWidth;
        spawnPoint.y = canvasHeight * Math.random();
    } else if (edge === 2) {
        spawnPoint.x = canvasWidth * Math.random();
        spawnPoint.y = canvasHeight;
    } else if (edge === 3) {
        spawnPoint.x = 0;
        spawnPoint.y = canvasHeight * Math.random();
    }

    return spawnPoint;
}

function spawnEnemies() {
    if (!canSpawnEnemies) return;

    if (enemySpawnInterval <= 0) {
        let vSP = randomSpawnPoint();
        const enemy = createEnemy({
            x: vSP.x, y: vSP.y
        });
        enemySpawnInterval = SPAWN_INTERVAL;
    }

    enemySpawnInterval -= 10;
}

function updateEnemies(dt) {
    for (const enemy of enemies) {
        enemy.position.x += enemy.speed * Math.cos(enemy.directionAngle);
        enemy.position.y += enemy.speed * Math.sin(enemy.directionAngle);
    }
}