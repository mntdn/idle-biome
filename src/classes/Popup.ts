import { PopupProperties } from '../interfaces/PopupProperties';
import utils from '../shared/utils';

export default class Popup {
	private _popup: HTMLElement | undefined;
    props: PopupProperties | undefined;
    id: string = "";

	// created hidden by default
	// constructor(pos: Point, width: number, height: number) {
	//     this._popup = <HTMLDivElement>document.createElement('div');
	//     var root = utils.getBySelector('#app');
	//     this._popup.style = `position: absolute; left: ${pos.x}px; top: ${pos.y}px; width: ${width}px; height: ${height}px; background-color: beige;z-index:500; display: none`;
	//     root.appendChild(this._popup);
	// }

	show() {
        if(this.props !== undefined){
            if (this._popup === undefined) {
                var refElement = document.querySelector(this.props.cssRequest);
                let x = 0; 
                let y = 0;
                if(refElement){
                    let pos = refElement.getBoundingClientRect();
                    x = pos.left + (pos.width / 2);
                    if(this.props.position == 'centerTop' || this.props.position == 'centerBottom')
                        x -= this.props.width / 2;
                    y = pos.top + pos.height;
                    if(this.props.position == 'centerBottom')
                        y -= pos.height + this.props.height;
                }
                if(y < 0) y = 0;
                if(x < 0) x = 0;
                this._popup = <HTMLDivElement>document.createElement('div');
                var root = utils.getBySelector('#app');
                this._popup.style = `position: absolute; left: ${x}px; top: ${y}px; width: ${this.props.width}px; 
                height: ${this.props.height}px; background-color: beige;z-index:500; display: none`;
                root.appendChild(this._popup);
            }
            this.update();
            this._popup.style.display = 'block';
        }
	}

	hide() {
        if(this._popup !== undefined)
            this._popup.style.display = 'none';
	}

	update() {
        if(this._popup !== undefined && this.props !== undefined)
		    this._popup.innerHTML = this.props.htmlContent();
	}
}
