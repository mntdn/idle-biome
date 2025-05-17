import Tile from './classes/Tile';
import * as utils from './shared/utils';
import './style/main.scss';

interface TileShift {
	qShift: number;
	rShift: number;
	sShift: number;
}

const hexSpacing = 2;
const hexWidth = 60;
const hexHeight = hexWidth * Math.sin((60 * Math.PI) / 180);

// Map of tile q r s coords (as ${q}${r}${s}) and its id
// used to quickly update a tile props depending on its coordinates
let tilePosMap: Map<string, string> = new Map();

// Map of tile id to its Tile content for quick access
let tileIdMap: Map<string, Tile> = new Map();

let colorList = [
	'darkred',
	'darksalmon',
	'darkseagreen',
	'darkslateblue',
	'darkslategray',
	'darkturquoise',
	'darkviolet',
	'deeppink',
	'deepskyblue',
	'dimgray',
	'dodgerblue',
	'firebrick',
	'orchid',
	'palegoldenrod',
	'palegreen',
	'paleturquoise',
	'palevioletred',
	'papayawhip',
	'peachpuff',
	'peru',
	'pink',
	'plum',
	'powderblue',
	'purple',
];

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

var dLeftBox = document.querySelector('#app .left-box');
if (dLeftBox) {
	let d = (dLeftBox as HTMLElement);
	d.style = `--hex-width: ${hexWidth}px; 
		--hex-height: ${hexHeight}px; 
		--hex-margin-left: ${(-1 * hexWidth) / 4 + hexSpacing}px;
		--hex-margin-bottom: ${-1 * hexSpacing}px;
		--hex-low-top: ${hexHeight / 2 + hexSpacing}px;
		--hex-container-pad-top: ${hexSpacing}px`;

	var nbHexPerLine = Math.floor(
		d.clientWidth / ((hexWidth * 3) / 4 + hexSpacing),
	);
	var nbLines = Math.floor(d.clientHeight / hexHeight);
	var color = colorList[utils.default.getRandomInt(0, colorList.length)];
	var colorHover = colorList[utils.default.getRandomInt(0, colorList.length)];

	// length of one of the sides of the hexagon
	var hexagonalGridSize = 3;
	nbHexPerLine = 2 * hexagonalGridSize - 1;
	nbLines = nbHexPerLine;

	for (let i = 0; i < nbLines; i++) {
		let c: HTMLElement = <HTMLDivElement>document.createElement('div');
		c.classList = 'hex-container';
		let line = i - hexagonalGridSize + 1;
		for (let j = 0; j < nbHexPerLine; j++) {
			let col = j - hexagonalGridSize + 1;
			let t = new Tile(line, col, hexagonalGridSize, color, colorHover);
			if(!t.isHidden){
				// we only store the position of the hex if it is shown
				tilePosMap.set(`${t.q}${t.r}${t.s}`, t.id);
				tileIdMap.set(t.id, t);
			}
			c.appendChild(getHex(t));
		}
		if (d) d.appendChild(c);
	}
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
