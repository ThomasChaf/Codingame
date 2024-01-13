



class Game {
  nbRound: number;
  objectifReached: boolean = false;

  constructor(nbRound: number) {
    this.nbRound = nbRound;
  }

  getNbStep(position: Position) {
    let i = 0;
    let temp: Position = position;

    while (temp.parent) {
      temp = temp.parent;
      i = i + 1;
    }

    return i;
  }

  getGoalDirection(position: Position | null) {
    if (!position) return EDir.LEFT;

    let result: Position = position;
    let temp: Position | null = position;

    while (temp?.parent) {
      result = temp;
      temp = temp.parent;
    }

    return result.dir;
  }

  checkForObjectifReached(grid: Grid, myPosition: Position) {
    if (grid.at(myPosition) === Case.CENTER) this.objectifReached = true;
  }

  computeGoal(grid: Grid) {
    const centerPos = grid.getCenterPosition();
    if (centerPos) {
      const solvedPos = Solver.solve(grid, centerPos, Case.EXIT);

      if (solvedPos && this.getNbStep(solvedPos) <= this.nbRound) {
        return this.objectifReached ? Case.EXIT : Case.CENTER;
      }
    }

    return Case.UNKNOWN;
  }

  run(grid: Grid, myPosition: Position) {
    this.checkForObjectifReached(grid, myPosition);

    const goal = this.computeGoal(grid);
    console.error("GOAL:", goal);

    const positionGoal = Solver.solve(grid, myPosition, goal);

    console.log(this.getGoalDirection(positionGoal));
  }
}


// const printPos = (pos: Position) => {
//   let x = "";
//   let temp: Position | null = pos;

//   while (temp?.parent) {
//     x = x + `[${temp.x}, ${temp.y}]${temp.dir} | `;
//     temp = temp.parent;
//   }

//   return x;
// };

enum Case {
  CENTER = "C",
  UNKNOWN = "?",
  EXIT = "T",
  WALL = "#",
}

class Grid {
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
enum EDir {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  UP = "UP",
  DOWN = "DOWN",
}

class Position {
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



class Solver {
  static solve(grid: Grid, from: Position, goal: Case) {
    const todo = [from];
    const done: { [id: number]: Position } = {};
    let positionGoal: Position | null = null;

    while (todo.length > 0) {
      const currentPos = todo.shift()!;

      [EDir.LEFT, EDir.RIGHT, EDir.UP, EDir.DOWN].forEach((dir) => {
        const nextPos = grid.next(currentPos, dir);

        if (!nextPos || nextPos.eq(from)) return;

        if (grid.at(nextPos) === goal) {
          if (!positionGoal || nextPos.f < positionGoal.f) positionGoal = nextPos;
        }
        if (grid.skipForUnknow(nextPos)) return;

        const positionId = grid.getPositionId(nextPos);
        if (done[positionId]?.f <= nextPos.f) return;

        done[positionId] = nextPos;
        todo.push(nextPos);

        // console.log("=================================");
        // Object.keys(done).forEach((i) => {
        //   const z = done[i];
        //   console.log(i, `{ x: ${z.x}, y: ${z.y}, f: ${z.f} }`);
        // });
      });
    }

    return positionGoal;
  }
}





const mreadline = () => {
  const str = readline();
  console.error(str);
  return str;
};

const meta: string[] = mreadline().split(" ");
const nbRows: number = parseInt(meta[0]);
const nbCols: number = parseInt(meta[1]);
const nbRound: number = parseInt(meta[2]);

const game = new Game(nbRound);

while (true) {
  const inputs = mreadline().split(" ");
  const myPosition = new Position(parseInt(inputs[1]), parseInt(inputs[0]));

  const grid = new Grid(nbRows, nbCols);
  for (let i = 0; i < nbRows; i++) {
    grid.push(mreadline().split(""));
  }

  game.run(grid, myPosition);
}
