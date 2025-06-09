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
	
}
