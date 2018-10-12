import { Controller, ControllerType, Signals } from "./controller";
import { EEventTT } from "./eEvent";

export class GamepadControls implements Controller {
    signal: EEventTT<Controller, string>;
    type: ControllerType;

    constructor(public name: string, private index: number) {
        this.signal = new EEventTT<Controller, string>();
        this.type = ControllerType.gamepad;
    }

    public get xAxes(): number {
        var gamepads = navigator.getGamepads();
        var gp = gamepads[this.index];
        return gp.axes[0];
    }

    public get yAxes(): number {
        var gamepads = navigator.getGamepads();
        var gp = gamepads[this.index];
        return gp.axes[1];
    }

    public get start(): boolean {
        var gamepads = navigator.getGamepads();
        var gp = gamepads[this.index];
        return gp.buttons[9].pressed;
    }

    public get a(): boolean {
        var gamepads = navigator.getGamepads();
        var gp = gamepads[this.index];
        return gp.buttons[0].pressed;
    }

    public enableSignals() {
        this.signalListener();
    }

    private timeout = 0.5;
    private signalingTimers: { [id: string]: number } = {};

    private signalListener = () => {
        requestAnimationFrame(this.signalListener);

        var now = Date.now();

        this.checkSignal(this.start, Signals.start, now);
        this.checkSignal(this.yAxes < -0.3, Signals.up, now);
        this.checkSignal(this.yAxes > 0.3, Signals.down, now);
        this.checkSignal(this.xAxes < -0.3, Signals.left, now);
        this.checkSignal(this.xAxes > 0.3, Signals.right, now);
    }

    private checkSignal = (isPressed: boolean, signal: Signals, now: number) => {
        if (isPressed) {
            if (!this.signalingTimers[signal]) {
                this.signalingTimers[signal] = Date.now();
                this.signal.dispatchEvent(this, signal);
            }
            else if ((now - this.signalingTimers[signal]) / 1000 >= this.timeout) {
                this.signal.dispatchEvent(this, signal);
            }
        }
        else {
            this.signalingTimers[signal] = undefined;
        }
    }
}