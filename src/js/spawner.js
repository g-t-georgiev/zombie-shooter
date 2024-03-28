class Spawner {

    constructor({ factoryFn, maxSpawnCount = 30 }) {
        const spawnInterval = 1000;
        this.maxSpawnCount = maxSpawnCount;
        this.factoryFn = factoryFn;
        this.spawns = [];
        setInterval(() => {
            this.spawn();
        }, spawnInterval);
    }

    spawn() {
        if (this.spawns.length >= this.maxSpawnCount) return;

        let s = this.factoryFn();
        this.spawns.push(s);
    }
}

export default Spawner;