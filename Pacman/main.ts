import * as fs from "fs";

const buffer: string[] = fs.readFileSync(process.argv[2]).toString().split("\n");
let line: number = 0;
const mreadline = (): string => {
  if (!buffer[line]) {
    console.log("END OF FILE");
    process.exit(0);
  }
  return buffer[line++];
};

const readline = (): string => {
  const line = mreadline();

  // console.log(line);
  return line;
};

// ======================================================================================================

import { Game } from "./src/Game";
import { Factory } from "./src/Board/Factory";
import { Position } from "./src/Position";

var inputs: string[] = readline().split(" ");
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]);
const board = new Factory(width, height);

for (let y = 0; y < height; y++) {
  board.addRow(readline());
}

const graph = board.constructGraph();

// graph.print();

const game = new Game(graph);

while (true) {
  var inputs: string[] = readline().split(" ");
  const myScore: number = parseInt(inputs[0]);
  const opponentScore: number = parseInt(inputs[1]);
  const visiblePacCount: number = parseInt(readline()); // all your pacs and enemy pacs in sight

  for (let i = 0; i < visiblePacCount; i++) {
    var inputs: string[] = readline().split(" ");
    const pacId: number = parseInt(inputs[0]); // pac number (unique within a team)
    const mine: boolean = inputs[1] !== "0"; // true if this pac is yours
    const x: number = parseInt(inputs[2]); // position in the grid
    const y: number = parseInt(inputs[3]); // position in the grid
    const typeId: string = inputs[4]; // unused in wood leagues
    const speedTurnsLeft: number = parseInt(inputs[5]); // unused in wood leagues
    const abilityCooldown: number = parseInt(inputs[6]); // unused in wood leagues

    game.roundInput(pacId, mine, new Position(x, y), typeId, speedTurnsLeft, abilityCooldown);
  }

  const visiblePelletCount: number = parseInt(readline()); // all pellets in sight

  for (let i = 0; i < visiblePelletCount; i++) {
    var inputs: string[] = readline().split(" ");
    const x: number = parseInt(inputs[0]);
    const y: number = parseInt(inputs[1]);
    const value: number = parseInt(inputs[2]); // amount of points this pellet is worth
    game.updatePellet(x, y, value);
  }

  game.play();
}
