import SquareGridLevel from "./classes/SquareGridLevel";
import Line from "./classes/Line";
import HexTilePos from "./classes/HexTilePos";
import SquareTile from "./classes/SquareTile";
import Biome from "./classes/Biome";

/**
 * The game state
 */
class State {
	/**
     * Length of one of the sides of the hexagon
     */
    hexagonalGridSize: number;
    currentLevel: SquareGridLevel | null = null;
    biome: Biome | null = null;
    line: Line = new Line();
    currentTile: SquareTile | null = null;
    pathPos: HexTilePos[] = [];
    debugMode: boolean = false;
    tickTimeMs: number = 1000;
    currentTimeout: number = 0;
    isGamePlaying: boolean = false;
    
    constructor() {
        this.hexagonalGridSize = 3;
    }
    
    execTick() {
        if(state.currentLevel){
            state.currentLevel?.player.goToDestination();
            // state.currentLevel.tileIdMap.forEach(t => {
            //     let toUpdate = false;
            //     if (t.stats.hasTickAction) {
            //         t.stats.tickExec();
            //         toUpdate = true;
            //     }
            //     if (toUpdate || t.needsUpdate)
            //         t.updateTile();
            // })
            state.currentLevel.showPlayerStats();
            state.currentLevel.npcs.forEach((n) => {
                if(state.currentLevel!.player.currentPosition.isEqual(n.currentPosition)){
                    console.log(`fight!!! ${state.currentLevel!.player.name} VS ${n.props?.name}`);
                }
            })
            if(state.currentLevel.player.currentPath.length == 0)
                this.stopGame();
        }
    }

    handleKeypress(k: KeyboardEvent) {
        console.log("TOUChe", k);
        switch(k.key){
            case "ArrowDown": this.currentLevel!.movePlayer('down'); break;
            case "ArrowUp": this.currentLevel!.movePlayer('up'); break;
            case "ArrowLeft": this.currentLevel!.movePlayer('left'); break;
            case "ArrowRight": this.currentLevel!.movePlayer('right'); break;
        }
        this.currentLevel!.redraw();
    }

    playGame() {
        this.isGamePlaying = true;
        this.execTick();
        if(this.isGamePlaying)
            this.setTimer();
    };

    stopGame() {
        this.isGamePlaying = false;
        window.clearInterval(this.currentTimeout);
    }

    setTimer() {
        this.currentTimeout = window.setTimeout(() => {this.playGame()}, this.tickTimeMs);
    };
}

const state = new State();

export default state;