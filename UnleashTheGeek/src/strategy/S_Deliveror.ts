import { ActionDescriptor, EActions, AStrategy, EStrategyAvancement } from "./Strategy";
import { IPosition } from "../utils/Position";
import { Robot } from "../entities/Robot";

export class DeliverorStrategy extends AStrategy {
  private goal: IPosition;

  constructor(robot: Robot) {
    super();
    this.goal = { x: 0, y: robot.getPosition().y };
  }

  computeRound(robot: Robot): void {
    if (robot.getPosition().x === 0) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  }

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.MOVE,
      param: this.goal
    };
  };
}
