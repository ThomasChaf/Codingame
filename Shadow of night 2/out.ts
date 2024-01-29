

class Board {
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



enum EDirection {
  UNKNOWN = "UNKNOWN",
  COLDER = "COLDER",
  WARMER = "WARMER",
  SAME = "SAME",
}

class Solver {
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
type Point = {
  x: number;
  y: number;
};

const distance = ({ x: xa, y: ya }: Point, { x: xb, y: yb }: Point) => {
  return Math.sqrt((xb - xa) * (xb - xa) + (yb - ya) * (yb - ya));
};

const equalP = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point) => {
  return x1 === x2 && y1 === y2;
};


const mreadline = () => {
  const str = readline();
  console.error(str);
  return str;
};

var inputs: string[] = mreadline().split(" ");
const W: number = parseInt(inputs[0]);
const H: number = parseInt(inputs[1]);
const N: number = parseInt(mreadline());
var inputs: string[] = mreadline().split(" ");
const X0: number = parseInt(inputs[0]);
const Y0: number = parseInt(inputs[1]);

const solver = new Solver(W, H, N, X0, Y0);

while (true) {
  const bombDir: string = mreadline();

  solver.solve(bombDir as EDirection);
}
