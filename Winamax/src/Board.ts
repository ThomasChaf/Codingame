import { GolfSolver, Results } from "./GolfSolver";
import { Position, DIRECTIONS, asKey } from "./Position";

const getSign = (diffX: number, diffY: number): string => {
  if (diffY === 0 && diffX === 1) return "<";
  if (diffY === 0 && diffX === -1) return ">";
  if (diffY === 1 && diffX === 0) return "^";
  if (diffY === -1 && diffX === 0) return "v";

  throw new Error("Invalid direction");
};

class CoarseBoard {
  private rows: string[];

  constructor(width: number, height: number) {
    this.rows = [];
  }

  addRow(row: string) {
    this.rows.push(row);
  }

  at(x: number, y: number) {
    return this.rows[y][x];
  }

  update(x: number, y: number, res: string) {
    this.rows[y] = `${this.rows[y].substr(0, x)}${res}${this.rows[y].substr(x + 1)}`;
  }

  display() {
    this.rows.forEach((row: string) => console.log(row.replace(/[HX]/g, ".")));
  }
}

export class Board {
  private width: number;
  private height: number;
  private board: CoarseBoard;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.board = new CoarseBoard(width, height);
  }

  addRow(row: string) {
    this.board.addRow(row);
  }

  createSolver = (): GolfSolver => {
    const solver = new GolfSolver();

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const position = new Position(x, y);

        solver.addNode(position, this.board.at(x, y));

        DIRECTIONS.forEach(([incX, incY]) => {
          const _x = incX + x;
          const _y = incY + y;

          if (_x >= 0 && _x < this.width && _y >= 0 && _y < this.height) {
            solver.addEdge(position, asKey(_x, _y));
          }
        });
      }
    }

    return solver;
  };

  display(solver: GolfSolver, results: Results) {
    Object.keys(results.answers).forEach((key: string) => {
      const path = results.at(key) as string[];

      for (let x = 0; x < path.length - 1; x++) {
        const node = solver.get(path[x]);
        const nextNode = solver.get(path[x + 1]);

        const diffX = node.position.x - nextNode.position.x;
        const diffY = node.position.y - nextNode.position.y;
        const sign = getSign(diffX, diffY);

        this.board.update(node.position.x, node.position.y, sign);
      }
    });

    this.board.display();
  }
}
