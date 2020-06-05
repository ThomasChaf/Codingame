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

import { Solver } from "./src/Solver";

var inputs: string[] = readline().split(" ");
const W: number = parseInt(inputs[0]); // width of the building.
const H: number = parseInt(inputs[1]); // height of the building.
const N: number = parseInt(readline()); // maximum number of turns before game over.
var inputs: string[] = readline().split(" ");
const X0: number = parseInt(inputs[0]);
const Y0: number = parseInt(inputs[1]);

const solver = new Solver(W, H, N, X0, Y0);

// game loop
while (true) {
  const bombDir: string = readline(); // Current distance to the bomb compared to previous distance (COLDER, WARMER, SAME or UNKNOWN)

  solver.solve(bombDir);
}
