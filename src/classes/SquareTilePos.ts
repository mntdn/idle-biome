export default class SquareTilePos {
	col: number;
	line: number;

	constructor(_col: number, _line: number) {
		this.col = _col;
		this.line = _line;
	}

    isEqual(p: SquareTilePos | null | undefined): boolean {
		if(p === null || p === undefined)
			return false;
        return p.col === this.col && p.line === this.line;
    }

	toString() {
		return `${this.col},${this.line}`;
	}

	toShortString() {
		return `${this.col}_${this.line}`;
	}
}
