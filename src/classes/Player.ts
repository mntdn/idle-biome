import Character from './Character';

/**
 * The player is the hero of the game, controlled by the player
 */
export default class Player extends Character {
	isPlayer = true;
	maxHP = 30;
	name = "Player";
	inventory = [
		{
			attack: 0,
			defense: 1,
			name: 'shield'
		}
	]

}
