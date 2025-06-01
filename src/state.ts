import Line from "./classes/Line";
import Player from "./classes/Player";
import Tile from "./classes/Tile";
import { Point } from "./interfaces/Point";

// The game state
class State {
	// length of one of the sides of the hexagon
    hexagonalGridSize: number;

    // Map of tile q r s coords (as ${q}${r}${s}) and its id
    // used to quickly update a tile props depending on its coordinates
    tilePosMap: Map<string, string> = new Map();

    // Map of tile id to its Tile content for quick access
    tileIdMap: Map<string, Tile> = new Map();

    player: Player = new Player();

    line: Line = new Line();
    currentTile: Tile | null = null;
    
    constructor() {
        this.hexagonalGridSize = 5;
    }
}

const state = new State();

export default state;