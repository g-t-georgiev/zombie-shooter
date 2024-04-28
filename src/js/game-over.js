class GameOverScreen extends PIXI.Container {
    #app;
    #stage;
    #view;

    #text3;
    #text4;

    constructor({ app }) {
        super();
        this.#app = app;
        this.#stage = app.stage;
        this.#view = app.view;

        const canvasWidth = this.#view.width;
        const canvasHeight = this.#view.height;

        this.position.set(0, 0);
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.visible = false;

        const text1 = new PIXI.Text("GAME OVER");
        text1.anchor.set(.5, 0);
        text1.position.set(canvasWidth / 2, canvasHeight * .3);
        text1.style = new PIXI.TextStyle({
            fontFamily: "Press Start 2P",
            fontSize: 35,
            fill: 0xFFFFFF
        });
        const text1Metrics = PIXI.TextMetrics.measureText("M", text1.style);

        const text2 = new PIXI.Text("CLICK TO RESTART");
        text2.style = new PIXI.TextStyle({
            fontFamily: "Press Start 2P",
            fontSize: 25,
            fill: 0xFFFFFF
        });
        text2.anchor.set(.5, 0);
        text2.position.set(
            canvasWidth / 2, 
            canvasHeight * .3 + text1Metrics.width + 10
        );
        const text2Metrics = PIXI.TextMetrics.measureText("M", text2.style);

        this.#text3 = new PIXI.Text("YOUR SCORE: 000 PTS");
        this.#text3.anchor.set(.5, 0);
        this.#text3.style = new PIXI.TextStyle({
            fontFamily: "Press Start 2P",
            fontSize: 27,
            fill: 0xFFFFFF
        });
        this.#text3.position.set(
            canvasWidth / 2,
            canvasHeight * .3 + text1Metrics.width + text2Metrics.width + 35
        );
        const text3Metrics = PIXI.TextMetrics.measureText("M", this.#text3.style);

        this.#text4 = new PIXI.Text("MAX SCORE: 000 PTS");
        this.#text4.anchor.set(.5, 0);
        this.#text4.style = new PIXI.TextStyle({
            fontFamily: "Press Start 2P",
            fontSize: 27,
            fill: 0xFFFFFF
        });
        this.#text4.position.set(
            canvasWidth / 2,
            canvasHeight * .3 + text1Metrics.width + text2Metrics.width + text3Metrics.width + 50
        );

        this.addChild(text1);
        this.addChild(text2);
        this.addChild(this.#text3);
        this.addChild(this.#text4);
    }

    show({ score = 0, maxScore = 0 }) {
        score = score.toString().padStart(3, '0');
        maxScore = maxScore.toString().padStart(3, '0');
        this.#text3.text  = this.#text3.text.replace(/\d+ PTS/, `${score} PTS`);
        this.#text4.text = this.#text4.text.replace(/\d+ PTS/, `${maxScore} PTS`);
        this.visible = true;
        this.#stage.addChild(this);
    }

    hide() {
        this.visible = false;
        this.#stage.removeChild(this);
    }
}

export default GameOverScreen;