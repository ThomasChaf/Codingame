import { PacmanGraph } from "../board/PacmanGraph";
import { EStrategyType, Play } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { AMovementStrategy } from "./AMovementStrategy";
import { Facilitator } from "../Facilitator";
import { PelletManager } from "../utils/PelletManager";

export class CollectorStrategy extends AMovementStrategy {
  public type: EStrategyType = EStrategyType.COLLECTOR;

  public update(
    pacman: Pacman,
    graph: PacmanGraph,
    facilitator: Facilitator,
    pelletManager: PelletManager,
    complete: number
  ) {
    this.goal = graph.findBestGoal(pacman, facilitator, pelletManager, complete);

    facilitator.updateGoal(pacman, this.goal);
  }

  public play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    return this.computeMovement(pacman, graph, facilitator);
  }
}
