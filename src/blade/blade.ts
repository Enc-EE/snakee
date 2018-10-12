import { Animatable } from "../enc/animation";
import { Controller } from "../enc/controller";

export class Blade implements Animatable {
    public x: number;
    public y: number;
    public bladeNumber: number;
    public vx: number;
    public vy: number;
    public r: number;
    private startRotations: number;
    private rotations: number;
    private angle: number;
    public m: number;
    private f: number;
    private fStart: number;
    private A: number;
    private cw: number;
    private p: number;

    private powerUpF: number;
    private powerUpStart: number;
    private powerUpCurrent: number;

    constructor(private controller: Controller) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.m = 0.1;
        this.f = 463;
        this.fStart = 463;
        this.powerUpF = this.f * 2;
        this.powerUpStart = 2;
        this.powerUpCurrent = this.powerUpStart;
        this.r = 25;
        this.startRotations = 2124;
        this.rotations = this.startRotations;

        this.A = 0.01;
        this.cw = 0.05;
        this.p = 1;
    }

    public collision() {
        var damage = 24 + (this.vx * this.vx + this.vy * this.vy) / 1492;
        this.rotations -= damage;
        if (this.rotations < 0) {
            this.rotations = 0;
            this.iMDone(this);
        }
    }

    public update = (timeDiff: number) => {
        if (this.rotations > 0) {
            var rotate = this.rotations / 1000 * timeDiff * Math.PI * 2
            this.angle = this.angle + rotate;
            this.angle = this.angle % (Math.PI * 2);

            if (this.controller.a) {
                if (this.powerUpCurrent > 0) {
                    this.f = this.powerUpF;
                    this.powerUpCurrent -= timeDiff;
                } else {
                    this.f = this.fStart;
                }
            }
            else {
                this.f = this.fStart;
                if (this.powerUpCurrent < this.powerUpStart) {
                    this.powerUpCurrent += timeDiff;
                    if (this.powerUpCurrent > this.powerUpStart) {
                        this.powerUpCurrent = this.powerUpStart;
                    }
                }
            }

            var fFrictionX = 0.5 * this.A * this.cw * this.p * this.vx * Math.abs(this.vx);
            var fFrictionY = 0.5 * this.A * this.cw * this.p * this.vy * Math.abs(this.vy);

            var ax = this.f * this.controller.xAxes - fFrictionX / this.m;
            var ay = this.f * this.controller.yAxes - fFrictionY / this.m;

            this.vx += ax * timeDiff;
            this.vy += ay * timeDiff;

            this.x += this.vx * timeDiff;
            this.y += this.vy * timeDiff;
        }
    }

    public draw = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        if (this.scorePosition) {
            this.drawScore(ctx, width, height);
        }
        else {
            this.drawInfo(ctx, width, height);
            this.drawBlade(ctx);
        }
    }

    public scorePosition: number;
    public iMDone = (blade: Blade) => {

    }

    private drawScore(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.fillStyle = this.getBladeColor();
        ctx.font = "76px sans-serif";
        var text = this.scorePosition.toString() + ".";
        var additionalSpace = 30;
        switch (this.bladeNumber) {
            case 1:
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillText(text, additionalSpace, additionalSpace);
                break;
            case 2:
                ctx.textBaseline = "top";
                ctx.textAlign = "right";
                ctx.fillText(text, width - additionalSpace, additionalSpace);
                break;
            case 3:
                ctx.textBaseline = "bottom";
                ctx.textAlign = "left";
                ctx.fillText(text, additionalSpace, height - additionalSpace);
                break;
            case 4:
                ctx.textBaseline = "bottom";
                ctx.textAlign = "right";
                ctx.fillText(text, width - additionalSpace, height - additionalSpace);
                break;
        }
    }

    private drawBlade(ctx: CanvasRenderingContext2D) {
        if (this.rotations > 0) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            var cubeSize = Math.sqrt(this.r * this.r / 2);
            ctx.fillRect(-cubeSize, -cubeSize, cubeSize * 2, cubeSize * 2);
            ctx.restore();
        }
    }

    private drawInfo(ctx: CanvasRenderingContext2D, width: number, height: number) {
        var life = this.rotations / this.startRotations * width / 4;
        var powerUp = this.powerUpCurrent / this.powerUpStart * width / 4;
        ctx.fillStyle = "rgba(148, 0, 211, 0.6)";
        if (this.bladeNumber < 1 || this.bladeNumber > 4) {
            console.log("error?");
        }
        switch (this.bladeNumber) {
            case 1:
                ctx.fillRect(0, 30, powerUp, 20);
                break;
            case 2:
                ctx.fillRect(width, 30, -powerUp, 20);
                break;
            case 3:
                ctx.fillRect(0, height - 30, powerUp, -20);
                break;
            case 4:
                ctx.fillRect(width, height - 30, -powerUp, -20);
                break;
        }
        ctx.fillStyle = this.getBladeColor();
        switch (this.bladeNumber) {
            case 1:
                ctx.fillRect(0, 0, life, 30);
                break;
            case 2:
                ctx.fillRect(width, 0, -life, 30);
                break;
            case 3:
                ctx.fillRect(0, height, life, -30);
                break;
            case 4:
                ctx.fillRect(width, height, -life, -30);
                break;
        }
    }

    private getBladeColor() {
        switch (this.bladeNumber) {
            case 1:
                return "red";
            case 2:
                return "green";
            case 3:
                return "blue";
            case 4:
                return "orange";
            default:
                return "black";
        }
    }
}