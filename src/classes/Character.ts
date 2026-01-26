import { propertyType } from "../enums/customTypes";
import Vector from "../interfaces/Vector";
import utils from "../shared/utils"
import { CharacterProperties } from "../interfaces/CharacterProperties";
import SquareTilePos from "./SquareTilePos";

/**
 * This class defines a basic Character type.
 * It can be the current player or an NPC (cf. those classes for more details)
 */
export default class Character {
	currentPosition: SquareTilePos;
	currentDestination: SquareTilePos;
	currentPath: Vector[] = [];
	currentPathId: string = "";
	props: CharacterProperties|undefined;

	constructor();
    constructor(_props: CharacterProperties);
    constructor(_props?: CharacterProperties) {
		this.setHealth(_props?.maxHP ?? 20);
		this.currentPosition = _props?.startingPosition ?? new SquareTilePos(0, 0)
		this.currentDestination = this.currentPosition;
	}

	setHealth(hp: number){
		this.props = {
			...this.props,
			maxHP: hp,
			currentHP: hp,
		}
	}

    moveTo(t: SquareTilePos) {
        this.currentPosition = t;
    }

	/**
	 * goes to the next tile in the currentPath
	 */
	goToDestination() {
		// if(this.currentPath.length > 0) {
		// 	var p = this.currentPath.shift();
		// 	var dest = state.currentLevel!.getTileByShortString(p!.to);
		// 	state.currentLevel!.movePlayer(dest!.position);
		// }

	}

	/**
	 * Returns the total value for a property
	 * @param prop The property we want to know the total of
	 */
	getTotal(prop: propertyType): number {
		return utils.sumProp(this, prop);
	}

	htmlDescription() {
		return '';
	}
}