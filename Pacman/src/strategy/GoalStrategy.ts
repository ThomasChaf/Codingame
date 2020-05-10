import { AStrategy } from "./AStrategy";
import { Position } from "../Position";
import { Pacman } from "../pacmans/Pacman";
import { PacmanGraph } from "../board/PacmanGraph";

export type Goal = {
  path: string[];
  score: number;
  position: Position;
};

export abstract class GoalStrategy extends AStrategy {
  protected updateGoal(pacman: Pacman) {
    if (!this.goal) return;

    this.goal.path = this.goal.path.filter((path: string) => !pacman.savedMoves.includes(path));
  }

  public isGoalDangerous(pacman: Pacman, graph: PacmanGraph): boolean {
    if (!this.goal) return false;

    for (const i in this.goal.path) {
      if (graph.getByKey(this.goal.path[i]).hasObstacle()) {
        console.error("DEBUG:", "HAS TROUBLE", pacman.id, this.goal.path[i]);

        return true;
      }
    }

    return false;
  }
}
