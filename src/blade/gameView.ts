import { Controller } from "../enc/controller";
import { View } from "../enc/view";
import { Blade } from "./blade";
import { Collider } from "./collider";

export class GameView extends View {

    private started = false;

    private blades: Blade[] = [];
    public start(controllers: Controller[]) {
        if (this.started) {
            return;
        }
        this.started = true;

        this.addAnimation((ctx, width, height) => {
            ctx.fillStyle = "rgb(191, 191, 191)";
            ctx.textAlign = "center";
            ctx.font = "62px sans-serif";
            ctx.fillText("Don't hit the border ;)", width / 2, height / 2 - 20);
        });

        console.log(controllers);
        this.scorePosition = controllers.length;

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i];
            var blade = new Blade(controller);
            let startX = 0;
            let startY = 0;
            switch (i + 1) {
                case 1:
                    startX = this.width / 3;
                    startY = this.height / 3;
                    break;
                case 2:
                    startX = this.width / 3 * 2;
                    startY = this.height / 3;
                    break;
                case 3:
                    startX = this.width / 3;
                    startY = this.height / 3 * 2;
                    break;
                case 4:
                    startX = this.width / 3 * 2;
                    startY = this.height / 3 * 2;
                    break;
            }
            blade.bladeNumber = i + 1;
            blade.x = startX;
            blade.y = startY;
            blade.iMDone = this.bladeIsDone;
            this.blades.push(blade);
            this.addAnimatable(blade);
        }
        this.addAnimatable(new Collider(this.blades, this.width, this.height));
    }

    private scorePosition: number;

    private bladeIsDone = (blade: Blade) => {
        console.log("blade is done, score: " + this.scorePosition);

        blade.scorePosition = this.scorePosition;
        this.scorePosition--;
    }
}