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
const zSpawner = new Spawner({ factoryFn: () => new Zombie({ app, player }) });

app.ticker.add((dt) => {
    player.update(dt);
    zSpawner.spawns.forEach(zombie => zombie.update(dt));
});