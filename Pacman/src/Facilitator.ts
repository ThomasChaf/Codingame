import { Pacman } from "./pacmans/Pacman";
import { Goal } from "./strategy/Goal";
import { PacmanGraph } from "./board/PacmanGraph";
import { sameDirection } from "./Position";

type Moves = {
  [key: string]: Pacman;
};

type Previsions = {
  [key: string]: {
    score: number;
    pacId: number;
  };
};

export class Facilitator {
  private moves: Moves = {};
  private lastPrevision: Previsions = {};
  private willBeVisited: Previsions = {};

  reset() {
    this.moves = {};
    this.lastPrevision = this.willBeVisited;
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

    if (sameDirection(p1, p2, goal)) {
      return false;
    }

    return true;
  }

  isAvailable(pacman: Pacman, key: string): boolean {
    return !this.lastPrevision[key] || this.lastPrevision[key].pacId === pacman.id;
  }

  updateGoal(pacman: Pacman, goal: Goal) {
    goal.path.forEach((key: string) => {
      if (!this.willBeVisited[key] || goal.score > this.willBeVisited[key].score) {
        this.willBeVisited[key] = {
          pacId: pacman.id,
          score: goal.score,
        };
      }
    });
  }
}
