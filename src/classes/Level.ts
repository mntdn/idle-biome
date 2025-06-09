import { ETileType } from "../enums/ETileType";
import utils from "../shared/utils";
import state from "../state";
import Tile from "./Tile";

export default class Level {
    constructor(){
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
    
    showTileDetails (t: Tile) {
        let d = utils.getBySelector('#app .right-box');
        d.innerHTML = '';
        let div: HTMLElement = <HTMLPreElement>document.createElement('pre');
        div.style = '';
        div.textContent = JSON.stringify(t, null, 2);
        d.appendChild(div);
    }

}