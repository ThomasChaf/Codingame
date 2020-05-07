import { IPosition } from "../../utils/Position";
import { Robot } from "../../entities/Robot";
import { getBoard } from "../../Board";

let oreOrchestrator: OreOrchestrator;

interface Goal {
  amount: number;
  position: IPosition;
}
interface IOresGoals {
  [id: string]: Goal;
}

interface IRobotGoals {
  [id: string]: IPosition;
}

export class OreOrchestrator {
  private goals: IRobotGoals = {};

  getGoalPositions = (): IPosition[] => {
    const board = getBoard();
    const oreGoals: IOresGoals = {};
    Object.values(this.goals).forEach((goal: IPosition) => {
      const id = `${goal.x}-${goal.y}`;

      if (!oreGoals[id]) {
        oreGoals[id] = { amount: board.getCase(goal).getOre() - 1, position: goal };
      } else {
        oreGoals[id].amount -= 1;
      }
    });

    return Object.values(oreGoals)
      .filter((goal: Goal) => goal.amount <= 0)
      .map((goal: Goal) => goal.position);
  };

  addGoal = (robot: Robot, goal: IPosition) => {
    this.goals[robot.id] = goal;
  };

  removeGoal = (robot: Robot) => {
    delete this.goals[robot.id];
  };
}

export const getOreOrchestrator = (): OreOrchestrator => {
  if (!oreOrchestrator) {
    oreOrchestrator = new OreOrchestrator();
  }

  return oreOrchestrator;
};
