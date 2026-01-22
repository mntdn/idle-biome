import Character from "../classes/Character";
import { propertyType } from "../enums/customTypes";

/**
 * The maximum is exclusive and the minimum is inclusive
 * @param min Minimum value (inclusive)
 * @param max Maximum value (exclusive)
 * @returns A random integer
 */
const getRandomInt = (min: number, max: number): number => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

const guid = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

const round = (n: number) => {
    return (Math.round(n * 1000) / 1000);
}

const getBySelector = (selector: string): HTMLElement => {
	var selResult = document.querySelector(selector);
	if (selResult) {
		return (selResult as HTMLElement);
	}
    console.error(`No element with selector ${selector}`);
    return document.createElement('div');
}

/**
 * Returns the total value for a certain prop for an inventory
 * @param c the Character whose inventory we want to scan
 * @param prop the property in question
 * @returns the total value of this property for all the items
 */
const sumProp = (c: Character, prop: propertyType): number => {
    let base = 0;
    if(prop === 'attackSpeed')
        base = c.attackSpeed;
    let result = c.inventory.map(i => (i as any)[prop]).reduce((a, c) => a + c, 0);
    return base + (isNaN(result) ? 0 : result);
}

const createButton = (label: string, style: string, click: () => void): HTMLButtonElement => {
    let but: HTMLButtonElement = document.createElement('button');
	but.textContent = label;
    but.style = style;
	but.onclick = () => {
        click();
	}
    return but;
}

const _ = {
    createButton,
    getRandomInt,
    guid,
    getBySelector,
    round,
    sumProp
}

export default _;