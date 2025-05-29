import Tile from './classes/Tile';
import { ETileType } from "./enums/ETileType";
import utils from "./shared/utils";
import './style/main.scss';
import state from './state';

const showTileDetails = (t: Tile) => {
	let d = utils.getBySelector('#app .right-box');
	d.innerHTML = '';
	let div: HTMLElement = <HTMLPreElement>document.createElement('pre');
	div.style = '';
	div.textContent = JSON.stringify(t, null, 2);
	d.appendChild(div);
}

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
		t.onHover = () => showTileDetails(t)
		c.appendChild(t.getHtml());
	}
	if (divContainer) divContainer.appendChild(c);
}
d.appendChild(divContainer);

var dMenu = document.querySelector('#app .menu-box');
if (dMenu) {
	let d = (dMenu as HTMLElement);
	let b: HTMLElement = <HTMLButtonElement>document.createElement('button');
	b.textContent = 'Tick';
	b.onclick = () => {
		execTick();
	}
	d.appendChild(b);

	let b1: HTMLElement = <HTMLButtonElement>document.createElement('button');
	b1.textContent = 'Start';
	b1.onclick = () => {
		mainProcess();
	}
	d.appendChild(b1);

	let b2: HTMLElement = <HTMLButtonElement>document.createElement('button');
	b2.textContent = 'Pause';
	b2.onclick = () => {
		window.clearTimeout(currentTimeout);
	}
	d.appendChild(b2);
}

const execTick = () => {
	state.tileIdMap.forEach(t => {
		let toUpdate = false;
		if(t.stats.hasTickAction){
			t.stats.tickExec();
			toUpdate = true;
		}
		if(toUpdate || t.needsUpdate)
			t.updateContent();
	})
}

var tickTimeMs = 1000;
var currentTimeout: number;

const mainProcess = () => {
	execTick();
	setTimer();
};

const setTimer = () => {
	currentTimeout = window.setTimeout(mainProcess, tickTimeMs);
};
