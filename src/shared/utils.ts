import Tile from "../classes/Tile";
import TilePos from "../classes/TilePos";
import state from "../state";

// The maximum is exclusive and the minimum is inclusive
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

const getTileByPos = (pos: TilePos): Tile|null => {
    let result: Tile|null = null;
    const posStr = `${pos.q}${pos.r}${pos.s}`;
    const id = state.tilePosMap.get(posStr);
    if(id !== undefined && state.tileIdMap.has(id)){
        result = state.tileIdMap.get(id)!;
    }
    return result;
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
    getTileByPos,
    round
}

export default _;