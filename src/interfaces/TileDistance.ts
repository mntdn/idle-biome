export interface TileDistance {
    /**
     * Distance to the destination tile
     */
    distance: number;
    /**
     * Diagonal distance to the destination tile
     */
    diagonalDistance: number;
    /**
     * Is there a wall between source and destination
     */
    isBlocked: boolean;
}