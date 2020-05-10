import { PacmanGraph, PacmanMeta } from "../board/PacmanGraph";
import { APacman } from "./APacman";

export class Enemy extends APacman {
  toMeta(): PacmanMeta {
    return { mine: false, id: this.id, weapon: this.weapon };
  }

  willPlay(graph: PacmanGraph) {
    graph.updateNode(this.getPosition().asKey(), 0);
  }
}
