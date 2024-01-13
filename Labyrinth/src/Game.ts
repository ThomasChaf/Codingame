import { Case, Grid } from "./Grid";
import { EDir, Position } from "./Position";
import { Solver } from "./Solver";

export class Game {
  nbRound: number;
  objectifReached: boolean = false;

  constructor(nbRound: number) {
    this.nbRound = nbRound;
  }

  getNbStep(position: Position) {
    let i = 0;
    let temp: Position = position;

    while (temp.parent) {
      temp = temp.parent;
      i = i + 1;
    }

    return i;
  }

  getGoalDirection(position: Position | null) {
    if (!position) return EDir.LEFT;

    let result: Position = position;
    let temp: Position | null = position;

    while (temp?.parent) {
      result = temp;
      temp = temp.parent;
    }

    return result.dir;
  }

  checkForObjectifReached(grid: Grid, myPosition: Position) {
    if (grid.at(myPosition) === Case.CENTER) this.objectifReached = true;
  }

  computeGoal(grid: Grid) {
    const centerPos = grid.getCenterPosition();
    if (centerPos) {
      const solvedPos = Solver.solve(grid, centerPos, Case.EXIT);

      if (solvedPos && this.getNbStep(solvedPos) <= this.nbRound) {
        return this.objectifReached ? Case.EXIT : Case.CENTER;
      }
    }

    return Case.UNKNOWN;
  }

  run(grid: Grid, myPosition: Position) {
    this.checkForObjectifReached(grid, myPosition);

    const goal = this.computeGoal(grid);
    console.error("GOAL:", goal);

    const positionGoal = Solver.solve(grid, myPosition, goal);

    console.log(this.getGoalDirection(positionGoal));
  }
}
