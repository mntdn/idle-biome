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
    
    constructor() {
        this.hexagonalGridSize = 5;
    }
}

const state = new State();

export default state;