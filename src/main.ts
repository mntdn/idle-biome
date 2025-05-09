import * as utils from "./shared/utils"
import './style/main.scss';

interface Tile {
	q: number,
	r: number,
	color: string,
	colorHover: string
}

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
	hex.classList = `hexagon ${t.q % 2 !== 0 ? 'low' : ''}`;
	hex.style = `--hex-fill-color:${t.color};--hex-fill-color-hover:${t.colorHover};`;
	hex.innerHTML = `<div class="contents"></div>`;
	return hex;
}

for(let i = 0; i < 2; i++) {
	tileList.push([]);
	for(let j = 0; j < 16; j++)
		tileList[i].push({
			r: i,
			q: j,
			color: colorList[utils.default.getRandomInt(0, colorList.length)],
			colorHover: colorList[utils.default.getRandomInt(0, colorList.length)]
		});
}


var d = document.getElementById('app');
if(d){
	// let hex: HTMLElement = <HTMLDivElement>document.createElement('div');
	// hex.classList = 'container';
	// for(let i = 0; i < 16; i++)
	// 	hex.appendChild(getHex(i%2 != 0));

	// d.appendChild(hex);
	
	// hex = <HTMLDivElement>document.createElement('div');
	tileList.forEach(l => {
		let c: HTMLElement = <HTMLDivElement>document.createElement('div');
		c.classList = 'container';
		l.forEach(t => {
			c.appendChild(getHex(t));
		})
		if(d) d.appendChild(c);
	})

	// d.appendChild(hex);
}
