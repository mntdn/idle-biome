import { Point } from "../interfaces/Point";

export default class Line {
    coords: Point[] = []
    id: string = "";
    color: string = "red";

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

    /**
     * Draws a line defined by the 2 points in coords
     * @param addArrow Adds an arrow at the end of the line
     */
    drawLine(addArrow: boolean) {
        if(this.coords.length > 1){
            var root = document.getElementById('app');
			if (root) {
				let d: HTMLElement = <HTMLDivElement>(
					document.createElement('div')
				);
                if(this.id.length > 0)
                    d.id = this.id;
                d.classList = "line";

                const stroke = 5;
                const w = this.lineDistance(this.coords[0].x, this.coords[0].y,this.coords[1].x, this.coords[1].y);
                const angle = Math.atan2(this.coords[1].y - this.coords[0].y, this.coords[1].x - this.coords[0].x);

				d.style = `position: absolute; 
                    left: ${this.coords[0].x}px; 
                    top: ${this.coords[0].y}px; 
                    width: ${w}px; height: ${stroke}px; 
                    background-color: ${this.color};
                    transform: rotate(${angle}rad) translate(-${stroke / 2}px, -${stroke / 2}px);
                    transform-origin: 0% 0%;`;
				root.appendChild(d);

                if(addArrow){
                    let t: HTMLElement = <HTMLDivElement>(
                        document.createElement('div')
                    );
                    if(this.id.length > 0)
                        t.id = this.id + "a";
                    t.classList = "line triangle";
                    t.style = `position: absolute; 
                        left: ${this.coords[1].x - 10}px; 
                        top: ${this.coords[1].y - 7.5}px; 
                        border-color: transparent transparent ${this.color} transparent;
                        transform: rotate(${angle + (Math.PI * 0.5)}rad);
                        // transform-origin: 0% 0%;`
                    root.appendChild(t);
                }
			}
            this.coords = [];
        }
    }
}