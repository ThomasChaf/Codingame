export enum EDir {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  UP = "UP",
  DOWN = "DOWN",
}

export class Position {
  x: number;
  y: number;
  dir: EDir;
  f: number;
  parent: Position | null;

  constructor(x: number, y: number, dir: EDir = EDir.LEFT, f: number = 0, parent: null | Position = null) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.f = f;
    this.parent = parent;
  }

  next(x: number, y: number, dir: EDir) {
    const f = this.f + 1;

    return new Position(x, y, dir, f, this);
  }

  eq(myPosition: Position) {
    return this.x === myPosition.x && this.y === myPosition.y;
  }
}
