import { Pacman } from "../pacmans/Pacman";
import { PacmanGraph } from "../board/PacmanGraph";
import { Facilitator } from "../Facilitator";

export enum EStrategyType {
  COLLECTOR = "COLLECTOR",
  SPEED = "SPEED",
  RANDOM = "RANDOM",
  SURVIVOR = "SURVIVOR",
  CHOMP = "CHOMP",
  WARN = "WARN",
}

export enum PlayType {
  MOVE = "MOVE",
  SPEED = "SPEED",
  SWITCH = "SWITCH",
}

export type Play = {
  type: PlayType;
  param: any;
};

export abstract class AStrategy {
  public abstract type: EStrategyType;

  abstract play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play;
}
