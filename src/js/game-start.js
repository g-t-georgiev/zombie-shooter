class GameStartScreen extends PIXI.Container {
    #app;
    #stage;
    #view;

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

        const text = new PIXI.Text("CLICK TO START");
        text.anchor.set(.5, 0);
        text.position.set(canvasWidth / 2, canvasHeight * .3);
        text.style = new PIXI.TextStyle({
            fontFamily: "Press Start 2P",
            fontSize: 35,
            fill: 0xFFFFFF,
        });

        this.addChild(text);
    }

    show() {
        this.visible = true;
        this.#stage.addChild(this);
    }

    hide() {
        this.visible = false;
        this.#stage.removeChild(this);
    }
}

export default GameStartScreen;