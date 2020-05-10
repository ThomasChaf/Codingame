import { APacman } from "./APacman";
import { Graph } from "../board/Graph";
import { Play, PlayType, AStrategy } from "../strategy/AStrategy";
import { CollectorStrategy } from "../strategy/CollectorStrategy";
import { SpeedStrategy } from "../strategy/SpeedStrategy";
import { Facilitator } from "../Facilitator";

export const PLAYS = {
  [PlayType.MOVE]: ({ id, to, opt = "" }: any) => `${PlayType.MOVE} ${id} ${to.x} ${to.y}${opt}`,
  [PlayType.SPEED]: ({ id }: any) => `${PlayType.SPEED} ${id}`,
};

export class Pacman extends APacman {
  private strategy: AStrategy = {} as AStrategy;
  private strategies = {
    SPEED: new SpeedStrategy(),
    COLLECTOR: new CollectorStrategy(),
  };
  private fast = 0;

  isFast(): boolean {
    return this.fast > 0;
  }

  selectStrategy(pacman: Pacman): AStrategy {
    if (pacman.abilityAvailable()) {
      return this.strategies.SPEED;
    } else {
      return this.strategies.COLLECTOR;
    }
  }

  willPlay(graph: Graph) {
    this.savedMoves.forEach((move) => {
      graph.updateNode(move, 0);
    });

    this.strategy = this.selectStrategy(this);

    this.strategy.willPlay(this, graph);
  }

  play(graph: Graph, facilitator: Facilitator): string {
    const action: Play = this.strategy.play(this, graph, facilitator);

    if (action.type === PlayType.SPEED) {
      this.fast = 5;
    } else if (this.fast > 0) {
      this.fast -= 1;
    }

    return PLAYS[action.type](action.param);
  }
}
