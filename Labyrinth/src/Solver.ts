import { Case, Grid } from "./Grid";
import { EDir, Position } from "./Position";

export class Solver {
  static solve(grid: Grid, from: Position, goal: Case) {
    const todo = [from];
    const done: { [id: number]: Position } = {};
    let positionGoal: Position | null = null;

    while (todo.length > 0) {
      const currentPos = todo.shift()!;

      [EDir.LEFT, EDir.RIGHT, EDir.UP, EDir.DOWN].forEach((dir) => {
        const nextPos = grid.next(currentPos, dir);

        if (!nextPos || nextPos.eq(from)) return;

        if (grid.at(nextPos) === goal) {
          if (!positionGoal || nextPos.f < positionGoal.f) positionGoal = nextPos;
        }
        if (grid.skipForUnknow(nextPos)) return;

        const positionId = grid.getPositionId(nextPos);
        if (done[positionId]?.f <= nextPos.f) return;

        done[positionId] = nextPos;
        todo.push(nextPos);
      });
    }

    return positionGoal;
  }
}
