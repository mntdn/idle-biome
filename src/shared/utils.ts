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

const _ = {
    getRandomInt,
    guid,
    getBySelector,
    round
}

export default _;