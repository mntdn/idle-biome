import Item from "../classes/Item";
import SquareTilePos from "../classes/SquareTilePos";

export interface CharacterProperties {
    startingPosition?: SquareTilePos;
    inventory?: Item[];
    maxHP?: number;
    name?: string;
    currentHP?: number;
    /**
     * Number of tiles per tick
     * TODO: implement
     */
    movingSpeed?: number;
    /**
     * The speed at which the character will attack.
     * The highest attack speed will attack first
     */
    attackSpeed?: number;

}