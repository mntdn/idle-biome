import Line from "../classes/Line";
import Vector from "../interfaces/Vector";
import state from "../state";
import utils from "./utils";

/**
 * 
 * @param vectors 
 * @returns The ID of the path to use with removePath
 */
const drawPath = (vectors: Vector[]): string => {
    var pId = '_' + utils.guid();
    var i = 0;
    vectors.forEach((v) => {
        const l = new Line();
        l.id = pId + i;
        let tFrom = state.currentLevel!.getTileByShortString(v.from);
        let tTo = state.currentLevel!.getTileByShortString(v.to);
        if (tFrom && tTo) {
            l.addPoint(tFrom.getPixelCoords(false));
            l.addPoint(tTo.getPixelCoords(false));
            l.drawLine();
        }
    })
    return pId;
}

/**
 * removes a path of id pId
 * @param pId Id of the path to be removed
 */
const removePath = (pId: string) => {
    var lines = document.querySelectorAll(`.line[id^="${pId}"]`);
    lines.forEach((l) => {
        l.remove();
    })
}

const _ = {
    drawPath,
    removePath
}

export default _;