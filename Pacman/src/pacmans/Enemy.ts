import { Graph } from "../board/Graph";
import { APacman } from "./APacman";

export class Enemy extends APacman {
  willPlay(graph: Graph) {
    graph.updateNode(this.getPosition().asKey(), 0);
  }
}
