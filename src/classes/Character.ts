import { propertyType } from "../enums/customTypes";
import Vector from "../interfaces/Vector";
import state from "../state";
import Item from "./Item";
import TilePos from "./TilePos";
import utils from "../shared/utils"
import { CharacterProperties } from "../interfaces/CharacterProperties";

/**
 * This class defines a basic Character type.
 * It can be the current player or an NPC (cf. those classes for more details)
 */
export default class Character {
	currentPosition: TilePos;
	currentDestination: TilePos;
	currentPath: Vector[] = [];
	currentPathId: string = "";
	props: CharacterProperties|undefined;

	constructor();
    constructor(_props: CharacterProperties);
    constructor(_props?: CharacterProperties) {
		this.setHealth(_props?.maxHP ?? 20);
		this.currentPosition = _props?.startingPosition ?? new TilePos(0, 0, 0)
		this.currentDestination = this.currentPosition;
	}

	setHealth(hp: number){
		this.props = {
			...this.props,
			maxHP: hp,
			currentHP: hp,
		}
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