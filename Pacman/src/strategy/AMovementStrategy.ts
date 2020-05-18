import { AStrategy, Play, PlayType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { PacmanGraph } from "../board/PacmanGraph";
import { Facilitator } from "../Facilitator";
import { Goal } from "./Goal";

export abstract class AMovementStrategy extends AStrategy {
  public goal: Goal | null = null;

  protected computeMovement(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    if (!this.goal) throw new Error("No goal set on willPlay");

    let to = this.goal.path[2] ? graph.getByKey(this.goal.path[2]).position : this.goal.position;
    let opt = "COLLECTOR";

    if (!facilitator.shouldWait(graph, pacman, this.goal.path[0])) {
      facilitator.addMove(pacman, this.goal.path[0]);
    } else {
      // console.error("DEBUG:", "WAIT FOR", this.goal.path[0]);
      to = pacman.getPosition();
      opt = "WAIT";
    }

    return {
      type: PlayType.MOVE,
      param: {
        id: pacman.id,
        to,
        opt,
      },
    };
  }
}
