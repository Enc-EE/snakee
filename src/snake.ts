import { Animatable } from "./enc/animation";
import { Controller, Signals } from "./enc/controller";

enum Direction {
    up,
    right,
    down,
    left
}

export class Snake implements Animatable {

    private parts: { x: number, y: number }[] = [];

    private direction: Direction;

    constructor(private fieldWidth: number, private fieldHeight: number, private controller: Controller) {
        this.direction = Direction.right;
        this.parts = [
            {
                x: 3,
                y: 5,
            },
            {
                x: 4,
                y: 5,
            },
            {
                x: 5,
                y: 5,
            }
        ]
        controller.signal.addEventListener(this.controllerSignal)
    }

    private controllerSignal = (sender: Controller, signal: Signals) => {
        switch (signal) {
            case Signals.up:
                if (this.direction != Direction.down) {
                    this.direction = Direction.up;
                }
                break;
            case Signals.right:
                if (this.direction != Direction.left) {
                    this.direction = Direction.right;
                }
                break;
            case Signals.down:
                if (this.direction != Direction.up) {
                    this.direction = Direction.down;
                }
                break;
            case Signals.left:
                if (this.direction != Direction.right) {
                    this.direction = Direction.left;
                }
                break;
        }
    }

    public tick = () => {
        const current = this.parts[this.parts.length - 1]
        switch (this.direction) {
            case Direction.up:
                this.parts.push({ x: current.x, y: current.y - 1 })
                break;
            case Direction.right:
                this.parts.push({ x: current.x + 1, y: current.y })
                break;
            case Direction.down:
                this.parts.push({ x: current.x, y: current.y + 1 })
                break;
            case Direction.left:
                this.parts.push({ x: current.x - 1, y: current.y })
                break;
        }
        this.parts.shift();
    }

    public update = (timeDiff: number) => {
    }

    public draw = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        for (let i = 0; i < this.parts.length; i++) {
            const part = this.parts[i];
            ctx.fillStyle = "black";
            ctx.fillRect(width / this.fieldHeight * part.x, height / this.fieldHeight * part.y, 10, 10);
        }
    }
}