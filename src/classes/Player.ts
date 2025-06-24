import Vector from '../interfaces/Vector';
import state from '../state';
import TilePos from './TilePos';

export default class Player {
	maxHP: number;
	currentHP: number;
	currentPosition: TilePos;
	currentDestination: TilePos;
	currentPath: Vector[] = [];
	currentPathId: string = "";

	constructor() {
		this.maxHP = 20;
		this.currentHP = this.maxHP;
		this.currentPosition = new TilePos(0, 0, 0);
		this.currentDestination = this.currentPosition;
	}

    moveTo(t: TilePos) {
        this.currentPosition = t;
    }

	// goes to the next tile in the currentPath
	goToDestination() {
		if(this.currentPath.length > 0) {
			var p = this.currentPath.shift();
			var dest = state.currentLevel!.getTileByShortString(p!.to);
			state.currentLevel!.movePlayer(dest!.position);
		}
	}
}
