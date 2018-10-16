import { View } from "./enc/view";
import { Controller } from "./enc/controller";
import { Snake } from "./snake";

export class GameView extends View {
    private snakes: Snake[] = [];

    private fpsInterval = 300;
    lastFrameTime: number;

    public start(controllers: Controller[]) {
        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i];
            var snake = new Snake(150, 100, controller);
            this.addAnimatable(snake);
            this.snakes.push(snake);
        }

        this.lastFrameTime = Date.now();
        this.addUpdate((timeDiff) => {


            var now = Date.now();
            var elapsed = now - this.lastFrameTime;

            if (elapsed > this.fpsInterval) {
                this.lastFrameTime = now;

                for (let i = 0; i < this.snakes.length; i++) {
                    const snake = this.snakes[i];
                    snake.tick();
                }
            }
        });
    }
}