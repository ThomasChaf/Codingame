import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";
import { Facilitator } from "../Facilitator";
import { Goal } from "./GoalStrategy";

export enum EStrategyType {
  COLLECTOR = "COLLECTOR",
  SPEED = "SPEED",
  RANDOM = "RANDOM",
  SURVIVOR = "SURVIVOR",
}

export enum EStrategyAvancement {
  IN_PROGRESS,
  COMPLETED,
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
  public goal?: Goal;

  public abstract type: EStrategyType;
  public avancement: EStrategyAvancement = EStrategyAvancement.IN_PROGRESS;

  abstract update(pacman: Pacman, graph: Graph): void;

  abstract play(pacman: Pacman, graph: Graph, facilitator: Facilitator): Play;

  abstract willPlay(pacman: Pacman, graph: Graph): void;
}
