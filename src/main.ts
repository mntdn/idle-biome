import * as utils from "./shared/utils"
import './style/main.scss';

interface Tile {
	q: number,
	r: number,
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
	hex.innerHTML = `<div class="contents"></div>`;
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

	for(let i = 0; i < nbLines; i++) {
		tileList.push([]);
		for(let j = 0; j < nbHexPerLine; j++)
			tileList[i].push({
				r: i,
				q: j,
				color: color,
				colorHover: colorHover,
				isHidden: false,
				id: utils.default.guid()
			});
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
