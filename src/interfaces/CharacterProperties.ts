import Item from "../classes/Item";
import TilePos from "../classes/TilePos";

export interface CharacterProperties {
    startingPosition?: TilePos;
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