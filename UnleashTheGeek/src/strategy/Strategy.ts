import { IPosition } from "../utils/Position";
import { Robot } from "../entities/Robot";

export enum EStrategyType {
  UNDEFINED,
  RADAR_REQUESTOR,
  RADAR_INSTALLOR,
  COLLECTOR,
  DELIVEROR,
  WAITOR,
  FOLLOWER
}

export enum EStrategyAvancement {
  IN_PROGRESS,
  COMPLETED
}

export enum EObject {
  RADAR = "RADAR",
  TRAP = "TRAP"
}

export enum EActions {
  WAIT = "WAIT",
  MOVE = "MOVE",
  DIG = "DIG",
  REQUEST = "REQUEST"
}

export type ActionDescriptor = {
  type: EActions;
  param: any;
};

export const ACTIONS = {
  [EActions.WAIT]: () => console.log(EActions.WAIT),
  [EActions.MOVE]: (position: IPosition) => console.log(`${EActions.MOVE} ${position.x} ${position.y}`),
  [EActions.DIG]: (position: IPosition) => console.log(`${EActions.DIG} ${position.x} ${position.y}`),
  [EActions.REQUEST]: (obj: EObject) => console.log(`${EActions.REQUEST} ${obj}`)
};

export abstract class AStrategy {
  protected avancement: EStrategyAvancement = EStrategyAvancement.IN_PROGRESS;
  abstract computeAction(): ActionDescriptor;
  abstract computeRound(robot: Robot): void;

  getAvancement = (): EStrategyAvancement => this.avancement;
}
