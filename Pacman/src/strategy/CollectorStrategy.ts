import { PacmanGraph } from "../board/PacmanGraph";
import { PlayType, Play, EStrategyAvancement, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { GoalStrategy } from "./GoalStrategy";

export class CollectorStrategy extends GoalStrategy {
  public type: EStrategyType = EStrategyType.COLLECTOR;

  update(pacman: Pacman, graph: PacmanGraph) {
    if (this.avancement === EStrategyAvancement.IN_PROGRESS) {
      this.updateGoal(pacman);
    }
  }

  willPlay(pacman: Pacman, graph: PacmanGraph) {
    if (!this.goal || pacman.getPosition().sameAs(this.goal.position)) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }

    if (this.avancement === EStrategyAvancement.COMPLETED) {
      this.goal = graph.findBestGoal(pacman);
      this.avancement = EStrategyAvancement.IN_PROGRESS;
    } else if (this.avancement === EStrategyAvancement.IN_PROGRESS) {
      const hasTrouble = this.isGoalDangerous(pacman, graph);
      if (hasTrouble) {
        this.goal = graph.findBestGoal(pacman);
      }
    }
  }

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    if (!this.goal) throw new Error("No goal set on willPlay");

    let to = this.goal.path[2] ? graph.getByKey(this.goal.path[2]).position : this.goal.position;
    let opt = "";

    if (!facilitator.shouldWait(this.goal.path[0])) {
      facilitator.addMove(this.goal.path[0]);
    } else {
      to = pacman.getPosition();
      opt = " WAIT";
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
