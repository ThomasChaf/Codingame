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

export enum ActionType {
  MOVE = "MOVE",
}

export type Action = {
  type: ActionType;
  param: any;
};

export abstract class AStrategy {
  protected avancement: EStrategyAvancement = EStrategyAvancement.IN_PROGRESS;

  abstract computeAction(pacman: Pacman): Action;

  abstract computeRound(pacman: Pacman, graph: Graph): void;
}
