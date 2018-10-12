import { View } from "./enc/view";
import { Controller, Signals, ControllerType } from "./enc/controller";
import { KeyboardControls } from "./enc/keyboardControls";
import { GamepadScanner } from "./enc/gamepadScanner";
import { GamepadControls } from "./enc/gamepadControls";

export class MainMenuView extends View {
    private selectedOption: number;
    private options: string[] = [];
    private controllers: Controller[] = [];

    constructor() {
        super();
        this.options = ["Start Game", "Controls"];
        this.selectedOption = 0;
        this.addAnimation(this.drawOptions);
        this.addAnimation(this.drawControllers);

        var gamepadScanner = new GamepadScanner();
        gamepadScanner.scannedGamepad.addEventListener((gamepad: Gamepad) => {
            this.addController(new GamepadControls(gamepad.index.toString(), gamepad.index));
        });
        gamepadScanner.start();

        var keyboard = new KeyboardControls("arrows", 38, 37, 40, 39, 187);
        this.addController(keyboard);
    }

    public drawOptions = (ctx: CanvasRenderingContext2D, width: number, height: number) => {

        const fontSize = 22;
        const margin = 5;
        const optionsHeight = (fontSize + margin * 2) * this.options.length;
        const startHeight = height / 2 - optionsHeight / 2;
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];

            ctx.fillStyle = "black";
            ctx.textAlign = "center"; // start / left / center / right / end
            ctx.textBaseline = "middle" // bottom / alphabetic / middle / hanging / top
            ctx.font = "22px sans-serif";
            const optionHeight = startHeight + margin + (fontSize + margin * 2) * i;
            ctx.fillText(option, width / 2, optionHeight);

            if (i === this.selectedOption) {
                ctx.strokeRect(width / 2 - ctx.measureText(option).width / 2 - margin, optionHeight - fontSize / 2 - margin, ctx.measureText(option).width + margin * 2, fontSize + margin * 2);
            }
        }
    }

    public drawControllers = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        var margin = 5;
        var controllerWidth = 30;
        var totalWidth = margin + this.controllers.length * (controllerWidth + margin)
        var startX = width / 2 - totalWidth / 2
        for (let i = 0; i < this.controllers.length; i++) {
            const element = this.controllers[i];
            var x = startX + margin + (margin + controllerWidth) * i;
            switch (element.type) {
                case ControllerType.gamepad:
                    ctx.fillStyle = "red";
                    ctx.fillRect(x, height / 4, 20, 20);
                    break;
                case ControllerType.keyboard:
                    ctx.fillStyle = "green";
                    ctx.fillRect(x, height / 4, 20, 20);
                    break;
                default:
                    break;
            }
        }
    }

    private addController = (controller: Controller) => {
        if (controller.type == ControllerType.gamepad) {
            (<GamepadControls>controller).enableSignals();
        }
        controller.signal.addEventListener(this.controllerSignal)
    }

    private controllerSignal = (sender: Controller, signal: Signals) => {
        console.log("signal: " + signal);

        if (signal == Signals.start) {
            if (this.controllers.indexOf(sender) >= 0) {
                this.controllers.splice(this.controllers.indexOf(sender), 1);
            } else {
                this.controllers.push(sender);
            }
        } else if (this.controllers.length > 0 && this.controllers[0] == sender) {
            switch (signal) {
                case Signals.down:
                    this.selectedOption++;
                    if (this.selectedOption >= this.options.length) {
                        this.selectedOption = 0;
                    }
                    break;
                case Signals.up:
                    this.selectedOption--;
                    if (this.selectedOption < 0) {
                        this.selectedOption = this.options.length - 1;
                    }
                    break;
            }
        }
    }
}