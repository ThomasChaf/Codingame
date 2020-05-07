import { ActionDescriptor, EActions, EObject, AStrategy, EStrategyAvancement } from "./Strategy";
import { EItem } from "../utils/Item";
import { Robot } from "../entities/Robot";

export class RadarRequestorStrategy extends AStrategy {
  hasRadar: boolean = false;

  computeRound(robot: Robot): void {
    if (robot.getItem() === EItem.RADAR) {
      this.hasRadar === true;
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  }

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.REQUEST,
      param: EObject.RADAR
    };
  };
}
