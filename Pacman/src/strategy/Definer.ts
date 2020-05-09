import { AStrategy } from "./AStrategy";
import { CollectorStrategy } from "./S_Collector";
import { EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";
import { Enemy } from "../pacmans/Enemy";

export class StrategyDefiner {
  private state: EStrategyType = EStrategyType.UNDEFINED;

  select(pacman: Pacman, graph: Graph): AStrategy {
    this.state = EStrategyType.COLLECTOR;
    return new CollectorStrategy(pacman, graph);
  }
}
