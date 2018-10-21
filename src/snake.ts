import { Animatable } from "./enc/animation";
import { Controller, Signals } from "./enc/controller";
import { EEvent } from "./enc/eEvent";

enum Direction {
    up,
    right,
    down,
    left
}

export class Snake implements Animatable {

    public parts: { x: number, y: number }[] = [];

    private direction: Direction;
    private nextDirection: Direction
    private color: string;
    iMDone: EEvent;
    private isDone: boolean;


    public get headPart(): { x: number, y: number } {
        return this.parts[this.parts.length - 1];
    }


    constructor(private fieldSize: number, private controller: Controller, private playerNumber: number) {
        this.direction = Direction.right;
        this.nextDirection = this.direction;
        this.isDone = false;
        this.color = "hsl(" + playerNumber * 360 + ",100%, 40%)"
        for (let i = 0; i < 7; i++) {
            this.parts.push({ x: 3 + i, y: 1 + Math.round(playerNumber * 20) });
        }
        controller.signal.addEventListener(this.controllerSignal)

        this.iMDone = new EEvent();
        this.iMDone.addEventListener(this.finish)
    }

    private finish = () => {
        this.color = "hsl(" + this.playerNumber * 360 + ",100%, 80%)"
        this.isDone = true;
    }

    private controllerSignal = (sender: Controller, signal: Signals) => {
        switch (signal) {
            case Signals.up:
                if (this.direction != Direction.down) {
                    this.nextDirection = Direction.up;
                }
                break;
            case Signals.right:
                if (this.direction != Direction.left) {
                    this.nextDirection = Direction.right;
                }
                break;
            case Signals.down:
                if (this.direction != Direction.up) {
                    this.nextDirection = Direction.down;
                }
                break;
            case Signals.left:
                if (this.direction != Direction.right) {
                    this.nextDirection = Direction.left;
                }
                break;
        }
    }

    public tick = () => {
        if (!this.isDone) {
            this.direction = this.nextDirection;
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
    }

    public update = (timeDiff: number) => {
    }

    public draw = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {

        const numberOfBlocksX = (this.fieldSize * 30)
        const fieldSizeX = width / numberOfBlocksX;
        let numberOfBlocksY = height / fieldSizeX;
        numberOfBlocksY = Math.ceil(numberOfBlocksY)
        const fieldSizeY = height / numberOfBlocksY;
        for (let i = 0; i < this.parts.length; i++) {
            const part = this.parts[i];
            ctx.fillStyle = this.color;
            ctx.fillRect(part.x * fieldSizeX, part.y * fieldSizeY, fieldSizeX, fieldSizeY);
        }
    }
}