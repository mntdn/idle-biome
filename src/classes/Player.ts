import Vector from '../interfaces/Vector';
import Character from './Character';
import Item from './Item';

/**
 * The player is the hero of the game, controlled by the player
 */
export default class Player extends Character {
	isPlayer = true;
	maxHP = 30;
	name = "Player";
	/**
	 * Contains the path that elads you to the pointed direction
	 * without being the active path
	 */
	tempPath: Vector[] = [];
	tempPathId: string = "";

	inventory = [new Item(0,1,'shield')];

	htmlDescription(): string {
		return `<b>Player</b><br />
		<div>HP : ${this.currentHP}/${this.maxHP}</div>
		<div>Attack : ${this.getTotal('attack')} / Defense : ${this.getTotal('defense')}</div>
		`;
	}
}
