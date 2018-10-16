import { Animation } from "./enc/animation";
import { MainMenuView } from "./mainMenuView";
import { GameView } from "./gameView";


export class App {
    animation: Animation;
    menu: MainMenuView;
    game: GameView;

    public run() {
        this.animation = Animation.createInBody();
        this.menu = new MainMenuView(this.start);
        this.animation.addView(this.menu);
        
        this.game = new GameView();
        this.animation.addView(this.game);
        this.game.hide();
    }

    private start = () => {
        this.menu.hide();
        this.game.show();
        this.game.start(this.menu.controllers);
    }
}