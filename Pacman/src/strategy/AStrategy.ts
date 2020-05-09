import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";

export enum EStrategyType {
  UNDEFINED,
  COLLECTOR,
  WAITOR,
}

export enum EStrategyAvancement {
  IN_PROGRESS,
  COMPLETED,
}

export enum PlayType {
  MOVE = "MOVE",
}

export type Play = {
  type: PlayType;
  param: any;
};

export abstract class AStrategy {
  protected avancement: EStrategyAvancement = EStrategyAvancement.IN_PROGRESS;

  abstract play(pacman: Pacman): Play;

  abstract willPlay(pacman: Pacman, graph: Graph): void;
}
