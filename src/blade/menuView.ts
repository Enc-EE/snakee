import { View } from "../enc/view";
import { MenuBlade } from "./menuBlade";
import { KeyboardControls } from "../enc/keyboardControls";
import { GamepadControls } from "../enc/gamepadControls";
import { Controller } from "../enc/controller";

export class MenuView extends View {
    private menuBlades: MenuBlade[] = [];
    public controllers: Controller[] = [];
    private gamepads: { [id: string]: Gamepad } = {};
    gamepadScanner: number;

    constructor(private start: () => void) {
        super();
        var haveEvents = 'ongamepadconnected' in window;
        this.addAnimation((ctx, width, height) => {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "22px sans-serif";
            ctx.fillText("You can control a blade with a gamepad, the arrow keys (and +) or WASD (and q).", width / 2, 50);
            ctx.fillText("Press up to join and down to leave.", width / 2, 80);
            ctx.fillText("Press enter on keyboard or start on a controller to start.", width / 2, 110);
        });
        var blade1 = new MenuBlade(new KeyboardControls("arrows", 38, 37, 40, 39, 187), this.showMenuBlade, this.addController, this.removeControllerAndMenuBlade, start);
        this.addAnimatable(blade1);
        var blade2 = new MenuBlade(new KeyboardControls("wasd", 87, 65, 83, 68, 81), this.showMenuBlade, this.addController, this.removeControllerAndMenuBlade, start);
        this.addAnimatable(blade2);
        var blade3 = new MenuBlade(new KeyboardControls("tfgh", 84, 70, 71, 72, 82), this.showMenuBlade, this.addController, this.removeControllerAndMenuBlade, start);
        this.addAnimatable(blade3);
        var blade4 = new MenuBlade(new KeyboardControls("ijkl", 73, 74, 75, 76, 85), this.showMenuBlade, this.addController, this.removeControllerAndMenuBlade, start);
        this.addAnimatable(blade4);

        window.addEventListener("gamepadconnected", this.connecthandler);
        window.addEventListener("gamepaddisconnected", this.disconnecthandler);

        console.log("haveEvents: " + haveEvents);

        if (!haveEvents) {
            this.gamepadScanner = setInterval(this.scangamepads, 500);
        }
    }

    public unload() {
        clearInterval(this.gamepadScanner);
    }

    private showMenuBlade = (menuBlade: MenuBlade) => {
        console.log(menuBlade.controllerName);

        if (this.menuBlades.length <= 4) {
            this.menuBlades.push(menuBlade);
            menuBlade.location = this.menuBlades.length;
        } else {
            console.log("Sorry, only 4 controllers supported");
        }
    }

    private addController = (menuBlade: MenuBlade) => {
        this.controllers.push(menuBlade.controller)
        console.log("added controller " + menuBlade.controllerName);
    }

    private removeControllerAndMenuBlade = (menuBlade: MenuBlade) => {
        this.menuBlades.splice(this.menuBlades.indexOf(menuBlade), 1);
        this.controllers.splice(this.controllers.indexOf(menuBlade.controller), 1);

        console.log("removed controller " + menuBlade.controllerName);
        for (let i = 0; i < this.menuBlades.length; i++) {
            const menuBlade = this.menuBlades[i];
            menuBlade.location = i + 1;
        }
    }

    connecthandler = (e: GamepadEvent) => {
        console.log("gamepad connected: " + e.gamepad.index + "/" + e.gamepad.id);
        this.addgamepad(e.gamepad);
    }

    scangamepads = () => {
        console.log("scangamepads");

        var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                console.log("scanned gamepad: " + gamepads[i].index + "/" + gamepads[i].id);
                if (gamepads[i].index in this.gamepads) {
                    this.gamepads[gamepads[i].index] = gamepads[i];
                } else {
                    this.addgamepad(gamepads[i]);
                }
            }
        }
    }

    disconnecthandler = (e: GamepadEvent) => {
        console.log("gamepad disconnected: " + e.gamepad.index + "/" + e.gamepad.id);
        this.removegamepad(e.gamepad);
    }

    removegamepad = (gamepad: Gamepad) => {
        console.log("removing gamepad: " + gamepad.index + "/" + gamepad.id);
        delete this.gamepads[gamepad.index];
        for (let i = 0; i < this.menuBlades.length; i++) {
            const menuBlade = this.menuBlades[i];
            if (menuBlade.controllerName == gamepad.index.toString()) {
                this.menuBlades.splice(i, 1);
                break;
            }
        }
    }

    addgamepad = (gamepad: Gamepad) => {
        console.log("adding gamepad: " + gamepad.index + "/" + gamepad.id);

        this.gamepads[gamepad.index] = gamepad;
        // var blade = new MenuBlade(new GamepadControls(gamepad.index.toString(), gamepad.index), this.showMenuBlade, this.addController, this.removeControllerAndMenuBlade, this.start);
        // this.addAnimatable(blade);
    }
}