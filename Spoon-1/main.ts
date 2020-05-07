import * as fs from "fs";

const buffer = fs
  .readFileSync(process.argv[2])
  .toString()
  .split("\n");
let line = 0;
const readline = () => {
  if (!buffer[line]) {
    process.exit(0);
  }
  return buffer[line++];
};

class Game {
  board: string[][] = [];

  addRow(line: string) {
    this.board.push(line.split(""));
  }

  caseCord = (x: number, y: number): boolean => {
    if (!this.board[y] || !this.board[y][x]) return false;

    return this.board[y][x] === "0";
  };

  analyse = (_x: number, _y: number, incX: number, incY: number): string => {
    let x = _x + incX;
    let y = _y + incY;
    while (this.board[y] && this.board[y][x]) {
      if (this.caseCord(x, y)) return `${x} ${y}`;

      x += incX;
      y += incY;
    }

    return "-1 -1";
  };

  launch = () => {
    this.board.forEach((line, y) => {
      line.forEach((c, x) => {
        if (c === "0") {
          console.log(`${x} ${y} ${this.analyse(x, y, 1, 0)} ${this.analyse(x, y, 0, 1)}`);
        }
      });
    });
  };
}

const W = parseInt(readline());
const H = parseInt(readline());

const game = new Game();
for (let i = 0; i < H; i++) {
  game.addRow(readline());
}

game.launch();
