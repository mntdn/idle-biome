import { Point } from "./Point";

export interface PopupProperties {
    pos: Point;
    width: number;
    height: number;
    htmlContent: () => string;
}