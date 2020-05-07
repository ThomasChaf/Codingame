import { ActionDescriptor, EActions, AStrategy, EStrategyAvancement } from "./Strategy";
import { EItem } from "../utils/Item";
import { IPosition, PositionUtils } from "../utils/Position";
import { getBoard } from "../Board";
import { Case } from "../utils/Case";
import { Robot } from "../entities/Robot";
import { getOreOrchestrator } from "./orchestrator/Ore";

export class CollectorStrategy extends AStrategy {
  private goal: IPosition;
  private prevPosition: IPosition;

  constructor(robot: Robot, goal: IPosition) {
    super();
    this.goal = goal;
    getOreOrchestrator().addGoal(robot, goal);
  }

  computeRound = (robot: Robot) => {
    const robotPosition = robot.getPosition();
    const currentCase: Case = getBoard().getCase(this.goal);

    if (
      currentCase.getOre() === 0 ||
      robot.getItem() === EItem.ORE ||
      currentCase.hasOnlyDoubt() ||
      PositionUtils.equal(this.prevPosition, robotPosition)
    ) {
      if (!currentCase.isVisible()) {
        currentCase.collectOre();
      }
      getOreOrchestrator().removeGoal(robot);
      this.avancement = EStrategyAvancement.COMPLETED;
    }
    this.prevPosition = robotPosition;
  };

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.DIG,
      param: this.goal
    };
  };
}
