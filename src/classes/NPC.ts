import Character from './Character';
import utils from '../shared/utils';

export default class NPC extends Character {
	isPlayer = false;
	maxHP = 30;

	isFriendly = false;
	name= `NPC-${utils.guid()}`;
	inventory = [
		{
			attack: 1,
			defense: 0,
			name: 'knife'
		}
	]
}
