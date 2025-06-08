import Tile from './classes/Tile';
import { ETileType } from "./enums/ETileType";
import utils from "./shared/utils";
import './style/main.scss';
import state from './state';
import TilePos from './classes/TilePos';

let pathPos: TilePos[] = [];


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

var dMenu = document.querySelector('#app .menu-box');
if (dMenu) {
	let d = (dMenu as HTMLElement);

	d.appendChild(utils.createButton('Tick', '', () => {execTick();}));

	d.appendChild(utils.createButton('Start', '', () => {mainProcess();}));

	d.appendChild(utils.createButton('Pause', '', () => {window.clearTimeout(currentTimeout);}));

	// d.appendChild(utils.createButton('Wall', '', () => {
	// 	if (state.currentTile) {
	// 		state.currentTile.isTraversable = false;
	// 		state.currentTile.needsUpdate;
	// 	}
	// }));

	// d.appendChild(utils.createButton('Path Start/End!', '', () => {
	// 	if (state.currentTile) {
	// 		pathPos.push(state.currentTile.position);
	// 		if (pathPos.length == 2) {
	// 			findPath(pathPos[0], pathPos[1]);
	// 			pathPos = [];
	// 		}
	// 	}
	// }));
}

const execTick = () => {
	state.tileIdMap.forEach(t => {
		let toUpdate = false;
		if (t.stats.hasTickAction) {
			t.stats.tickExec();
			toUpdate = true;
		}
		if (toUpdate || t.needsUpdate)
			t.updateTile();
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
