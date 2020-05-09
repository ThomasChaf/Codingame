import { APacman, Store } from "./APacman";
import { Graph } from "../board/Graph";
import { AStrategy, Play, PlayType } from "../strategy/AStrategy";
import { StrategyDefiner } from "../strategy/Definer";
import { Enemy } from "./Enemy";

export const PLAYS = {
  [PlayType.MOVE]: ({ id, goal }: any) => `${PlayType.MOVE} ${id} ${goal.x} ${goal.y}`,
};

export class Pacman extends APacman {
  private strategy: AStrategy | null = null;
  private strategyDefiner: StrategyDefiner = new StrategyDefiner();

  willPlay(graph: Graph, myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    graph.updateNode(this.getPosition().asKey(), 0);

    if (!this.strategy) {
      this.strategy = this.strategyDefiner.select(this, graph, myPacman, enemies);
    }

    this.strategy.willPlay(this, graph, myPacman, enemies);
  }

  play(): string {
    if (!this.strategy) throw new Error("No strategy defined");

    const action: Play = this.strategy.play(this);

    return PLAYS[action.type](action.param);
  }
}
