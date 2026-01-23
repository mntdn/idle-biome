import Character from './Character';
import utils from '../shared/utils';
import Item from './Item';

export default class NPC extends Character {
	isPlayer = false;

	isFriendly = false;
	name= `NPC-${utils.guid()}`;
	inventory = [new Item(1,0,'knife')];

	htmlDescription(): string {
		let inv = this.inventory.map(i => i.toHTML()).join('<br />');
		return `<div>${this.name}</div>
		<div>${this.props?.currentHP}/${this.props?.maxHP}</div>
		<div>${inv}</div>
		`;
	}
}
