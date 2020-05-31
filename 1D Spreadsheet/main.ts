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

import { Spreadsheet } from "./src/Spreadsheet";

const N: number = parseInt(readline());

const sheet = new Spreadsheet(N);

for (let i = 0; i < N; i++) {
  var inputs: string[] = readline().split(" ");
  const operation: string = inputs[0];
  const arg1: string = inputs[1];
  const arg2: string = inputs[2];

  sheet.addOperation(i, operation, arg1, arg2);
}

for (let i = 0; i < N; i++) {
  console.log(sheet.solve(i));
}
