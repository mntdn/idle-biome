import { PopupProperties } from "./PopupProperties";

export interface IdleMouseEvent {
    /**
     * The id of the tile concerned
     */
    tileId: string;
    /**
     * A class of the element that is contained in the tile
     */
    elementClass: string;
    eventType: 'popupShow';
    props: PopupProperties;
    /**
     * Depending on the eventType will be called to do somethind
     * @returns Nothing
     */
    action: () => void; 
}