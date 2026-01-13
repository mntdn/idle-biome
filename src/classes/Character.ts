import Vector from "../interfaces/Vector";
import state from "../state";
import Item from "./Item";
import TilePos from "./TilePos";

/**
 * This class defines a basic Character type.
 * It can be the current player or an NPC (cf. those classes for more details)
 */
export default class Character {
	currentPosition: TilePos;
	currentDestination: TilePos;
	currentPath: Vector[] = [];
	currentPathId: string = "";
	/**
	 * All the items carried by the character
	 */
	inventory: Item[] = [];
    maxHP: number;
	name: string = "";
	currentHP: number;
	/**
	 * Number of tiles per tick
	 * TODO: implement
	 */
	movingSpeed: number = 1;
	/**
	 * The speed at which the character will attack.
	 * The highest attack speed will attack first
	 */
	attackSpeed: number = 1;

	constructor();
    constructor(pos: TilePos);
    constructor(pos?: TilePos) {
		this.maxHP = 20;
		this.currentHP = this.maxHP;
		this.currentPosition = pos ? pos : new TilePos(0, 0, 0);
		this.currentDestination = this.currentPosition;
	}

    moveTo(t: TilePos) {
        this.currentPosition = t;
    }

	/**
	 * goes to the next tile in the currentPath
	 */
	goToDestination() {
		if(this.currentPath.length > 0) {
			var p = this.currentPath.shift();
			var dest = state.currentLevel!.getTileByShortString(p!.to);
			state.currentLevel!.movePlayer(dest!.position);
		}
	}
}