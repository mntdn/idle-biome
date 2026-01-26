import { direction } from "../enums/customTypes";
import { ETileType } from "../enums/ETileType";
import utils from "../shared/utils";
import Character from "./Character";
import Player from "./Player";
import SquareTile from "./SquareTile"

export default class SquareGridLevel {    
    player: Player = new Player();
    npcs: Character[] = [];
    nbLines: number = 5;
    nbCol: number = 15;
    /**
     * Map of tile col line coords (as short version) and its id
     * used to quickly update a tile props depending on its coordinates
     */
    tilePosMap: Map<string, string> = new Map();
    tileIdMap: Map<string, SquareTile> = new Map();

    constructor() {}

    init() {
        let d = utils.getBySelector('#app .left-box');
        let divContainer: HTMLElement = <HTMLDivElement>document.createElement('div');
        divContainer.classList = 'tiles-container';

        for (let i = 0; i < this.nbLines; i++) {
            let l: HTMLElement = <HTMLDivElement>document.createElement('div');
            l.classList = 'square-line';
            for(let j = 0; j < this.nbCol; j++) {
                let s = new SquareTile(i,j,ETileType.water);
                s.needsUpdate = true;
                l.appendChild(s.getHtml());
                this.tileIdMap.set(s.id, s);
                this.tilePosMap.set(s.position.toShortString(), s.id);
            }
            divContainer.appendChild(l);
        }
        d.appendChild(divContainer);
        // for(var i = 0; i < 3; i++){
        //     let randPos = Array.from(this.tileIdMap)[Math.floor(Math.random() * this.tileIdMap.size)];
        //     this.npcs.push(new NPC({startingPosition: randPos[1].position, maxHP: 10}));
        //     randPos[1].needsUpdate = true;
        // }
    }

    movePlayer(dir: direction) {
        this.tileIdMap.get(this.tilePosMap.get(this.player.currentPosition.toShortString())!)!.needsUpdate = true;
        switch(dir) {
            case 'up': this.player.currentPosition.line--; break;
            case 'right': this.player.currentPosition.col++; break;
            case 'down': this.player.currentPosition.line++; break;
            case 'left': this.player.currentPosition.col--; break;
        }
        this.tileIdMap.get(this.tilePosMap.get(this.player.currentPosition.toShortString())!)!.needsUpdate = true;
    }

    redraw() {
        this.tileIdMap.forEach((v) => {
            if(v.needsUpdate){
                v.updateTile();
            }
        })
    }

    /**
     * Shows the current player stats in the div with the player-stats class
     */
    showPlayerStats() {
        let d = utils.getBySelector('#app .right-box .player-stats');
        d.innerHTML = this.player.htmlDescription();
    }
}