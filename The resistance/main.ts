import * as fs from "fs";

const buffer: string[] = fs.readFileSync("./test.txt").toString().split("\n");
let line: number = 0;
const readline = (): string => {
  if (!buffer[line]) {
    process.exit(0);
  }
  return buffer[line++];
};

import { solve } from "./src/Solver";
import { convertWord } from "./src/Alphabet";

const mreadline = () => {
  const str = readline();
  console.error(str);
  return str;
};

const words: string[] = [];

const morse: string = mreadline();

const N: number = parseInt(mreadline());
for (let i = 0; i < N; i++) {
  words.push(mreadline());
}

console.log(solve(words.map(convertWord), morse, 0, {}));
