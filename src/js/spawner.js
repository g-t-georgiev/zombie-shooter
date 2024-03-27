class Spawner {

    constructor({ factoryFn }) {
        const spawnInterval = 1000;
        this.maxSpawnCount = 30;
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