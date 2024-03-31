class ScoreScreen extends PIXI.Container {
    #app;
    #view;
    #stage;

    #score;

    constructor({ app }) {
        super();
        this.#app = app;
        this.#view = app.view;
        this.#stage = app.stage;

        this.#score = new PIXI.Text("SCORE:  0 PTS");
        this.#score.anchor.set(0, .5);
        this.#score.style = new PIXI.TextStyle({
            fontFamily: "Arcade Classic",
            fontSize: 22,
            fill: 0x0A0A5D
        });
        const textMetrics = PIXI.TextMetrics.measureText("M", this.#score.style);

        this.x = 20;
        this.y = 20 + textMetrics.width / 7;

        this.addChild(this.#score);
    }

    update(score) {
        this.#score.text = this.#score.text.replace(/\d+ PTS/, `${score} PTS`);
    }

    init() {
        this.#stage.addChild(this);
    }

    destroy() {
        this.#score.text = this.#score.text.replace(/\d+ PTS/, `0 PTS`);
        this.#stage.removeChild(this);
    }
}

export default ScoreScreen;