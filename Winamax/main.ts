import * as fs from "fs";

const buffer: string[] = fs.readFileSync(process.argv[2]).toString().split("\n");
let line: number = 0;
const xreadline = (): string => {
  if (!buffer[line]) {
    console.log("END OF FILE");
    process.exit(0);
  }
  return buffer[line++];
};

const readline = (log: boolean = false): string => {
  const line = xreadline();

  console.error(line);

  return line;
};
// ======================================================================================================

import { Board } from "./src/Board";

var inputs: string[] = readline().split(" ");
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]);
const board = new Board(width, height);

for (let y = 0; y < height; y++) {
  board.addRow(readline());
}

const solver = board.createSolver();

const results = solver.exec();

board.display(solver, results);
