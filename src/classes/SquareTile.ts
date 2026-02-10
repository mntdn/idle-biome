import { ETileType } from '../enums/ETileType';
import utils from '../shared/utils';
import TileStats from './TileStats';
import state from '../state';
import { Point } from '../interfaces/Point';
import Popup from './Popup';
import SquareTilePos from './SquareTilePos';
import { TileDistance } from '../interfaces/TileDistance';

export default class SquareTile {
    tileType: ETileType;
    col: number;
    line: number;
    position: SquareTilePos;
    color: string;
    colorHover: string;
    colorBorder: string;
    borderSize: number;
    /**
     * Indicated whether the tile has been seen by the player or not
     */
    hasSeen: boolean;
    /**
     * Indicates if the tile can be seen by the player right now
     */
    canSee: boolean;
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
        this.hasSeen = false;
        this.canSee = false;
        this.stats = new TileStats();
        this.cost = 1;
        this.isTraversable = true;
        this.onHover = () => { };
        this.onClick = () => { };
        this.needsUpdate = false;
        this.pfResult = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.otherPopup = null;
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
            case ETileType.wall:
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
        if (this.position.isEqual(state.currentLevel?.player.currentPosition))
            result = '@';
        if(state.debugMode)
            result += `<br /><span class="sm">${this.position.toString()}</span>`
        return result;
    }

    private getOtherContent() {
        let result = '';
        state.currentLevel!.npcs.forEach((n) => {
            if (this.position.isEqual(n.currentPosition)){
                result = '+';
            }
        });
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
        let bgClasses = ['background'];
        if(state.currentLevel?.player.canSeeTile(this)) {
            this.hasSeen = true;
            bgClasses.push('see');
        } else if (!this.hasSeen){
            bgClasses.push('hidden');
        }
        if(this.hasSeen)
            bgClasses.push('seen');
        bgLayer.classList =  bgClasses.join(' ');
        square.appendChild(bgLayer);
        let charLayer: HTMLElement = <HTMLDivElement>document.createElement('div');
        charLayer.classList = 'character';
        charLayer.innerHTML = this.getPlayerContent() + this.getOtherContent();
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
        console.log("click", e)
    }

    /**
     * Gets the TileDistance between this tile and the indicated TilePos
     * @param t The position of the Tile that we want to measure the distance to
     */
    getDistanceFromTile(t: SquareTilePos): TileDistance {
        let result: TileDistance = {
            diagonalDistance: 0,
            distance: 0,
            isBlocked: false
        };
        let dCol = this.position.col - t.col, dLine = this.position.line - t.line;
        result.distance = Math.sqrt(Math.pow(dCol, 2) + Math.pow(dLine, 2));
        result.diagonalDistance = Math.max(Math.abs(dCol), Math.abs(dLine));

        // draws a line to the point to determine if an obstacle is in the way
        let points = [];
        for (let step = 0; step <= result.diagonalDistance; step++) {
            let p = result.diagonalDistance === 0? 0.0 : step / result.diagonalDistance;
            let curTile = state.currentLevel?.getTileFromPos(this.position.lerpPoint(t, p));
            if(curTile && !curTile.isTraversable){
                result.isBlocked = true
                break;
            }
            points.push(curTile);
        }
        return result;
    }
}
