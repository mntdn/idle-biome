import { direction } from "../enums/customTypes";
import { ETileType } from "../enums/ETileType";
import utils from "../shared/utils";
import Character from "./Character";
import Player from "./Player";
import SquareTile from "./SquareTile"
import SquareTilePos from "./SquareTilePos";

export default class SquareGridLevel {    
    player: Player = new Player();
    playerStartPosition: SquareTilePos = new SquareTilePos(5,5);
    npcs: Character[] = [];
    /**
     * The total size of the level
     */
    nbLinesTotal: number = 50;
    nbColTotal: number = 50;
    /**
     * The size of the displayed portion of the level
     */
    nbLinesToDisplay: number = 11;
    nbColToDisplay: number = 11;
    /**
     * Map of tile col line coords (as short version) and its id
     * used to quickly update a tile props depending on its coordinates
     */
    tilePosMap: Map<string, SquareTile> = new Map();

    constructor() {}

    init() {
        let d = utils.getBySelector('#app .left-box');
        let divContainer: HTMLElement = <HTMLDivElement>document.createElement('div');
        divContainer.classList = 'tiles-container';

        /**
         * Level generation
         */
        for (let i = 0; i < this.nbLinesTotal; i++) {
            for(let j = 0; j < this.nbColTotal; j++) {
                let s = new SquareTile(j, i,utils.randEnumValue(ETileType));
                this.tilePosMap.set(s.position.toShortString(), s);
            }
        }
        
        /**
         * Grid to display the level
         */
        for (let i = 0; i < this.nbLinesToDisplay; i++) {
            let l: HTMLElement = <HTMLDivElement>document.createElement('div');
            l.classList = 'square-line';
            for(let j = 0; j < this.nbColToDisplay; j++) {
                // get the tile at this pos (start at 0,0)
                let tilePos = new SquareTilePos(j, i).toShortString();
                let tile = this.tilePosMap.get(tilePos)!;
                // console.log("get", tilePos, tile.position.toShortString());
                let square: HTMLElement = <HTMLDivElement>document.createElement('div');
                // allows to retrieve the absolute position of the square with its id for update
                square.id = 'P'+tilePos;
                square.dataset.squareid = tile.id;
                square.classList = `square`;
                tile.needsUpdate = true;
                square.appendChild(tile.getHtml());
                l.appendChild(square);
            }
            divContainer.appendChild(l);
        }
        d.appendChild(divContainer);
        this.player.moveTo(this.playerStartPosition);

        // for(var i = 0; i < 3; i++){
        //     let randPos = Array.from(this.tileIdMap)[Math.floor(Math.random() * this.tileIdMap.size)];
        //     this.npcs.push(new NPC({startingPosition: randPos[1].position, maxHP: 10}));
        //     randPos[1].needsUpdate = true;
        // }
    }

    movePlayer(dir: direction) {
        switch(dir) {
            case 'up': this.player.currentPosition.line--; break;
            case 'right': this.player.currentPosition.col++; break;
            case 'down': this.player.currentPosition.line++; break;
            case 'left': this.player.currentPosition.col--; break;
        }
    }

    /**
     * Redraws the while screen each time it's called by using the square ids to find their place
     */
    redraw() {
        let deltaCol = this.player.currentPosition.col - 5;
        let deltaLine = this.player.currentPosition.line - 5;
        for (let i = 0; i < this.nbLinesToDisplay; i++) {
            for(let j = 0; j < this.nbColToDisplay; j++) {
                // get the tile at this pos (start at 0,0)
                let tilePos = new SquareTilePos(j, i).toShortString();
                let divTile = document.getElementById('P' + tilePos);
                if(divTile){
                    let tile = this.tilePosMap.get(new SquareTilePos(j + deltaCol,i+deltaLine).toShortString());
                    if(tile) {
                        divTile.classList.remove('no-tile')
                        divTile.dataset.squareid = tile.id;
                        divTile.innerHTML = '';
                        divTile.appendChild(tile.getHtml());
                    } else {
                        divTile.classList.add('no-tile')
                        divTile.innerHTML = '';
                    }
                }
            }
        }

        // this.tileIdMap.forEach((v) => {
        //     if(v.needsUpdate){
        //         v.updateTile();
        //     }
        // })
    }

    /**
     * Shows the current player stats in the div with the player-stats class
     */
    showPlayerStats() {
        let d = utils.getBySelector('#app .right-box .player-stats');
        d.innerHTML = this.player.htmlDescription();
    }
}