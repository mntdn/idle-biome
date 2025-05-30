import { Point } from "../interfaces/Point";

export default class Line {
    coords: Point[] = []

    addPoint(p: Point) {
        this.coords.push(p);
    }

    private lineDistance (x1: number, y1: number, x2: number, y2: number) {
        var xlen = x2 - x1;
        xlen = xlen * xlen;

        var ylen = y2 - y1;
        ylen = ylen * ylen;

        return Math.sqrt(xlen + ylen);
    };

    drawLine() {
        if(this.coords.length > 1){
            var root = document.getElementById('app');
			if (root) {
				let d: HTMLElement = <HTMLDivElement>(
					document.createElement('div')
				);
                const stroke = 5;
                const w = this.lineDistance(this.coords[0].x, this.coords[0].y,this.coords[1].x, this.coords[1].y);
                const angle = Math.atan2(this.coords[1].y - this.coords[0].y, this.coords[1].x - this.coords[0].x);

				d.style = `position: absolute; 
                    left: ${this.coords[0].x}px; 
                    top: ${this.coords[0].y}px; 
                    width: ${w}px; height: ${stroke}px; 
                    background-color: red;
                    transform: rotate(${angle}rad);
                    transform-origin: 0% 0%;`;
				root.appendChild(d);
			}
            this.coords = [];
        }
    }
}