import Tile from './classes/Tile';
import { ETileType } from "./enums/ETileType";
import utils from "./shared/utils";
import './style/main.scss';
import state from './state';
import TileShift from './interfaces/TileShift';

const getHexIdFromDepl = (
	curTile: Tile,
	shift: TileShift
) => {
	let tileCoord = `${curTile.q + shift.qShift}${curTile.r + shift.rShift}${curTile.s + shift.sShift}`;
	if(state.tilePosMap.has(tileCoord)){
		let t = state.tilePosMap.get(tileCoord);
		if(t)
			return t;
	}
	return null;
};

const showNeighbors = (t: Tile) => {
	let allDepl: TileShift[] = [
		{qShift: 1, rShift: 0, sShift: -1}, {qShift:1, rShift:-1, sShift:0}, {qShift:0, rShift:-1, sShift:+1}, 
		{qShift:-1, rShift:0, sShift:1}, {qShift:-1, rShift:+1, sShift:0}, {qShift:0, rShift:1, sShift:-1}, 
	];
	allDepl.forEach(d => {
		let h = getHexIdFromDepl(t, d);
		if(h){
			var hexHtml = document.getElementById(h);
			if(hexHtml){
				hexHtml.style = `--hex-fill-color:#ccc;--hex-fill-color-hover:#ddd;`
			}
		}
	})
}

const updateHexContent = (id: string) => {
	var hexHtml = document.getElementById(id);
	if(hexHtml){
		var t = state.tileIdMap.get(id);
		if(t)
			hexHtml.innerHTML = `<div class="contents">${t.stats.water}</div>`;
	}
}

const showTileDetails = (t: Tile) => {
	let d = utils.getBySelector('#app .right-box');
	d.innerHTML = '';
	let div: HTMLElement = <HTMLPreElement>document.createElement('pre');
	div.style = '';
	div.textContent = JSON.stringify(t, null, 2);
	d.appendChild(div);
}

let d = utils.getBySelector('#app .left-box');
d.style = `--hex-width: ${state.hexWidth}px; 
	--hex-height: ${state.hexHeight}px; 
	--hex-margin-left: ${(-1 * state.hexWidth) / 4 + state.hexSpacing}px;
	--hex-margin-bottom: ${-1 * state.hexSpacing}px;
	--hex-low-top: ${state.hexHeight / 2 + state.hexSpacing}px;
	--hex-line-pad-top: ${state.hexSpacing}px`;
let divContainer: HTMLElement = <HTMLDivElement>document.createElement('div');
divContainer.classList = 'tiles-container';

var nbHexPerLine = Math.floor(
	d.clientWidth / ((state.hexWidth * 3) / 4 + state.hexSpacing),
);
var nbLines = Math.floor(d.clientHeight / state.hexHeight);

nbHexPerLine = 2 * state.hexagonalGridSize - 1;
nbLines = nbHexPerLine;

for (let i = 0; i < nbLines; i++) {
	let c: HTMLElement = <HTMLDivElement>document.createElement('div');
	c.classList = 'hex-line';
	let line = i - state.hexagonalGridSize + 1;
	for (let j = 0; j < nbHexPerLine; j++) {
		let col = j - state.hexagonalGridSize + 1;
		let t = new Tile(line, col, ETileType.stone);
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

let tilesToUpdate: string[] = []

const execTick = () => {
	tilesToUpdate = [];
	state.tileIdMap.forEach(t => {
		if(t.stats.hasTickAction){
			t.stats.tickExec();
			tilesToUpdate.push(t.id);
		}
	})

	tilesToUpdate.forEach(t => {
		updateHexContent(t);
	});
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
