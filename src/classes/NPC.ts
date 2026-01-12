import Character from './Character';

export default class NPC extends Character {
	isPlayer: boolean = false;
	maxHP: number = 30;

	isFriendly: boolean = false;
}
