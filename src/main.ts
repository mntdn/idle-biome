import TileStats from './classes/TileStats';
import * as utils from './shared/utils';
import './style/main.scss';

interface Tile {
	col: number;
	line: number;
	q: number;
	r: number;
	s: number;
	color: string;
	colorHover: string;
	isHidden: boolean;
	id: string;
	stats: TileStats;
}

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

var d = document.getElementById('app');
if (d) {
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
			let r = line - (col - (col & 1)) / 2;
			let q = col;
			let s = -1 * q - r;
			let id = utils.default.guid();
			let isHidden =
				Math.abs(s) > hexagonalGridSize - 1 ||
				Math.abs(q) > hexagonalGridSize - 1 ||
				Math.abs(r) > hexagonalGridSize - 1;
			let t = {
				line: line,
				col: col,
				r: r,
				q: q,
				s: s,
				color: color,
				colorHover: colorHover,
				isHidden: isHidden,
				id: id,
				stats: new TileStats()
			};
			if(!isHidden){
				// we only store the position of the hex if it is shown
				tilePosMap.set(`${q}${r}${s}`, id);
				tileIdMap.set(id, t);
			}
			c.appendChild(getHex(t));
		}
		if (d) d.appendChild(c);
	}

	let b: HTMLElement = <HTMLButtonElement>document.createElement('button');
	b.textContent = 'Tick';
	b.onclick = () => {
		execTick();
	}
	d.appendChild(b);

	let br: HTMLElement = document.createElement('br');
	d.appendChild(br);

	let b1: HTMLElement = <HTMLButtonElement>document.createElement('button');
	b1.textContent = 'Pause';
	b1.onclick = () => {
		window.clearTimeout(currentTimeout);
	}
	d.appendChild(b1);
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

mainProcess();
