import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";

export enum EStrategyType {
  COLLECTOR = "COLLECTOR",
  SPEED = "SPEED",
}

export enum EStrategyAvancement {
  IN_PROGRESS,
  COMPLETED,
}

export enum PlayType {
  MOVE = "MOVE",
  SPEED = "SPEED",
}

export type Play = {
  type: PlayType;
  param: any;
};

export abstract class AStrategy {
  public abstract type: EStrategyType;
  protected avancement: EStrategyAvancement = EStrategyAvancement.IN_PROGRESS;

  abstract play(pacman: Pacman): Play;

  abstract willPlay(pacman: Pacman, graph: Graph): void;
}
