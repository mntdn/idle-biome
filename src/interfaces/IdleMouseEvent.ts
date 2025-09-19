import { PopupProperties } from "./PopupProperties";

export interface IdleMouseEvent {
    tileId: string; // the id of the tile concerned
    elementClass: string; // a class of the element that is contained in the tile
    eventType: 'popupShow';
    props: PopupProperties;
    action: () => void; // depending on the eventType will be called to do somethind
}