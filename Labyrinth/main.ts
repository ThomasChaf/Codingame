import * as fs from "fs";

const buffer: string[] = fs.readFileSync("./test.txt").toString().split("\n");
let line: number = 0;
const readline = (): string => {
  if (!buffer[line]) {
    process.exit(0);
  }
  return buffer[line++];
};

import { Grid } from "./src/Grid";
import { Game } from "./src/Game";
import { Position } from "./src/Position";

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
