// The game state
class State {
    // the nb of pixels between the hexes
    hexSpacing: number;
    // width in pixels of a hex
    hexWidth: number;
    // calculated height of a hex
    hexHeight: number;
	// length of one of the sides of the hexagon
    hexagonalGridSize: number;

    constructor() {
        this.hexSpacing = 2;
        this.hexWidth = 60;
        this.hexHeight = this.hexWidth * Math.sin((60 * Math.PI) / 180);
        this.hexagonalGridSize = 3;
    }
}

const state = new State();

export default state;