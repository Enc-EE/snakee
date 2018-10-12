import { Animatable } from "../enc/animation";
import { Controller } from "../enc/controller";

export class MenuBlade implements Animatable {
    private angle: number;
    private isShown = false;
    private isAdded = false;
    private addTimer: number;
    private addTimerSeconds = 1.5;
    private removeTimerSeconds = 2.5;
    public x: number;
    public y: number;
    private rememberedX = 0;
    private rememberedY = 0;

    public location = 0;

    public color: string;

    public get controllerName(): string {
        return this.controller.name;
    }

    constructor(public controller: Controller, private onShow: (blade: MenuBlade) => void, private onAdd: (blade: MenuBlade) => void, private onRemove: (blade: MenuBlade) => void, private start: () => void) {
        this.color = "black";
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.addTimer = 0;
    }

    public update = (timeDiff: number) => {
        if (this.isShown) {
            if (this.isAdded) {
                this.angle = this.angle + Math.PI / 9;
                this.angle = this.angle % (Math.PI * 2);
                this.x = this.rememberedX + this.controller.xAxes * 25;
                this.y = this.rememberedY + this.controller.yAxes * 25;

                if (this.controller.yAxes > 0.3) {
                    this.addTimer += this.controller.yAxes * timeDiff;
                    if (this.addTimer >= this.removeTimerSeconds) {
                        this.addTimer = 0;
                        this.isShown = false;
                        this.isAdded = false;
                        this.onRemove(this);
                    }
                } else if (this.controller.yAxes < 0.1) {
                    this.addTimer = 0;
                }

                if (this.controller.start) {
                    console.log("start");
                    this.start();
                }
            } else {
                if (this.controller.yAxes < -0.3) {
                    this.addTimer -= this.controller.yAxes * timeDiff;

                    if (this.addTimer >= this.addTimerSeconds) {
                        this.onAdd(this);
                        this.isAdded = true;
                        this.addTimer = 0;
                    }
                } else if (this.controller.yAxes > -0.1) {
                    this.addTimer = 0;
                    this.isShown = false;
                    this.onRemove(this);
                }
            }
        } else {
            if (this.controller.yAxes < -0.3) {
                this.onShow(this);
                this.isShown = true;
                this.addTimer -= this.controller.yAxes * timeDiff;
            }
        }
    }
    public draw = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        if (this.location > 0) {
            console.log(this.location);

            let color = "black";
            let startX = 0;
            let startY = 0;
            switch (this.location) {
                case 1:
                    color = "red";
                    startX = width / 3;
                    startY = (height - 100) / 3 + 100;
                    break;
                case 2:
                    color = "green";
                    startX = width / 3 * 2;
                    startY = (height - 100) / 3 + 100;
                    break;
                case 3:
                    color = "blue";
                    startX = width / 3;
                    startY = (height - 100) / 3 * 2 + 100;
                    break;
                case 4:
                    color = "orange";
                    startX = width / 3 * 2;
                    startY = (height - 100) / 3 * 2 + 100;
                    break;
            }
            this.color = color;
            this.x = startX;
            this.y = startY;
            this.rememberedX = startX;
            this.rememberedY = startY;

            this.location = 0;
        }

        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.isAdded) {
            ctx.save();
            ctx.rotate(this.angle);
            ctx.fillRect(-25, -25, 50, 50);
            ctx.restore();
        }

        if (this.isShown && !this.isAdded) {
            ctx.fillRect(-25, 35, 50 / this.addTimerSeconds * this.addTimer, 10);
        }

        if (this.isShown && this.isAdded && this.addTimer > 0) {
            ctx.fillRect(-25, 35, 50 - 50 / this.removeTimerSeconds * this.addTimer, 10);
        }

        ctx.restore();
    }
}