import * as fs from "fs";

const buffer: string[] = fs.readFileSync("./test.txt").toString().split("\n");
let line: number = 0;
const readline = (): string => {
  if (!buffer[line]) {
    process.exit(0);
  }
  return buffer[line++];
};

import { EDirection, Solver } from "./src/Solver";

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
