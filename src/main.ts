import * as utils from "./shared/utils"
import './style/main.scss';

interface Tile {
	col: number,
	line: number,
	q: number,
	r: number,
	s: number,
	color: string,
	colorHover: string,
	isHidden: boolean,
	id: string
}

const hexSpacing = 2;
const hexWidth = 60;
const hexHeight = hexWidth * Math.sin(60*Math.PI/180);

let tileList: Tile[][] = []

let colorList = [
	"darkred",
	"darksalmon",
	"darkseagreen",
	"darkslateblue",
	"darkslategray",
	"darkturquoise",
	"darkviolet",
	"deeppink",
	"deepskyblue",
	"dimgray",
	"dodgerblue",
	"firebrick",
	"orchid",
	"palegoldenrod",
	"palegreen",
	"paleturquoise",
	"palevioletred",
	"papayawhip",
	"peachpuff",
	"peru",
	"pink",
	"plum",
	"powderblue",
	"purple"	   
]

const getHex = (t: Tile) => {
	let hex: HTMLElement = <HTMLDivElement>document.createElement('div');
	hex.id = t.id;
	hex.classList = `hexagon ${t.q % 2 !== 0 ? 'low' : ''} ${t.isHidden ? 'hidden' : ''}`;
	hex.style = `--hex-fill-color:${t.color};--hex-fill-color-hover:${t.colorHover};`;
	hex.onmouseover = () => {console.log(t.q, t.r, t.id)}
	hex.innerHTML = `<div class="contents">${t.col},${t.line} | ${t.s},${t.q},${t.r}</div>`;
	return hex;
}

var d = document.getElementById('app');
if(d){
	d.style = `--hex-width: ${hexWidth}px; 
		--hex-height: ${hexHeight}px; 
		--hex-margin-left: ${(-1 * hexWidth/4) + hexSpacing}px;
		--hex-margin-bottom: ${-1 * hexSpacing}px;
		--hex-low-top: ${(hexHeight / 2) + hexSpacing}px;
		--hex-container-pad-top: ${hexSpacing}px`;

	var nbHexPerLine = Math.floor(d.clientWidth / ((hexWidth * 3/4) + hexSpacing));
	var nbLines = Math.floor(d.clientHeight / hexHeight);
	var color = colorList[utils.default.getRandomInt(0, colorList.length)];
	var colorHover = colorList[utils.default.getRandomInt(0, colorList.length)];

	// length of one of the sides of the hexagon
	var hexagonalGridSize = 4;
	nbHexPerLine = (2 * hexagonalGridSize) - 1;
	nbLines = nbHexPerLine;

	for(let i = 0; i < nbLines; i++) {
		tileList.push([]);
		let line = i - hexagonalGridSize + 1;
		for(let j = 0; j < nbHexPerLine; j++){
			let col = j - hexagonalGridSize + 1;
			let r = line - (col - (col&1)) / 2;
			let q = col;
			let s = (-1 * q) - r;
			tileList[i].push({
				line: line,
				col: col,
				r: r,
				q: q,
				s: s,
				color: color,
				colorHover: colorHover,
				isHidden: (Math.abs(s) > hexagonalGridSize - 1) || (Math.abs(q) > hexagonalGridSize - 1) || (Math.abs(r) > hexagonalGridSize - 1),
				id: utils.default.guid()
			});
		}
	}
	
	tileList.forEach(l => {
		let c: HTMLElement = <HTMLDivElement>document.createElement('div');
		c.classList = 'hex-container';
		l.forEach(t => {
			c.appendChild(getHex(t));
		})
		if(d) d.appendChild(c);
	})
}
