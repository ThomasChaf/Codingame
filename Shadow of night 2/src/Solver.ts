import { Board } from "./Board";
import { Point, distance, equalP } from "./utils";

export enum EDirection {
  UNKNOWN = "UNKNOWN",
  COLDER = "COLDER",
  WARMER = "WARMER",
  SAME = "SAME",
}

export class Solver {
  board: Board;
  prevPosition: Point;
  position: Point;

  constructor(W: number, H: number, N: number, X0: number, Y0: number) {
    this.board = new Board(W, H);
    this.prevPosition = { x: X0, y: Y0 };
    this.position = { x: X0, y: Y0 };
  }

  findClosestSquare(from: Point): Point {
    if (this.board.isAvailable(from.x, from.y)) return from;

    for (let i = 0; i < 6; i++) {
      let x = from.x - i;
      let y = from.y - i;
      while (x <= from.x + i) {
        if (this.board.isAvailable(x, y)) return { x, y };
        x += 1;
      }
      while (y <= from.y + i) {
        if (this.board.isAvailable(x, y)) return { x, y };
        y += 1;
      }
      while (x > from.x - i) {
        if (this.board.isAvailable(x, y)) return { x, y };
        x -= 1;
      }
      while (y > from.y - i) {
        if (this.board.isAvailable(x, y)) return { x, y };
        y -= 1;
      }
    }

    return from;
  }

  getBarycenter(bombdir: EDirection): Point {
    let gx = 0;
    let gy = 0;
    let nb = 0;

    this.board.forEachPoint((point: Point) => {
      if (equalP(point, this.position)) return true;

      if (bombdir !== EDirection.UNKNOWN) {
        const currentDistance = distance(this.position, point);
        const prevDistance = distance(this.prevPosition, point);

        if (bombdir === EDirection.SAME) {
          if (currentDistance !== prevDistance) return true;
        }
        if (bombdir === EDirection.WARMER) {
          if (currentDistance >= prevDistance) return true;
        }
        if (bombdir === EDirection.COLDER) {
          if (currentDistance <= prevDistance) return true;
        }
      }

      gx += point.x;
      gy += point.y;
      nb += 1;

      return false;
    });

    return { x: gx / nb, y: gy / nb };
  }

  solve(bombdir: EDirection) {
    const barycenter = this.getBarycenter(bombdir);
    const symetricalPosition = this.board.getSymetricalPosition(this.position, barycenter);
    const nextSquare = this.findClosestSquare(symetricalPosition);

    this.prevPosition = this.position;
    this.position = nextSquare;

    // console.error("Barycenter:", barycenter);
    // this.board.log();
    console.log(nextSquare.x, nextSquare.y);
  }
}
