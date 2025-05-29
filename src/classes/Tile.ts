import { ETileType } from '../enums/ETileType';
import utils from '../shared/utils';
import TileStats from './TileStats';
import state from '../state';
import TileShift from '../interfaces/TileShift';
import TilePos from './TilePos';

export default class Tile {
    tileType: ETileType;
    col: number;
    line: number;
	position: TilePos;
    color: string;
    colorHover: string;
	colorBorder: string;
	borderSize: number;
    isHidden: boolean;
    id: string;
    stats: TileStats;
	needsUpdate: boolean;

    onHover: () => void;

    constructor(line: number, col: number, tileType: ETileType) {
        this.tileType = tileType;
        this.line = line;
        this.col = col;
		let r = line - (col - (col & 1)) / 2;
		this.position = new TilePos(col, r, -1 * col - r);
        this.id = utils.guid();
        this.color = this.getColorByType(false);
        this.colorHover = this.getColorByType(true);
        this.colorBorder = "grey";
		this.borderSize = 4;
        this.isHidden =
            Math.abs(this.position.s) > state.hexagonalGridSize - 1 ||
            Math.abs(this.position.q) > state.hexagonalGridSize - 1 ||
            Math.abs(this.position.r) > state.hexagonalGridSize - 1;
        this.stats = new TileStats();
        this.onHover = () => { };
		this.needsUpdate = false;
        if (!this.isHidden) {
            // we only store the position of the hex if it is shown
            state.tilePosMap.set(`${this.position.q}${this.position.r}${this.position.s}`, this.id);
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
		let result = '';
        if(!this.isHidden) {
			if(this.position.isEqual(state.player.currentPosition))
				result = '@';
		}
		return result;
    }

	private getStyle () {
		return `--hex-fill-color:${this.color};--hex-fill-color-hover:${this.colorHover};--hex-border-color: ${this.colorBorder};--hex-border:${this.borderSize}px`;
	}

	getHtml() {
		let hex: HTMLElement = <HTMLDivElement>document.createElement('div');
		hex.id = this.id;
		hex.classList = `hexagon ${this.position.q % 2 !== 0 ? 'low' : ''} ${this.isHidden ? 'hidden' : ''}`;
		hex.style = this.getStyle();
		hex.onmouseover = () => {
			this.onHover();
			this.applyToNeighbors((t: Tile) => { t.stats.addWaterPerTick(0.1) })
		};
		hex.onclick = () => {
			// showNeighbors(t);
			this.stats.addWaterPerTick(2);
			this.colorBorder = "darkred";
			// this.borderSize *= 2;
			hex.style = this.getStyle();
			state.player.moveTo(this.position);
			this.needsUpdate = true;
		};
		let innerHex: HTMLElement = <HTMLDivElement>document.createElement('div');
		innerHex.id = this.id + 'IN';
		innerHex.classList = "hexagon-inner";
		innerHex.innerHTML = this.getContent();
		hex.appendChild(innerHex);
		return hex;
	}

    updateContent() {
        var hexHtml = document.getElementById(this.id + 'IN');
        if(hexHtml)
            hexHtml.innerHTML = this.getContent();
		this.needsUpdate = false;
    }

    private getHexIdFromDepl(shift: TileShift) {
        let tileCoord = `${this.position.q + shift.qShift}${this.position.r + shift.rShift}${this.position.s + shift.sShift}`;
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
