import utils from "../shared/utils";

export default class SquareGridLevel {
    

    constructor() {}

    init() {
        let d = utils.getBySelector('#app .left-box');
        let divContainer: HTMLElement = <HTMLDivElement>document.createElement('div');
        divContainer.classList = 'tiles-container';
        var nbLines = 5;
        var nbCol = 15;

        for (let i = 0; i < nbLines; i++) {
            let l: HTMLElement = <HTMLDivElement>document.createElement('div');
            l.classList = 'square-line';
            for(let j = 0; j < nbCol; j++) {
                let s: HTMLElement = <HTMLDivElement>document.createElement('div');
                s.classList = 'square';
                l.appendChild(s);
            }
            divContainer.appendChild(l);
        }
        d.appendChild(divContainer);
    }

}