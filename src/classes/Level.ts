import { ETileType } from "../enums/ETileType";
import { PriorityQueue } from "../interfaces/PriorityQueue";
import TileShift from "../interfaces/TileShift";
import utils from "../shared/utils";
import state from "../state";
import Line from "./Line";
import Player from "./Player";
import Tile from "./Tile";
import TilePos from "./TilePos";

export default class Level {
    // Map of tile q r s coords (as ${q}${r}${s}) and its id
    // used to quickly update a tile props depending on its coordinates
    tilePosMap: Map<string, string> = new Map();

    // Map of tile id to its Tile content for quick access
    tileIdMap: Map<string, Tile> = new Map();
    player: Player = new Player();

    constructor() {
        let d = utils.getBySelector('#app .left-box');
        let divContainer: HTMLElement = <HTMLDivElement>document.createElement('div');
        divContainer.classList = 'tiles-container';

        var nbHexPerLine = 2 * state.hexagonalGridSize - 1;
        var nbLines = nbHexPerLine;

        for (let i = 0; i < nbLines; i++) {
            let c: HTMLElement = <HTMLDivElement>document.createElement('div');
            c.classList = 'hex-line';
            let line = i - state.hexagonalGridSize + 1;
            for (let j = 0; j < nbHexPerLine; j++) {
                let col = j - state.hexagonalGridSize + 1;
                let t = new Tile(line, col, ETileType.water);
                if (!t.isHidden) {
                    // we only store the position of the hex if it is shown
                    this.tilePosMap.set(
                        `${t.position.q}${t.position.r}${t.position.s}`,
                        t.id,
                    );
                    this.tileIdMap.set(t.id, t);
                }

                t.onHover = () => this.showTileDetails(t)
                t.onClick = () => {
                    // pathPos.push(t.position);
                    // if(pathPos.length == 2){
                    // 	findPath(pathPos[0], pathPos[1]);
                    // 	pathPos = [];
                    // }
                }
                c.appendChild(t.getHtml());
                window.setTimeout(() => { t.setPosition(); }, 10);
            }
            if (divContainer) divContainer.appendChild(c);
        }
        d.appendChild(divContainer);
    }

    showTileDetails(t: Tile) {
        let d = utils.getBySelector('#app .right-box');
        d.innerHTML = '';
        let div: HTMLElement = <HTMLPreElement>document.createElement('pre');
        div.style = '';
        div.textContent = JSON.stringify(t, null, 2);
        d.appendChild(div);
    }

    private getTileByPos(pos: TilePos): Tile | null {
        let result: Tile | null = null;
        const posStr = `${pos.q}${pos.r}${pos.s}`;
        const id = this.tilePosMap.get(posStr);
        if (id !== undefined && this.tileIdMap.has(id)) {
            result = this.tileIdMap.get(id)!;
        }
        return result;
    }

    private getHexIdFromDepl(tile: Tile, shift: TileShift) {
        let tileCoord = `${tile.position.q + shift.qShift}${tile.position.r + shift.rShift}${tile.position.s + shift.sShift}`;
        if (this.tilePosMap.has(tileCoord)) {
            let t = this.tilePosMap.get(tileCoord);
            if (t) return t;
        }
        return null;
    }

    // returns a list of all the neighbors
    getNeighbors(tile: Tile, onlyTraversable: boolean) {
        let result: Tile[] = [];
        let allDepl: TileShift[] = [
            { qShift: 1, rShift: 0, sShift: -1 },
            { qShift: 1, rShift: -1, sShift: 0 },
            { qShift: 0, rShift: -1, sShift: +1 },
            { qShift: -1, rShift: 0, sShift: 1 },
            { qShift: -1, rShift: +1, sShift: 0 },
            { qShift: 0, rShift: 1, sShift: -1 },
        ];
        allDepl.forEach((d) => {
            let h = this.getHexIdFromDepl(tile, d);
            if (h) {
                let tile = this.tileIdMap.get(h);
                if (tile && (!onlyTraversable || (onlyTraversable && tile.isTraversable))) result.push(tile);
            }
        });
        return result;
    }

    distance(a: TilePos, b: TilePos): number {
        const vec: TilePos = new TilePos(a.q - b.q, a.r - b.r, a.s - b.s);
        return (Math.abs(vec.q) + Math.abs(vec.r) + Math.abs(vec.s)) / 2;
    }

    findPath(end: TilePos) {
        const start = this.player.currentPosition;
        const frontier: PriorityQueue[] = [];
        frontier.push({
            position: start,
            priority: 0
        })
        const cameFrom: Map<TilePos, TilePos | null> = new Map();
        const costSoFar: Map<TilePos, number> = new Map();
        cameFrom.set(start, null);
        costSoFar.set(start, 0);

        while (frontier.length > 0) {
            let current = frontier.shift();
            if (current!.position == end)
                break;

            let curPos = this.getTileByPos(current!.position)
            if (curPos) {
                let neighbors = this.getNeighbors(curPos, true);
                neighbors.forEach((next) => {
                    let newCost = costSoFar.get(curPos.position)! + curPos.cost;
                    if (!costSoFar.has(next.position) || newCost < costSoFar.get(next.position)!) {
                        costSoFar.set(next.position, newCost);
                        let prio = newCost + this.distance(end, next.position);
                        frontier.push({
                            position: next.position,
                            priority: prio
                        });
                        cameFrom.set(next.position, curPos.position)
                    }
                })
            } else {
                console.error("Problem with pathfinding at", current!.position);
                break;
            }
        }

        costSoFar.forEach((v, k) => {
            let t = this.getTileByPos(k);
            if (t) {
                t.pfResult = v;
                t.needsUpdate = true;
            }
        })

        let lastTile = end;
        let finished = false;
        while (!finished) {
            if (lastTile && cameFrom.get(lastTile)) {
                const l = new Line();
                let tFrom = this.getTileByPos(lastTile);
                let tTo = this.getTileByPos(cameFrom.get(lastTile)!);
                if (tFrom && tTo) {
                    l.addPoint(tTo.getPixelCoords());
                    l.addPoint(tFrom.getPixelCoords());
                    l.drawLine();
                }
                lastTile = cameFrom.get(lastTile)!;
                if (cameFrom.get(end) === start)
                    finished = true;
            } else {
                finished = true;
            }
        }
    }

    movePlayer(dest: TilePos) {
        this.getTileByPos(this.player.currentPosition)!.needsUpdate = true;
        this.player.moveTo(dest);
        this.getTileByPos(dest)!.needsUpdate = true;
        this.redraw();
    }

    redraw() {
        this.tileIdMap.forEach((v) => {
            if(v.needsUpdate){
                v.updateTile();
            }
        })
    }
}