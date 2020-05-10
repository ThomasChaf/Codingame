import { AStrategy } from "./AStrategy";
import { Position } from "../Position";
import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";

export type Goal = {
  path: string[];
  value: number;
  position: Position;
};

export abstract class GoalStrategy extends AStrategy {
  protected goal?: Goal;

  protected updateGoal(pacman: Pacman) {
    if (!this.goal) return;

    this.goal.path = this.goal.path.filter((path: string) => !pacman.savedMoves.includes(path));
  }

  protected isGoalDangerous(pacman: Pacman, graph: Graph): boolean {
    if (!this.goal) return false;

    for (const i in this.goal.path) {
      if (graph.getByKey(this.goal.path[i]).hasPacman) {
        console.error("DEBUG:", "HAS TROUBLE", pacman.id, this.goal.path[i]);

        return true;
      }
    }

    return false;
  }
}
