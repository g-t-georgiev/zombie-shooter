class Spawner {
    #startFn;
    #timer;

    constructor({ app, factoryFn, maxSpawnCount = 30 }) {
        const interval = 1000;
        this.maxSpawnCount = maxSpawnCount;
        this.factoryFn = factoryFn;
        this.spawns = [];
        this.#startFn = () => {
            this.#timer = window.setInterval(() => {
                if (app.paused) {
                    window.clearInterval(this.#timer);
                    return;
                }
                
                this.spawn();
            }, interval);
        };
    }

    init() {
        this.#startFn?.();
    }

    destroy() {
        if (this.#timer) {
            window.clearInterval(this.#timer);
        }

        this.spawns.forEach(spawn => spawn.destroy?.());
        this.spawns.length = 0;
    }

    spawn() {
        if (this.spawns.length >= this.maxSpawnCount) return;

        let s = this.factoryFn();
        s.init();
        this.spawns.push(s);
    }
}

export default Spawner;