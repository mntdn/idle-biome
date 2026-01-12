import { Point } from "./Point";

export interface PopupProperties {
    // centerTop = referenceCoords in the middle of the top part of the popup
    // centerBottom = referenceCoords in the middle of the bottom part of the popup
    position: 'centerTop'|'centerBottom';
    referenceCoords: Point;
    cssRequest: string;
    width: number;
    height: number;
    htmlContent: () => string;
}