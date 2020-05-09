import { APacman } from "./APacman";
import { Graph } from "../board/Graph";
import { Play, PlayType, AStrategy } from "../strategy/AStrategy";
import { CollectorStrategy } from "../strategy/CollectorStrategy";
import { SpeedStrategy } from "../strategy/SpeedStrategy";

export const PLAYS = {
  [PlayType.MOVE]: ({ id, goal }: any) => `${PlayType.MOVE} ${id} ${goal.x} ${goal.y}`,
  [PlayType.SPEED]: ({ id }: any) => `${PlayType.SPEED} ${id}`,
};

export class Pacman extends APacman {
  private strategy: AStrategy = {} as AStrategy;
  private strategies = {
    SPEED: new SpeedStrategy(),
    COLLECTOR: new CollectorStrategy(),
  };

  selectStrategy(pacman: Pacman): AStrategy {
    if (pacman.abilityAvailable()) {
      return this.strategies.SPEED;
    } else {
      return this.strategies.COLLECTOR;
    }
  }

  willPlay(graph: Graph) {
    graph.updateNode(this.getPosition().asKey(), 0);

    this.strategy = this.selectStrategy(this);

    this.strategy.willPlay(this, graph);
  }

  play(): string {
    const action: Play = this.strategy.play(this);

    return PLAYS[action.type](action.param);
  }
}
