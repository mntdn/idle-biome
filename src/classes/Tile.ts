import { ETileType } from '../enums/ETileType';
import utils from '../shared/utils';
import TileStats from './TileStats';
import state from '../state';
import TilePos from './TilePos';
import { Point } from '../interfaces/Point';

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
    isTraversable: boolean;
    id: string;
    stats: TileStats;
    cost: number; // cost of traversing for path finding
    needsUpdate: boolean;

    // absolute X,Y position of the top left corner of the div containing the hex
    positionX: number;
    positionY: number;

    pfResult: number;

    onHover: () => void;
    onClick: () => void;

    constructor(line: number, col: number, tileType: ETileType) {
        this.tileType = tileType;
        this.line = line;
        this.col = col;
        let r = line - (col - (col & 1)) / 2;
        this.position = new TilePos(col, r, -1 * col - r);
        this.id = utils.guid();
        this.color = this.getColorByType(false);
        this.colorHover = this.getColorByType(true);
        this.colorBorder = 'grey';
        this.borderSize = 4;
        this.isHidden =
            Math.abs(this.position.s) > state.hexagonalGridSize - 1 ||
            Math.abs(this.position.q) > state.hexagonalGridSize - 1 ||
            Math.abs(this.position.r) > state.hexagonalGridSize - 1;
        this.stats = new TileStats();
        this.cost = 1;
        this.isTraversable = !this.isHidden;
        this.onHover = () => { };
        this.onClick = () => { };
        this.needsUpdate = false;
        this.pfResult = 0;
        this.positionX = 0;
        this.positionY = 0;
        // if (!this.isHidden) {
        //     // we only store the position of the hex if it is shown
        //     state.tilePosMap.set(
        //         `${this.position.q}${this.position.r}${this.position.s}`,
        //         this.id,
        //     );
        //     state.tileIdMap.set(this.id, this);
        // }
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

    private getContent() {
        let result = '';
        if (!this.isHidden) {
            if (this.position.isEqual(state.currentLevel?.player.currentPosition))
                result = '@';
            result += '<br />' + utils.round(this.pfResult);
        }
        return result;
    }

    private getStyle() {
        return `--hex-fill-color:${this.color};--hex-fill-color-hover:${this.colorHover};--hex-border-color: ${this.colorBorder};--hex-border:${this.borderSize}px`;
    }

    getHtml() {
        let hex: HTMLElement = <HTMLDivElement>document.createElement('div');
        hex.id = this.id;
        hex.classList = `hexagon ${this.position.q % 2 !== 0 ? 'low' : ''} ${this.isHidden ? 'hidden' : ''}`;
        hex.style = this.getStyle();
        hex.onmouseover = () => {
            this.onHover();
            // this.applyToNeighbors((t: Tile) => {
            // 	t.stats.addWaterPerTick(0.1);
            // });
        };
        hex.onclick = (e: any) => {
            this.onClick();
            state.currentTile = this;
            // this.tileType = ETileType.dirt;
            // // showNeighbors(t);
            // this.stats.addWaterPerTick(2);
            // this.colorBorder = 'darkred';
            // // this.borderSize *= 2;
            // hex.style = this.getStyle();
            // // state.player.moveTo(this.position);
            // // state.line.addPoint(this.getPixelCoords());
            // // state.line.drawLine();
            // this.needsUpdate = true;
            this.clickMenu(e);
            // this.updateTile();
        };
        let innerHex: HTMLElement = <HTMLDivElement>(
            document.createElement('div')
        );
        innerHex.id = this.id + 'IN';
        innerHex.classList = 'hexagon-inner';
        innerHex.innerHTML = this.getContent();
        hex.appendChild(innerHex);
        return hex;
    }

    updateTile() {
        this.color = this.getColorByType(false);
        this.colorHover = this.getColorByType(true);
        var hex = document.getElementById(this.id);
        if (hex) {
            hex.style = this.getStyle();
            // console.log(hex.style);
        }
        var hexHtml = document.getElementById(this.id + 'IN');
        if (hexHtml) {
            hexHtml.innerHTML = this.getContent();
        }
        this.needsUpdate = false;
    }


    // returns the x,y coords of the middle
    getPixelCoords(): Point {
        let result: Point = {
            x: 0,
            y: 0,
        };
        var hex = document.getElementById(this.id);
        if (hex) {
            const r = hex.getBoundingClientRect();
            result.x = r.x + (r.width / 2);
            result.y = r.y + (r.height / 2);
            console.log(result.x, result.y);
            var root = document.getElementById('app');
            if (root) {
                let d: HTMLElement = <HTMLDivElement>(
                    document.createElement('div')
                );
                d.style = `position: absolute; left: ${result.x}px; top: ${result.y}px; width: 1px; height: 1px; background-color: lightgreen;z-index:50`;
                root.appendChild(d);
            }
        }
        return result;
    }

    setPosition() {
        var hex = document.getElementById(this.id);
        if(hex){
            const r = hex.getBoundingClientRect();
            this.positionX = r.x;
            this.positionY = r.y;
        }
    }

    clickMenu(e: MouseEvent) {
        let menu: HTMLElement = <HTMLDivElement>document.createElement('div');
        var root = utils.getBySelector('#app');
        const buttonStyle = 'width: 100%; height: 28px';
        menu.style = `position: absolute; left: ${e.clientX}px; top: ${e.clientY}px; width: 200px; height: ${28 * 4}px; background-color: beige;z-index:500`;
        menu.appendChild(utils.createButton('Wall', buttonStyle, () => {
            this.isTraversable = false;
            this.isHidden = true;
            this.needsUpdate = true;
            state.currentLevel!.redraw();
            menu.remove();
        }))
        menu.appendChild(utils.createButton('Move player', buttonStyle, () => {
            state.currentLevel!.movePlayer(this.position);
            menu.remove();
        }))
        menu.appendChild(utils.createButton('Player go to', buttonStyle, () => {
            state.currentLevel!.findPath(this.position);
            menu.remove();
        }))
        menu.appendChild(utils.createButton('X', buttonStyle, () => {
            menu.remove();
        }))
        root.appendChild(menu);
    }
}
