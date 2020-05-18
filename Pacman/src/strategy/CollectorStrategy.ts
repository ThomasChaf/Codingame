import { PacmanGraph } from "../board/PacmanGraph";
import { EStrategyType, Play } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { AMovementStrategy } from "./AMovementStrategy";
import { Facilitator } from "../Facilitator";
import { Goal } from "./Goal";

export class CollectorStrategy extends AMovementStrategy {
  public type: EStrategyType = EStrategyType.COLLECTOR;

  public update(goal: Goal) {
    this.goal = goal;
  }

  public play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    return this.computeMovement(pacman, graph, facilitator);
  }
}
