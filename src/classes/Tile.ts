import { ETileType } from "../enums/ETileType";
import utils from "../shared/utils";
import TileStats from "./TileStats";
import state from '../state'

export default class Tile {
    tileType: ETileType
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

    constructor(line: number, col: number, tileType: ETileType){
        this.tileType = tileType;
        this.line = line;
        this.col = col;
        this.r = line - (col - (col & 1)) / 2;
        this.q = col;
        this.s = -1 * this.q - this.r;
        this.id = utils.guid();
        this.color = this.getColorByType(false);
        this.colorHover = this.getColorByType(true);
        this.isHidden =
            Math.abs(this.s) > state.hexagonalGridSize - 1 ||
            Math.abs(this.q) > state.hexagonalGridSize - 1 ||
            Math.abs(this.r) > state.hexagonalGridSize - 1;
        this.stats = new TileStats()
    }

    getColorByType(isHover: boolean) {
        let result = '';
        let alpha = isHover ? '0.7' : '1';
        switch (this.tileType) {
            case ETileType.water: 
                result = `rgba(0,128,255,${alpha})`;
                break;
            case ETileType.dirt: 
                result = `rgba(155,118,83,${alpha})`;
                break;
            case ETileType.sand: 
                result = `rgba(236,213,64,${alpha})`;
                break;
            case ETileType.stone: 
                result = `rgba(132,132,130,${alpha})`;
                break;
            default:
                break;
        }
        return result;
    }
}