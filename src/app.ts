import { Animation } from "./enc/animation";
import { MainMenuView } from "./mainMenuView";
import { GameView } from "./gameView";


export class App {
    animation: Animation;
    menu: MainMenuView;
    game: GameView;

    public run() {
        this.animation = Animation.createInBody();
        this.newGame();
    }
    
    private start = () => {
        console.log("start");
        
        this.game = new GameView(this.menu.controllers);
        this.menu.hide();
        this.menu.requestStart.removeEventListener(this.start);
        this.menu = null;
        
        this.animation.addView(this.game);
        this.game.requestNewGame.addEventListener(this.newGame);
        this.game.start();
    }
    
    private newGame = () => {
        console.log("new");
        this.menu = new MainMenuView();
        this.menu.requestStart.addEventListener(this.start);
        if (this.game) {
            this.game.requestNewGame.removeEventListener(this.newGame);
            this.game.hide();
            this.game = null;
        }
        
        this.animation.addView(this.menu);
        this.menu.show();
    }
}