import { Graph, PacmanMeta } from "../board/Graph";
import { APacman } from "./APacman";

export class Enemy extends APacman {
  toMeta(): PacmanMeta {
    return { mine: false, id: this.id, weapon: this.weapon };
  }

  willPlay(graph: Graph) {
    graph.updateNode(this.getPosition().asKey(), 0);
  }
}
