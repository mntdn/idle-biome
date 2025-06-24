import { ETileType } from "../enums/ETileType";
import { PriorityQueue } from "../interfaces/PriorityQueue";
import TileShift from "../interfaces/TileShift";
import Vector from "../interfaces/Vector";
import path from "../shared/path";
import utils from "../shared/utils";
import state from "../state";
import Character from "./Character";
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
    npcs: Character[] = [];

    constructor() {}

    init() {
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

                t.onHover = () => {
                    if(!state.isGamePlaying && !t.position.isEqual(this.player.currentPosition)) {
                        this.player.currentDestination = t.position;
                        this.player.currentPath = this.findPath(t.position);
                        this.updatePathDrawings();
                    }
                    this.showTileDetails(t);
                }
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

        for(var i = 0; i < 3; i++){
            let randPos = Array.from(this.tileIdMap)[Math.floor(Math.random() * this.tileIdMap.size)];
            this.npcs.push(new Character(randPos[1].position));
            randPos[1].needsUpdate = true;
        }
        this.redraw();
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

    getTileByShortString(pos: string): Tile | null {
        let result: Tile | null = null;
        const id = this.tilePosMap.get(pos);
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

    findPath(end: TilePos): Vector[] {
        const start = this.player.currentPosition;
        const frontier: PriorityQueue[] = [];
        frontier.push({
            position: start?.toShortString(),
            priority: 0
        })
        const cameFrom: Map<string, string | null> = new Map();
        const costSoFar: Map<string, number> = new Map();
        cameFrom.set(start?.toShortString(), null);
        costSoFar.set(start?.toShortString(), 0);
        while (frontier.length > 0) {
            let current = frontier.shift();
            if (current!.position == end?.toShortString())
                break;

            let curPos = this.getTileByShortString(current!.position);
            if (curPos) {
                let neighbors = this.getNeighbors(curPos, true);
                neighbors.forEach((next) => {
                    let newCost = costSoFar.get(curPos.position?.toShortString())! + curPos.cost;
                    if (!costSoFar.has(next.position?.toShortString()) || newCost < costSoFar.get(next.position?.toShortString())!) {
                        costSoFar.set(next.position?.toShortString(), newCost);
                        let prio = newCost + this.distance(end, next.position);
                        frontier.push({
                            position: next.position?.toShortString(),
                            priority: prio
                        });
                        cameFrom.set(next.position?.toShortString(), curPos.position?.toShortString())
                    }
                })
            } else {
                console.error("Problem with pathfinding at", current!.position);
                break;
            }
        }

        // costSoFar.forEach((v, k) => {
        //     let t = this.getTileByShortString(k);
        //     if (t) {
        //         t.pfResult = v;
        //         t.needsUpdate = true;
        //     }
        // })

        let result: Vector[] = [];

        let lastTile = end.toShortString();
        let finished = false;
        while (!finished) {
            if (lastTile && cameFrom.get(lastTile)) {
                result.unshift({
                    from: cameFrom.get(lastTile)!,
                    to: lastTile
                })
                lastTile = cameFrom.get(lastTile)!;
                if (cameFrom.get(end.toShortString()) === start.toShortString())
                    finished = true;
            } else {
                finished = true;
            }
        }
        return result;
    }

    movePlayer(dest: TilePos) {
        this.getTileByPos(this.player.currentPosition)!.needsUpdate = true;
        this.player.moveTo(dest);
        this.getTileByPos(dest)!.needsUpdate = true;
        this.redraw();
    }

    // updates all the drawn paths of all the moving things
    updatePathDrawings() {
        if(this.player.currentPathId.length > 0)
            path.removePath(this.player.currentPathId);
        this.player.currentPathId = path.drawPath(this.player.currentPath);
    }

    redraw() {
        this.tileIdMap.forEach((v) => {
            if(v.needsUpdate){
                v.updateTile();
            }
        })
    }
}