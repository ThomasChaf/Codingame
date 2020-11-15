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

const debugReadline = (log: boolean = false): string => {
  const line = readline();

  if (log) {
    console.error(line);
  }
  return line;
};

import { Game } from "./src/Game";

const game = new Game();

// game loop
while (true) {
  game.reset();
  const actionCount: number = parseInt(debugReadline()); // the number of spells and recipes in play
  for (let i = 0; i < actionCount; i++) {
    var inputs: string[] = debugReadline().split(" ");
    const actionId: string = inputs[0]; // the unique ID of this spell or recipe
    const actionType: string = inputs[1]; // in the first league: BREW; later: CAST, OPPONENT_CAST, LEARN, BREW
    const gems = [parseInt(inputs[2]), parseInt(inputs[3]), parseInt(inputs[4]), parseInt(inputs[5])];
    if (actionType === "BREW") {
      game.receipts.addOrder(actionId, gems, parseInt(inputs[6]), parseInt(inputs[7]));
    }
    if (actionType === "CAST") {
      game.myCasts.add(actionId, gems, inputs[9] === "1", inputs[10] === "1");
    }
    if (actionType === "OPPONENT_CAST") {
      game.enemyCasts.add(actionId, gems, inputs[9] === "1", inputs[10] === "1");
    }
    if (actionType === "LEARN") {
      game.books.add(actionId, gems, parseInt(inputs[7]), parseInt(inputs[8]));
    }
  }
  for (let i = 0; i < 2; i++) {
    var inputs: string[] = debugReadline().split(" ");
    const gems: number[] = [
      parseInt(inputs[0]),
      parseInt(inputs[1]),
      parseInt(inputs[2]),
      parseInt(inputs[3]),
    ];
    const score: number = parseInt(inputs[4]); // amount of rupees
    if (i === 0) game.myStore.add(gems, score);
    if (i === 1) game.enemyStore.add(gems, score);
  }

  game.play();
  game.afterPlay();
}
