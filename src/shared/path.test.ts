import { expect, test } from 'vitest'
import path from "./path"
import Vector from '../interfaces/Vector';
import HexTilePos from '../classes/HexTilePos';

test('same paths', () => {
    let p1: Vector[] = [{
        from: new HexTilePos(0,1,2).toShortString(),
        to:new HexTilePos(0,1,3).toShortString(),
    }];
    let p2: Vector[] = [{
        from: new HexTilePos(0,1,2).toShortString(),
        to:new HexTilePos(0,1,3).toShortString(),
    }];
    expect(path.samePath(p1, p2)).toBe(true);
})

test('different paths', () => {
    let p1: Vector[] = [{
        from: new HexTilePos(0,1,2).toShortString(),
        to:new HexTilePos(0,1,3).toShortString(),
    }];
    let p2: Vector[] = [{
        from: new HexTilePos(0,1,2).toShortString(),
        to:new HexTilePos(1,1,3).toShortString(),
    }];
    expect(path.samePath(p1, p2)).toBe(false);
})

