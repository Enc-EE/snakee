import { View } from "./enc/view";
import { Controller } from "./enc/controller";
import { Snake } from "./snake";

export class GameView extends View {
    private snakes: Snake[] = [];

    private fpsInterval = 300;
    lastFrameTime: number;
    fieldSize: number;
    numberOfBlocksY: number;
    numberOfBlocksX: number;
    items: { x: number, y: number }[] = [];
    itemSpawnerDelay: number;
    currentItemSpawnDelay: number;
    maxItems: number;

    public start(controllers: Controller[]) {
        this.fieldSize = 1;
        this.itemSpawnerDelay = 5;
        this.currentItemSpawnDelay = this.itemSpawnerDelay;
        this.maxItems = 3;
        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i];
            var snake = new Snake(this.fieldSize, controller, i / controllers.length);
            this.addAnimatable(snake);
            this.snakes.push(snake);
        }

        this.lastFrameTime = Date.now();
        this.addUpdate(this.update);
        this.addAnimation(this.animation);
    }

    public update = (timeDiff: number) => {
        var now = Date.now();
        var elapsed = now - this.lastFrameTime;

        if (elapsed > this.fpsInterval) {
            this.lastFrameTime = now;

            if (this.items.length < this.maxItems) {
                if (this.currentItemSpawnDelay == 0) {
                    this.currentItemSpawnDelay = this.itemSpawnerDelay;
                    let foundItem = true;
                    let maxIterations = 20;
                    do {
                        foundItem = true;
                        let itemX = Math.floor(Math.random() * this.numberOfBlocksX);
                        let itemY = Math.floor(Math.random() * this.numberOfBlocksY);

                        for (let i = 0; i < this.snakes.length && foundItem; i++) {
                            const snake = this.snakes[i];
                            for (let j = 0; j < snake.parts.length && foundItem; j++) {
                                const part = snake.parts[j];
                                if (part.x == itemX && part.y == itemY) {
                                    foundItem = false;
                                }
                            }
                        }
                        maxIterations--;
                        if (foundItem) {
                            this.items.push({ x: itemX, y: itemY });
                        }
                    } while (!foundItem && maxIterations > 0);
                }
                else {
                    this.currentItemSpawnDelay--;
                }
            }

            for (let i = 0; i < this.snakes.length; i++) {
                const snake = this.snakes[i];
                snake.tick();
            }
            for (let i = 0; i < this.snakes.length; i++) {
                const snake1 = this.snakes[i];
                if (snake1.headPart.x < 0 || snake1.headPart.y < 0 || snake1.headPart.x >= this.numberOfBlocksX || snake1.headPart.y >= this.numberOfBlocksY) {
                    snake1.iMDone.dispatchEvent();
                }
                for (let j = 0; j < this.snakes.length; j++) {
                    const snake2 = this.snakes[j];
                    let length = snake1 != snake2 ? snake2.parts.length : snake2.parts.length - 1;
                    for (let k = 0; k < length; k++) {
                        const part = snake2.parts[k];
                        if (part.x == snake1.headPart.x && part.y == snake1.headPart.y) {
                            snake1.iMDone.dispatchEvent();
                        }
                    }
                }
            }

        }
    };

    public animation = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        let fieldSizeX = width / this.numberOfBlocksX;
        const fieldSizeY = height / this.numberOfBlocksY;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(item.x * fieldSizeX + fieldSizeX / 2, item.y * fieldSizeY + fieldSizeY / 2, fieldSizeX / 3, 0, Math.PI * 2);
            ctx.fill();
        }

        this.numberOfBlocksX = (this.fieldSize * 30)
        fieldSizeX = width / this.numberOfBlocksX;
        this.numberOfBlocksY = Math.ceil(height / fieldSizeX);
    };
}