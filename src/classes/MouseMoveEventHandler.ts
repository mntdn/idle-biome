import { IdleMouseEvent } from "../interfaces/IdleMouseEvent";
import { Point } from "../interfaces/Point";
import Popup from "./Popup";

export default class MouseMoveEventHandler {
    events: IdleMouseEvent[] = [];
    popups: Popup[] = [];

    addEvent(e: IdleMouseEvent) {
        this.events.push(e);
    }

    removeEvent(e: IdleMouseEvent) {
        this.events = this.events.filter(_ => !(_.tileId === e.tileId && _.elementClass === e.elementClass));
    }

    processEventsAtPoint(pos: Point) {
        let elems = document.elementsFromPoint(pos.x, pos.y);
        let curId = '';
        let classes: string[] = [];
        elems.forEach((el) => {
            if(el.classList.contains('hexagon'))
                curId = el.id;
            el.classList.forEach(c => classes.push(c));
        });
        // console.log(curId, classes);

        let popupsShown: string[] = [];
        this.events.forEach((e) => {
            if(e.eventType === 'popupShow' && e.tileId === curId && classes.indexOf(e.elementClass) >= 0){
                let popupId = e.tileId + e.elementClass;
                popupsShown.push(popupId);
                let curPopup = this.popups.filter(p => p.id === popupId);
                // console.log("YESSS", curPopup.length);
                if(curPopup.length > 0){
                    e.action();
                    curPopup[0].show()
                } else {
                    let popup: Popup = new Popup();
                    popup.props = e.props;
                    popup.id = popupId;
                    e.action();
                    popup.show();
                    this.popups.push(popup);
                    console.log("Add popup", popupId)
                }
            }
        });
        this.popups.forEach(p => {
            if(popupsShown.indexOf(p.id) < 0){
                console.log("cache")
                p.hide();
            }
        })
    }
}