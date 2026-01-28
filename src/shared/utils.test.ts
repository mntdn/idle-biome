import { expect, test } from 'vitest';
import utils from './utils';
import Character from '../classes/Character';
import Item from '../classes/Item';

test('sum attack empty', () => {
	let c1: Character = new Character();
	expect(utils.sumProp(c1, 'attack')).toBe(0);
});

test('sum attack speed empty', () => {
	let c1: Character = new Character();
	expect(utils.sumProp(c1, 'attackSpeed')).toBe(1);
});

test('sum attack speed many', () => {
	let c1: Character = new Character();
	c1.props = { inventory: [new Item(1, 1, ''), new Item(2, 1, '')] };
	expect(utils.sumProp(c1, 'attackSpeed')).toBe(1);
});

test('sum attack many', () => {
	let c1: Character = new Character();
	c1.props = { inventory: [new Item(1, 1, ''), new Item(2, 1, '')] };
	expect(utils.sumProp(c1, 'attack')).toBe(3);
});
