import { PacmanGraph } from "../board/PacmanGraph";
import { EStrategyAvancement, EStrategyType, Play } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Goal } from "./Goal";
import { AMovementStrategy } from "./AMovementStrategy";
import { Facilitator } from "../Facilitator";

export class CollectorStrategy extends AMovementStrategy {
  public type: EStrategyType = EStrategyType.COLLECTOR;
  private inc: number = 0;

  public update(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator) {
    // if (this.goal && this.avancement === EStrategyAvancement.IN_PROGRESS) {
    //   this.goal.updatePath(pacman);
    //   facilitator.updateGoal(pacman, this.goal);
    // }

    // if ((this.goal && pacman.getPosition().sameAs(this.goal.position)) || this.inc === 3) {
    //   this.avancement = EStrategyAvancement.COMPLETED;
    // }

    // if (this.avancement === EStrategyAvancement.BEGIN || this.avancement === EStrategyAvancement.COMPLETED) {
    this.goal = graph.findBestGoal(pacman, facilitator);
    facilitator.updateGoal(pacman, this.goal);
    //   this.inc = 0;

    //   this.avancement = EStrategyAvancement.IN_PROGRESS;
    // }
  }

  public play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    // this.inc += 1;

    return this.computeMovement(pacman, graph, facilitator);
  }
}
