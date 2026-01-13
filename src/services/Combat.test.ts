import { expect, test } from 'vitest';
import combat from './Combat';
import Character from '../classes/Character';
import Item from '../classes/Item';

test('draw fight cancelled', () => {
	let c1: Character = new Character();
	c1.inventory = [new Item(0, 1, '')];
    c1.maxHP = 20;
    c1.currentHP = 20;
	let c2: Character = new Character();
	c2.inventory = [new Item(1, 0, '')];
    let result = combat.fight(c1, c2);
	expect(result).toBe(0);
    expect(c1.currentHP).toBe(20);
});

test('close fight same attack', () => {
	let c1: Character = new Character();
	c1.inventory = [new Item(1, 0, '')];
    c1.maxHP = 20;
    c1.currentHP = 20;
	let c2: Character = new Character();
	c2.inventory = [new Item(1, 0, '')];
    c2.maxHP = 20;
    c2.currentHP = 20;
    let result = combat.fight(c1, c2);

    expect(c1.currentHP).toBe(1);
	expect(result).toBe(1);
});

test('C1 wins', () => {
	let c1: Character = new Character();
	c1.inventory = [new Item(1, 0, '')];
	let c2: Character = new Character();

	expect(combat.fight(c1, c2)).toBe(1);
});

test('C1 wins long fight', () => {
	let c1: Character = new Character();
	c1.inventory = [new Item(1, 0, '')];
	let c2: Character = new Character();
    c2.maxHP = 9999;
    c2.currentHP = 9999;

	expect(combat.fight(c1, c2)).toBe(1);
});

test('C2 wins', () => {
	let c1: Character = new Character();
	c1.inventory = [new Item(1, 0, '')];
	let c2: Character = new Character();
	c2.inventory = [new Item(3, 0, '')];
    
	expect(combat.fight(c1, c2)).toBe(2);
});
