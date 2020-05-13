import { PacmanGraph } from "./PacmanGraph";
import { Position, DIRECTIONS } from "../Position";

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
}

export class Factory {
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

  constructGraph = (): PacmanGraph => {
    const mod = (n: number, m: number) => ((n % m) + m) % m;

    const graph = new PacmanGraph();
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.board.at(x, y) === " ") {
          const position = new Position(x, y);
          graph.addNode(position);

          DIRECTIONS.forEach(([incX, incY]) => {
            const _x = mod(x + incX, this.width);
            const _y = mod(y + incY, this.height);

            if (this.board.at(_x, _y) === " ") {
              graph.addEdge(position, new Position(_x, _y));
            }
          });
        }
      }
    }
    return graph;
  };
}
