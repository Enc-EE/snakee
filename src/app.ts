import { Animation } from "./enc/animation";
import { MenuView } from "./blade/menuView";
import { GameView } from "./blade/gameView";
import { MainMenuView } from "./mainMenuView";


export class App {
    animation: Animation;
    menu: MenuView;
    game: GameView;

    public run() {
        this.animation = Animation.createInBody();
        var mainMenu = new MainMenuView();
        this.animation.addView(mainMenu);
        // this.menu = new MenuView(this.start);
        // this.game = new GameView();
        // this.animation.addView(this.menu);
        // this.animation.addView(this.game);
        // this.game.hide();
    }

    // private start = () => {
    //     this.menu.hide();
    //     this.menu.unload();
    //     this.game.show();
    //     this.game.start(this.menu.controllers);
    // }
}