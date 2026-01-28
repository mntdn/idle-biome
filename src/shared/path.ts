import Line from "../classes/Line";
import Vector from "../interfaces/Vector";
import state from "../state";
import utils from "./utils";

/**
 * 
 * @param vectors 
 * @returns The ID of the path to use with removePath
 */
const drawPath = (vectors: Vector[], color: string): string => {
    var pId = '_' + utils.guid();
    var i = 0;
    vectors.forEach((v) => {
        const l = new Line();
        l.id = pId + i++;
        let tFrom = state.biome!.getTileByShortString(v.from);
        let tTo = state.biome!.getTileByShortString(v.to);
        if (tFrom && tTo) {
            l.addPoint(tFrom.getPixelCoords(false));
            l.addPoint(tTo.getPixelCoords(false));
            l.color = color;
            l.drawLine(i == vectors.length);
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

/**
 * Indicates if the paths are the same
 * @param p1 Path 1
 * @param p2 Path 2
 */
const samePath = (p1: Vector[], p2: Vector[]): boolean => {
    if(p1.length != p2.length)
        return false;
    for(let i = 0; i < p1.length; i++){
        if(p1[i].from !== p2[i].from ||p1[i].to !== p2[i].to)
            return false;
    }
    return true;
}

const _ = {
    drawPath,
    removePath,
    samePath
}

export default _;