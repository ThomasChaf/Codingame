import { Pacman } from "./pacmans/Pacman";
import { Goal } from "./strategy/Goal";
import { PacmanGraph } from "./board/PacmanGraph";
import { sameDirection } from "./Position";

type Moves = {
  [key: string]: Pacman;
};

type Previsions = {
  [key: string]: number;
};

export class Facilitator {
  private moves: Moves = {};
  private willBeVisited: Previsions = {};

  reset() {
    this.moves = {};
    this.willBeVisited = {};
  }

  addMove(pacman: Pacman, key: string) {
    this.moves[key] = pacman;
  }

  shouldWait(graph: PacmanGraph, pacman: Pacman, key: string): boolean {
    if (!key || !this.moves[key]) return false;

    const goal = graph.getByKey(key).position;
    const p1 = this.moves[key].getPosition();
    const p2 = pacman.getPosition();

    console.error("DEBUG:", pacman.id, this.moves[key].id);

    if (sameDirection(p1, p2, goal)) {
      console.error("DEBUG:", "SAME DIRECTION", "DONT WAIT");

      return false;
    }

    return true;
  }

  isAvailable(pacman: Pacman, key: string): boolean {
    return !this.willBeVisited[key] || this.willBeVisited[key] === pacman.id;
  }

  updateGoal(pacman: Pacman, goal: Goal) {
    goal.path.forEach((key: string) => {
      this.willBeVisited[key] = pacman.id;
    });
  }
}
