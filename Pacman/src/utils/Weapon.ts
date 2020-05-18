import { Pacman } from "../pacmans/Pacman";
import { Danger, PacmanGraph } from "../board/PacmanGraph";
import { Graph, GraphNode } from "../board/Graph";

export enum EWeapon {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
}

export const parseWeapon = (blob: string): EWeapon => (<any>EWeapon)[blob];

const COUNTERS = {
  [EWeapon.ROCK]: EWeapon.PAPER,
  [EWeapon.SCISSORS]: EWeapon.ROCK,
  [EWeapon.PAPER]: EWeapon.SCISSORS,
};

export const getCounter = (weapon: EWeapon): EWeapon => COUNTERS[weapon];

export const isBestWeapon = (w1: EWeapon, w2: EWeapon): boolean => w1 === COUNTERS[w2];

export const isEatable = (pacman: Pacman, danger: Danger, graph: PacmanGraph): boolean => {
  if (danger.mine || !pacman.faceWeakerOpponent(danger)) return false;

  const distance = graph.getDistance(pacman.getPosition(), danger.position);

  if (pacman.isFast && !danger.isFast && !danger.abilityAvailable && distance < 2) return true;

  const node = graph.get(danger.position);

  if (node.leaveMalus > 0) {
    const enterOfTrap = graph.getByKey(node.closestNode as string);
    const d1 = graph.getDistance(pacman.getPosition(), enterOfTrap.position);
    const d2 = graph.getDistance(danger.position, enterOfTrap.position);

    if ((d1 < d2 || d1 < 4) && (!danger.abilityAvailable || pacman.abilityAvailable)) {
      console.error("DEBUG:", danger.id, "IS TRAPPED", JSON.stringify(danger));

      return true;
    }
  }

  return false;
};
