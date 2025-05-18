import Tile from './classes/Tile';
import { ETileType } from "./enums/ETileType";
import './style/main.scss';
import state from './state';

interface TileShift {
	qShift: number;
	rShift: number;
	sShift: number;
}

// Map of tile q r s coords (as ${q}${r}${s}) and its id
// used to quickly update a tile props depending on its coordinates
let tilePosMap: Map<string, string> = new Map();

// Map of tile id to its Tile content for quick access
let tileIdMap: Map<string, Tile> = new Map();

const getHexIdFromDepl = (
	curTile: Tile,
	shift: TileShift
) => {
	let tileCoord = `${curTile.q + shift.qShift}${curTile.r + shift.rShift}${curTile.s + shift.sShift}`;
	if(tilePosMap.has(tileCoord)){
		let t = tilePosMap.get(tileCoord);
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

const getHex = (t: Tile) => {
	let hex: HTMLElement = <HTMLDivElement>document.createElement('div');
	hex.id = t.id;
	hex.classList = `hexagon ${t.q % 2 !== 0 ? 'low' : ''} ${t.isHidden ? 'hidden' : ''}`;
	hex.style = `--hex-fill-color:${t.color};--hex-fill-color-hover:${t.colorHover};`;
	hex.onmouseover = () => {
		// console.log(t.q, t.r, t.id);
		showTileDetails(t);
	};
	hex.onclick = () => {
		// showNeighbors(t);
		t.stats.addWaterPerTick(2);
	};
	hex.innerHTML = `<div class="contents">${(t.isHidden ? '' : t.stats.water)}</div>`;
	return hex;
};

const updateHexContent = (id: string) => {
	var hexHtml = document.getElementById(id);
	if(hexHtml){
		var t = tileIdMap.get(id);
		if(t)
			hexHtml.innerHTML = `<div class="contents">${t.stats.water}</div>`;
	}
}

const showTileDetails = (t: Tile) => {
	var detailsBox = document.querySelector('#app .right-box');
	if (detailsBox) {
		let d = (detailsBox as HTMLElement);
		d.innerHTML = '';
		let div: HTMLElement = <HTMLPreElement>document.createElement('pre');
		div.style = '';
		div.textContent = JSON.stringify(t, null, 2);
		d.appendChild(div);
	}
}

var dLeftBox = document.querySelector('#app .left-box');
if (dLeftBox) {
	let d = (dLeftBox as HTMLElement);
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
			if(!t.isHidden){
				// we only store the position of the hex if it is shown
				tilePosMap.set(`${t.q}${t.r}${t.s}`, t.id);
				tileIdMap.set(t.id, t);
			}
			c.appendChild(getHex(t));
		}
		if (divContainer) divContainer.appendChild(c);
	}
	if(d)
		d.appendChild(divContainer);
}

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
	tileIdMap.forEach(t => {
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
