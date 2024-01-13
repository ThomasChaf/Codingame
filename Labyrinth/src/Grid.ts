import { EDir, Position } from "./Position";

export enum Case {
  CENTER = "C",
  UNKNOWN = "?",
  EXIT = "T",
  WALL = "#",
}

export class Grid {
  container: string[][];
  nbRows: number;
  nbCols: number;

  constructor(nbRows: number, nbCols: number) {
    this.container = [];
    this.nbRows = nbRows;
    this.nbCols = nbCols;
  }

  push(row: string[]) {
    this.container.push(row);
  }

  at({ x, y }: Position) {
    return this.container[y][x];
  }

  skipForUnknow(nextPos: Position) {
    return this.at(nextPos) === Case.UNKNOWN;
  }

  nextPosition(currentPos: Position, dir: EDir) {
    const { x, y } = currentPos;

    if (dir === EDir.LEFT && x > 0) return [x - 1, y];

    if (dir === EDir.RIGHT && x + 1 < this.nbCols) return [x + 1, y];

    if (dir === EDir.UP && y > 0) return [x, y - 1];

    if (dir === EDir.DOWN && y + 1 < this.nbRows) return [x, y + 1];
  }

  next(currentPos: Position, dir: EDir) {
    const nextCoord = this.nextPosition(currentPos, dir);
    if (!nextCoord) return;

    const nextPos = currentPos.next(nextCoord[0], nextCoord[1], dir);

    if (this.at(nextPos) !== Case.WALL) return nextPos;
  }

  getPositionId({ x, y }: Position) {
    return y * this.nbCols + x;
  }

  getCenterPosition() {
    let x = 0;
    let y = 0;

    while (y < this.nbRows) {
      x = 0;
      while (x < this.nbCols) {
        x = x + 1;
        const pos = new Position(x, y);
        if (this.at(pos) === Case.CENTER) return pos;
      }
      y = y + 1;
    }
  }
}
