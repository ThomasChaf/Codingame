import { Point } from "./utils";

export class Board {
  squares: { [k: number]: boolean } = {};
  W: number;
  H: number;

  constructor(W: number, H: number) {
    this.W = W;
    this.H = H;
  }

  isAvailable(x: number, y: number) {
    const n = y * this.W + x;

    return x >= 0 && x < this.W && y >= 0 && y < this.H && !this.squares[n];
  }

  forEachPoint(callback: (square: Point) => boolean) {
    let x = 0;
    let y = 0;

    while (y < this.H) {
      x = 0;
      while (x < this.W) {
        const n = y * this.W + x;

        if (!this.squares[n] && callback({ x, y })) {
          this.squares[n] = true;
        }

        x += 1;
      }
      y += 1;
    }
  }

  getSymetricalPosition({ x: mx, y: my }: Point, { x: gx, y: gy }: Point): Point {
    let x = Math.round(mx + 2 * (gx - mx));
    if (x < 0) x = 0;
    if (x >= this.W) x = this.W - 1;

    let y = Math.round(my + 2 * (gy - my));
    if (y < 0) y = 0;
    if (y >= this.H) y = this.H - 1;

    return { x, y };
  }

  log() {
    let x = 0;
    let y = 0;

    console.error("BOARD:");
    while (y < this.H) {
      x = 0;
      let z = "";
      while (x < this.W) {
        z += `${this.squares[y * this.W + x] ? "X" : "-"}`;
        x += 1;
      }
      console.error(z);
      y += 1;
    }
  }
}
