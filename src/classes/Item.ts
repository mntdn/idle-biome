/**
 * Describes an item that can be anything carried by a character in his inventory
 */
export default class Item {
    attack: number = 0;
    defense: number = 0;
    name: string = '';

    constructor();
    constructor(a: number, d: number, n: string);
    constructor(a?: number, d?: number, n?: string) {
        this.attack = a ? a : 0;
        this.defense = d ? d : 0;
        this.name = n ? n : '';
    }
}