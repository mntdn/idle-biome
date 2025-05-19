import { ETileType } from '../enums/ETileType';
import utils from '../shared/utils';
import TileStats from './TileStats';
import state from '../state';
import TileShift from '../interfaces/TileShift';

export default class Tile {
    tileType: ETileType;
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

    onHover: () => void;

    constructor(line: number, col: number, tileType: ETileType) {
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
        this.stats = new TileStats();
        this.onHover = () => { };
        if (!this.isHidden) {
            // we only store the position of the hex if it is shown
            state.tilePosMap.set(`${this.q}${this.r}${this.s}`, this.id);
            state.tileIdMap.set(this.id, this);
        }
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

    private getContent (){
        return `<div class="contents">${this.isHidden ? '' : utils.round(this.stats.water)}</div>`
    }

    getHtml() {
        let hex: HTMLElement = <HTMLDivElement>document.createElement('div');
        hex.id = this.id;
        hex.classList = `hexagon ${this.q % 2 !== 0 ? 'low' : ''} ${this.isHidden ? 'hidden' : ''}`;
        hex.style = `--hex-fill-color:${this.color};--hex-fill-color-hover:${this.colorHover};`;
        hex.onmouseover = () => {
            this.onHover();
        };
        hex.onclick = () => {
            this.stats.addWaterPerTick(2);
            this.applyToNeighbors((t: Tile) => { t.stats.addWaterPerTick(0.1) })
        };
        hex.innerHTML = this.getContent();
        return hex;
    }

    updateContent() {
        var hexHtml = document.getElementById(this.id);
        if(hexHtml)
            hexHtml.innerHTML = this.getContent();

    }

    private getHexIdFromDepl(shift: TileShift) {
        let tileCoord = `${this.q + shift.qShift}${this.r + shift.rShift}${this.s + shift.sShift}`;
        if (state.tilePosMap.has(tileCoord)) {
            let t = state.tilePosMap.get(tileCoord);
            if (t)
                return t;
        }
        return null;
    };

    // Apply the function f that takes a Tile as parameter to all the neighbors of a tile
    applyToNeighbors(f: (t: Tile) => any) {
        let allDepl: TileShift[] = [
            { qShift: 1, rShift: 0, sShift: -1 }, { qShift: 1, rShift: -1, sShift: 0 }, { qShift: 0, rShift: -1, sShift: +1 },
            { qShift: -1, rShift: 0, sShift: 1 }, { qShift: -1, rShift: +1, sShift: 0 }, { qShift: 0, rShift: 1, sShift: -1 },
        ];
        allDepl.forEach(d => {
            let h = this.getHexIdFromDepl(d);
            if (h) {
                let tile = state.tileIdMap.get(h);
                if (tile)
                    f(tile);
                // var hexHtml = document.getElementById(h);
                // if (hexHtml) {
                //     hexHtml.style = `--hex-fill-color:#ccc;--hex-fill-color-hover:#ddd;`
                // }
            }
        })
    }
}
