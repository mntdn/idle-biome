import utils from "../shared/utils";
import TileStats from "./TileStats";

export default class Tile {
    col: number;
    line: number;
    q: number;
    r: number;
    s: number;
    color: string;
    colorHover: string;
    isHidden: boolean;
    id: string;
    stats: TileStats;

    constructor(line: number, col: number, hexagonalGridSize: number, color: string, colorHover: string){
        this.line = line;
        this.col = col;
        this.r = line - (col - (col & 1)) / 2;
        this.q = col;
        this.s = -1 * this.q - this.r;
        this.id = utils.guid();
        this.color = color;
        this.colorHover = colorHover;
        this.isHidden =
            Math.abs(this.s) > hexagonalGridSize - 1 ||
            Math.abs(this.q) > hexagonalGridSize - 1 ||
            Math.abs(this.r) > hexagonalGridSize - 1;
        this.stats = new TileStats()
    }
}