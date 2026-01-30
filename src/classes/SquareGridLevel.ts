import { direction } from "../enums/customTypes";
import { ETileType } from "../enums/ETileType";
import Combat from "../services/Combat";
import utils from "../shared/utils";
import Item from "./Item";
import NPC from "./NPC";
import Player from "./Player";
import SquareTile from "./SquareTile"
import SquareTilePos from "./SquareTilePos";

export default class SquareGridLevel {    
    player: Player = new Player();
    playerStartPosition: SquareTilePos = new SquareTilePos(5,5);
    npcs: NPC[] = [];
    /**
     * The total size of the level
     */
    nbLinesTotal: number = 20;
    nbColTotal: number = 20;
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
        this.player.addItem(new Item(1, 0, 'dagger'));

        for(var i = 0; i < 30; i++){
            let randPos = new SquareTilePos(utils.getRandomInt(0, this.nbColTotal), utils.getRandomInt(0, this.nbLinesTotal));
            let n = new NPC({startingPosition: randPos, currentHP: 10, maxHP: 10});
            n.addItem(new Item(1, 0, 'dagger'));
            this.npcs.push(n);
        }
    }

    movePlayer(dir: direction) {
        let newPos = structuredClone(this.player.currentPosition);
        switch(dir) {
            case 'up': newPos.line--; break;
            case 'right': newPos.col++; break;
            case 'down': newPos.line++; break;
            case 'left': newPos.col--; break;
        }
        // if we would exit the level, we just return
        if(newPos.col < 0 || newPos.col >= this.nbColTotal || newPos.line < 0 || newPos.line >= this.nbLinesTotal)
            return;

        // test if we hit a NPC in the new position
        let npcHit: NPC|undefined;
        this.npcs.forEach(n => {
            if (!npcHit && n.currentPosition.isEqual(newPos))
                npcHit = n;
        });
        if(npcHit){
            let fightResult = Combat.fight(this.player, npcHit);
            if(fightResult == 1){
                console.log("COMBAT with", npcHit.name, "gagné")
                this.player.currentPosition = newPos;
            } else {
                console.log("COMBAT with", npcHit.name, "perdu")
            }
        } else {
            this.player.currentPosition = newPos;
        }
        console.log(this.player.textDescription());
    }

    /**
     * Redraws the whole screen each time it's called by using the square ids to find their place
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

        this.showPlayerStats();
    }

    /**
     * Shows the current player stats in the div with the player-stats class
     */
    showPlayerStats() {
        let d = utils.getBySelector('#app .right-box .player-stats');
        d.innerHTML = this.player.htmlDescription();
    }
}