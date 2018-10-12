import { EEventTT } from "./eEvent";

export enum Signals {
    start = "start",
    left = "left",
    up = "up",
    right = "right",
    down = "down"
}

export enum ControllerType {
    keyboard = "keyboard",
    gamepad = "gamepad"
}

export interface Controller {
    xAxes: number;
    yAxes: number;
    name: string;

    start: boolean;
    a: boolean;

    signal: EEventTT<Controller, string>;
    type: ControllerType
}