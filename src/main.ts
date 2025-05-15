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

interface TileMap {
	id: string;
	isHidden: boolean;
}

interface TileShift {
	qShift: number;
	rShift: number;
	sShift: number;
}

const hexSpacing = 2;
const hexWidth = 60;
const hexHeight = hexWidth * Math.sin((60 * Math.PI) / 180);

let tileList: Tile[][] = [];
let hexMap: Map<string, TileMap> = new Map();

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
	if(hexMap.has(tileCoord)){
		let t = hexMap.get(tileCoord);
		if(t && !t.isHidden)
			return t.id;
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
		showNeighbors(t);
	};
	hex.innerHTML = `<div class="contents"></div>`;
	return hex;
};

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
		tileList.push([]);
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
			tileList[i].push({
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
			});
			hexMap.set(`${q}${r}${s}`, { id: id, isHidden: isHidden });
		}
	}

	tileList.forEach((l) => {
		let c: HTMLElement = <HTMLDivElement>document.createElement('div');
		c.classList = 'hex-container';
		l.forEach((t) => {
			c.appendChild(getHex(t));
		});
		if (d) d.appendChild(c);
	});

	let b: HTMLElement = <HTMLButtonElement>document.createElement('button');
	b.textContent = 'Tick';
	b.onclick = () => {
		console.log("tick");
	}
	d.appendChild(b);
}
