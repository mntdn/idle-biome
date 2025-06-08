import { PriorityQueue } from '../interfaces/PriorityQueue';
import utils from '../shared/utils';
import Line from './Line';
import TilePos from './TilePos';

export default class Player {
	maxHP: number;
	currentHP: number;
	currentPosition: TilePos;

	constructor() {
		this.maxHP = 20;
		this.currentHP = this.maxHP;
		this.currentPosition = new TilePos(0, 0, 0);
	}


    moveTo(t: TilePos) {
        this.currentPosition = t;
    }
	
	distance (a: TilePos, b: TilePos): number {
		const vec: TilePos = new TilePos(a.q - b.q, a.r - b.r, a.s - b.s);
		return (Math.abs(vec.q) + Math.abs(vec.r) + Math.abs(vec.s)) / 2;
	}

	findPath(end: TilePos) {
		const start = this.currentPosition;
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
				let neighbors = curPos.getNeighbors(true);
				neighbors.forEach((next) => {
					let newCost = costSoFar.get(curPos.position)! + curPos.cost;
					if (!costSoFar.has(next.position) || newCost < costSoFar.get(next.position)!) {
						costSoFar.set(next.position, newCost);
						let prio = newCost + this.distance(end, next.position);
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

		costSoFar.forEach((v, k) => {
			let t = utils.getTileByPos(k);
			if (t) {
				t.pfResult = v;
				t.needsUpdate = true;
			}
		})

		let lastTile = end;
		let finished = false;
		while (!finished) {
			if (lastTile && cameFrom.get(lastTile)) {
				const l = new Line();
				let tFrom = utils.getTileByPos(lastTile);
				let tTo = utils.getTileByPos(cameFrom.get(lastTile)!);
				if (tFrom && tTo) {
					l.addPoint(tTo.getPixelCoords());
					l.addPoint(tFrom.getPixelCoords());
					l.drawLine();
				}
				lastTile = cameFrom.get(lastTile)!;
				if (cameFrom.get(end) === start)
					finished = true;
			} else {
				finished = true;
			}
		}
	}
}
