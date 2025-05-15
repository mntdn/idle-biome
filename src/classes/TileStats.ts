export default class TileStats {
	water: number;
	waterPerTick: number;
    hasTickAction: boolean;

    constructor() {
        this.water = 0;
        this.waterPerTick = 0;
        this.hasTickAction = false;
    }

    addWater(w: number) {
        this.water += w;
    }

    addWaterPerTick(wpt: number) {
        this.waterPerTick += wpt;
        this.hasTickAction = true;
        console.log(this.waterPerTick);
    }

    tickExec() {
        this.water += this.waterPerTick;
    }
}