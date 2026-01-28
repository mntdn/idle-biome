import { ETileType } from '../enums/ETileType';
import utils from '../shared/utils';
import TileStats from './TileStats';
import state from '../state';
import { Point } from '../interfaces/Point';
import Popup from './Popup';
import SquareTilePos from './SquareTilePos';

export default class SquareTile {
    tileType: ETileType;
    col: number;
    line: number;
    position: SquareTilePos;
    color: string;
    colorHover: string;
    colorBorder: string;
    borderSize: number;
    isHidden: boolean;
    isTraversable: boolean;
    id: string;
    stats: TileStats;
    /**
     * cost of traversing for path finding
     */
    cost: number;
    otherPopup: Popup | null;
    needsUpdate: boolean;

    /**
     * absolute X position of the top left corner of the div containing the hex
     */
    positionX: number;
    /**
     * absolute Y position of the top left corner of the div containing the hex
     */
    positionY: number;

    pfResult: number;

    onHover: () => void;
    onClick: () => void;

    constructor(col: number, line: number, tileType: ETileType) {
        this.tileType = tileType;
        this.line = line;
        this.col = col;
        this.position = new SquareTilePos(col, line);
        this.id = '_' + utils.guid();
        this.color = this.getColorByType(false);
        this.colorHover = this.getColorByType(true);
        this.colorBorder = 'grey';
        this.borderSize = 4;
        this.isHidden = false;
        this.stats = new TileStats();
        this.cost = 1;
        this.isTraversable = !this.isHidden;
        this.onHover = () => { };
        this.onClick = () => { };
        this.needsUpdate = false;
        this.pfResult = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.otherPopup = null;
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

    /**
     * 
     * @returns The player HTML portion of the tile
     */
    private getPlayerContent() {
        let result = '';
        if (!this.isHidden && this.position.isEqual(state.currentLevel?.player.currentPosition))
            result = '@';
        if(state.debugMode)
            result += `<br /><span class="sm">${this.position.toString()}</span>`
        return result;
    }

    private getOtherContent() {
        let result = '';
        if (!this.isHidden) {
            state.currentLevel!.npcs.forEach((n) => {
                if (this.position.isEqual(n.currentPosition)){
                    result = '+';
                }
            });
        }
        return result;
    }

    getStyle() {
        return `--square-background-color:${this.color};`;
    }

    getHtml() {
        let square: HTMLElement = <HTMLDivElement>document.createElement('div');
        // square.id = this.id;
        square.classList = `square-inside`;
        square.style = this.getStyle();
        square.onmouseover = () => {
            // console.log("over all hex", hex.id);
            this.onHover();
            // this.applyToNeighbors((t: Tile) => {
            // 	t.stats.addWaterPerTick(0.1);
            // });
        };
        square.onclick = (e: any) => {
            this.onClick();
            state.currentTile = this;
            this.clickMenu(e);
        };
        let bgLayer: HTMLElement = <HTMLDivElement>document.createElement('div');
        bgLayer.classList = 'background';
        square.appendChild(bgLayer);
        let charLayer: HTMLElement = <HTMLDivElement>document.createElement('div');
        charLayer.classList = 'character';
        charLayer.innerHTML = this.getPlayerContent();
        square.appendChild(charLayer);
        return square;
    }

    // updateTile() {
    //     this.color = this.getColorByType(false);
    //     this.colorHover = this.getColorByType(true);
    //     var square = document.querySelector(`[data-squareid='${this.id}'] .square-inside`) as HTMLElement;
    //     if (square) {
    //         square.style = this.getStyle();
    //         // console.log(hex.style);
    //         var charLayer = square.getElementsByClassName('character');
    //         charLayer[0].innerHTML = this.getPlayerContent();
    //     }
    //     this.needsUpdate = false;
    // }

    /**
     * Returns the HTML to put inside the popup with all the things happening on this tile
     */
    getPopupContent():string{
        let result = '';

        // adding the local NPCS
        state.currentLevel!.npcs.forEach((n) => {
            if (this.position.isEqual(n.currentPosition)){
                result += n.htmlDescription();
            }
        });

        return result;
    }

    /**
     * Returns the current tile details and content in a nice HTML format
     * @returns HTML to describe the tile and its contents
     */
    getHtmlDescription(): string {
        return `<div>${ETileType[this.tileType]}</div>
        `;
    }

    /**
     * 
     * @param drawPixel If true draws a pixel
     * @returns The x,y coords of the middle
     */
    getPixelCoords(drawPixel: boolean): Point {
        let result: Point = {
            x: 0,
            y: 0,
        };
        var hex = document.getElementById(this.id);
        if (hex) {
            const r = hex.getBoundingClientRect();
            result.x = r.x + (r.width / 2);
            result.y = r.y + (r.height / 2);
            if(drawPixel){
                var root = document.getElementById('app');
                if (root) {
                    let d: HTMLElement = <HTMLDivElement>(
                        document.createElement('div')
                    );
                    d.style = `position: absolute; left: ${result.x}px; top: ${result.y}px; width: 1px; height: 1px; background-color: lightgreen;z-index:50`;
                    root.appendChild(d);
                }
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
        // let menu: HTMLElement = <HTMLDivElement>document.createElement('div');
        // var root = utils.getBySelector('#app');
        // const buttonStyle = 'width: 100%; height: 28px';
        // menu.style = `position: absolute; left: ${e.clientX}px; top: ${e.clientY}px; width: 200px; height: ${28 * 4}px; background-color: beige;z-index:500`;
        // menu.appendChild(utils.createButton('Wall', buttonStyle, () => {
        //     this.isTraversable = false;
        //     this.isHidden = true;
        //     this.tileType = ETileType.sand;
        //     this.needsUpdate = true;
        //     state.currentLevel!.redraw();
        //     menu.remove();
        // }))
        // menu.appendChild(utils.createButton('Move player', buttonStyle, () => {
        //     state.currentLevel!.movePlayer(this.position);
        //     menu.remove();
        // }))
        // menu.appendChild(utils.createButton('Player go to', buttonStyle, () => {
        //     state.currentLevel!.player.currentPath = state.currentLevel!.findPath(this.position);
        //     menu.remove();
        // }))
        // // menu.appendChild(utils.createButton('GO !!!', buttonStyle, () => {
        // //     state.playGame();
        // //     menu.remove();
        // // }))
        // menu.appendChild(utils.createButton('X', buttonStyle, () => {
        //     menu.remove();
        // }))
        // root.appendChild(menu);
        console.log("click")
    }
}
