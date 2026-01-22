import { expect, test } from 'vitest'
import path from "./path"
import Vector from '../interfaces/Vector';
import TilePos from '../classes/TilePos';

test('same paths', () => {
    let p1: Vector[] = [{
        from: new TilePos(0,1,2).toShortString(),
        to:new TilePos(0,1,3).toShortString(),
    }];
    let p2: Vector[] = [{
        from: new TilePos(0,1,2).toShortString(),
        to:new TilePos(0,1,3).toShortString(),
    }];
    expect(path.samePath(p1, p2)).toBe(true);
})

test('different paths', () => {
    let p1: Vector[] = [{
        from: new TilePos(0,1,2).toShortString(),
        to:new TilePos(0,1,3).toShortString(),
    }];
    let p2: Vector[] = [{
        from: new TilePos(0,1,2).toShortString(),
        to:new TilePos(1,1,3).toShortString(),
    }];
    expect(path.samePath(p1, p2)).toBe(false);
})

