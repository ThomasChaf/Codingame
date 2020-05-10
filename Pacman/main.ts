import * as fs from "fs";

const buffer: string[] = fs.readFileSync(process.argv[2]).toString().split("\n");
let line: number = 0;
const readline = (): string => {
  if (!buffer[line]) {
    console.log("END OF FILE");
    process.exit(0);
  }
  return buffer[line++];
};

// ======================================================================================================

const debugreadline = (): string => {
  const line = readline();

  // console.error(line);
  return line;
};

import { Game } from "./src/Game";
import { Factory } from "./src/board/Factory";
import { Position } from "./src/Position";
import { EWeapon, parseWeapon } from "./src/utils/Weapon";

var inputs: string[] = debugreadline().split(" ");
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]);
const board = new Factory(width, height);

for (let y = 0; y < height; y++) {
  board.addRow(debugreadline());
}

const graph = board.constructGraph();

// graph.print();

const game = new Game(graph);

while (true) {
  var inputs: string[] = debugreadline().split(" ");
  const myScore: number = parseInt(inputs[0]);
  const opponentScore: number = parseInt(inputs[1]);
  const visiblePacCount: number = parseInt(debugreadline()); // all your pacs and enemy pacs in sight

  game.willUpdatePac();

  for (let i = 0; i < visiblePacCount; i++) {
    var inputs: string[] = debugreadline().split(" ");
    const pacId: number = parseInt(inputs[0]); // pac number (unique within a team)
    const mine: boolean = inputs[1] !== "0"; // true if this pac is yours
    const x: number = parseInt(inputs[2]); // position in the grid
    const y: number = parseInt(inputs[3]); // position in the grid
    const weapon: EWeapon = parseWeapon(inputs[4]); // unused in wood leagues
    const speedTurnsLeft: number = parseInt(inputs[5]); // unused in wood leagues
    const abilityCooldown: number = parseInt(inputs[6]); // unused in wood leagues

    game.updatePac(pacId, mine, new Position(x, y), weapon, speedTurnsLeft, abilityCooldown);
  }

  game.didUpdatePac();

  const visiblePelletCount: number = parseInt(debugreadline()); // all pellets in sight

  for (let i = 0; i < visiblePelletCount; i++) {
    var inputs: string[] = debugreadline().split(" ");
    const x: number = parseInt(inputs[0]);
    const y: number = parseInt(inputs[1]);
    const value: number = parseInt(inputs[2]); // amount of points this pellet is worth
    game.updatePellet(x, y, value);
  }

  game.willPlay();

  game.play();

  game.didPlay();
}
