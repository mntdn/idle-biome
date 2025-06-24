import Level from "./classes/Level";
import Line from "./classes/Line";
import Tile from "./classes/Tile";
import TilePos from "./classes/TilePos";

// The game state
class State {
	// length of one of the sides of the hexagon
    hexagonalGridSize: number;
    currentLevel: Level | null = null;
    line: Line = new Line();
    currentTile: Tile | null = null;
    pathPos: TilePos[] = [];
    debugMode: boolean = false;
    tickTimeMs: number = 1000;
    currentTimeout: number = 0;
    isGamePlaying: boolean = false;
    
    constructor() {
        this.hexagonalGridSize = 5;
    }
    
    execTick() {
        if(state.currentLevel){
            state.currentLevel?.player.goToDestination();
            state.currentLevel.tileIdMap.forEach(t => {
                let toUpdate = false;
                if (t.stats.hasTickAction) {
                    t.stats.tickExec();
                    toUpdate = true;
                }
                if (toUpdate || t.needsUpdate)
                    t.updateTile();
            })
            state.currentLevel.updatePathDrawings();
            console.log("l", state.currentLevel.player.currentPath.length)
            if(state.currentLevel.player.currentPath.length == 0)
                this.stopGame();
        }
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