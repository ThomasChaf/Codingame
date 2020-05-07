import * as fs from "fs";

const buffer: string[] = fs
  .readFileSync("./test.txt")
  .toString()
  .split("\n");
let line: number = 0;
const readline = (): string => {
  if (!buffer[line]) {
    console.log("END OF FILE");
    process.exit(0);
  }
  return buffer[line++];
};

/**
 * Deliver more ore to hq (left side of the map) than your opponent. Use radars to find ore but beware of traps!
 **/
const ROBOT_AMOUNT: number = 5;

const mReadline = (): string => {
  const line = readline();

  // console.error(line);
  return line;
};

import { Game } from "./src/Game";

var inputs: string[] = mReadline().split(" ");
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]); // size of the map

const game = new Game(width, height);

// game loop
while (true) {
  var inputs: string[] = mReadline().split(" ");
  // const myScore: number = parseInt(inputs[0]); // Amount of ore delivered
  // const opponentScore: number = parseInt(inputs[1]);

  const mapBlob: string[] = [];
  for (let i = 0; i < height; i++) {
    mapBlob.push(mReadline());
  }
  game.updateMap(mapBlob);

  var inputs: string[] = mReadline().split(" ");

  const entityCount: number = parseInt(inputs[0]); // number of entities visible to you
  game.setRadarCd(parseInt(inputs[1])); // turns left until a new radar can be requested
  // const trapCooldown: number = parseInt(inputs[2]); // turns left until a new trap can be requested
  for (let i = 0; i < entityCount; i++) {
    game.addEntity(mReadline().split(" "));
  }
  for (let i = 0; i < ROBOT_AMOUNT; i++) {
    game.play(i);
  }
}
