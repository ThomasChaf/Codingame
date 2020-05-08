import { APacman } from "./APacman";
import { Graph } from "../board/Graph";
import { AStrategy, Action, ActionType } from "../strategy/AStrategy";
import { StrategyDefiner } from "../strategy/Definer";

export const ACTIONS = {
  [ActionType.MOVE]: ({ id, goal }: any) => console.log(`${ActionType.MOVE} ${id} ${goal.x} ${goal.y}`),
};

export class Pacman extends APacman {
  private strategy: AStrategy | null = null;
  private strategyDefiner: StrategyDefiner = new StrategyDefiner();

  willPlay(graph: Graph) {
    graph.updateNode(this.getPosition().asKey(), 0);

    if (!this.strategy) {
      this.strategy = this.strategyDefiner.select(this, graph);
    }
    this.strategy.computeRound(this, graph);
  }

  play() {
    if (!this.strategy) throw new Error("No strategy defined");

    const action: Action = this.strategy.computeAction(this);

    ACTIONS[action.type](action.param);
  }
}
