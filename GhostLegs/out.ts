import * as fs from "fs";

const buffer: string[] = fs
  .readFileSync(process.argv[1])
  .toString()
  .split("\n");
let line: number = 0;
const readline = (): string => {
  if (!buffer[line]) {
    process.exit(0);
  }
  return buffer[line++];
};
const inputs: string[] = readline().split(" ");

const W: number = parseInt(inputs[0]);
const H: number = parseInt(inputs[1]);
for (let i = 0; i < H; i++) {
  const line: string = readline();
}

// Write an action using console.log()
// To debug: console.error('Debug messages...');

console.log("answer");
