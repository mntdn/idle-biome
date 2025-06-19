export default class TilePos {
	q: number;
	r: number;
	s: number;

	constructor(_q: number, _r: number, _s: number) {
		this.q = _q;
		this.r = _r;
		this.s = _s;
	}

    isEqual(p: TilePos | null | undefined): boolean {
		if(p === null || p === undefined)
			return false;
        return p.q === this.q && p.r === this.r && p.s === this.s;
    }
}
