import Tile from './classes/Tile';
import { ETileType } from "./enums/ETileType";
import utils from "./shared/utils";
import './style/main.scss';
import state from './state';
import TilePos from './classes/TilePos';

interface PriorityQueue {
	position: TilePos;
	priority: number;
}

let pathPos: TilePos[] = [];

const distance = (a: TilePos, b: TilePos): number => {
	const vec: TilePos = new TilePos(a.q - b.q, a.r - b.r, a.s - b.s);
	return (Math.abs(vec.q) + Math.abs(vec.r) + Math.abs(vec.s)) / 2;
}

const findPath = (start: TilePos, end: TilePos) => {
	const frontier: PriorityQueue[] = [];
	frontier.push({
		position: start,
		priority: 0
	})
	const cameFrom: Map<TilePos, TilePos | null> = new Map();
	const costSoFar: Map<TilePos, number> = new Map();
	cameFrom.set(start, null);
	costSoFar.set(start, 0);

	while (frontier.length > 0) {
		let current = frontier.shift();
		if (current!.position == end)
			break;

		let curPos = utils.getTileByPos(current!.position)
		if (curPos) {
			let neighbors = curPos.getNeighbors();
			neighbors.forEach((next) => {
				let newCost = costSoFar.get(curPos.position)! + curPos.cost;
				if (!costSoFar.has(next.position) || newCost < costSoFar.get(next.position)!) {
					costSoFar.set(next.position, newCost);
					let prio = newCost + distance(end, next.position);
					frontier.push({
						position: next.position,
						priority: prio
					});
					cameFrom.set(next.position, curPos.position)
				}
			})
		} else {
			console.error("Problem with pathfinding at", current!.position);
			break;
		}
	}
	console.log(cameFrom);
	console.log(costSoFar);
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
			pathPos.push(t.position);
			if(pathPos.length == 2){
				findPath(pathPos[0], pathPos[1]);
				pathPos = [];
			}
		}
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
		if (t.stats.hasTickAction) {
			t.stats.tickExec();
			toUpdate = true;
		}
		if (toUpdate || t.needsUpdate)
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
