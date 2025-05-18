enum EStatType {
    water,
    mineral
}

interface StatProperties {
    pType: EStatType,
    quantity: number,
    qtyAddedPerTick: number,
    qtyAbsorbedPerTick: number
}

export default class TileStats {
    
	water: number;
	waterPerTick: number;
    waterAbsorptionPerTick: number;
    hasTickAction: boolean;

    constructor() {
        this.water = 0;
        this.waterPerTick = 0;
        this.waterAbsorptionPerTick = 0;
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