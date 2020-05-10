import { Position } from "../Position";
import { Graph, PacmanMeta } from "../board/Graph";

export interface PacmanProperties {
  fast: number;
  position: Position;
  abilityCooldown: number;
  weapon: string;
}

export abstract class APacman {
  protected position: Position;
  protected weapon: string;
  protected fast: number;
  protected abilityCooldown: number;
  public savedMoves: string[] = [];

  constructor(public id: number, properties: PacmanProperties) {
    this.abilityCooldown = properties.abilityCooldown;
    this.position = properties.position;
    this.fast = properties.fast;
    this.weapon = properties.weapon;
  }

  abstract toMeta(): PacmanMeta;

  computeMove(graph: Graph, newPostion: Position) {
    this.savedMoves = [];
    const from = this.position.asKey();
    const to = newPostion.asKey();

    if (from === to) return;

    this.savedMoves.push(to);

    const fromNode = graph.getByKey(from);
    if (fromNode.edges.includes(to)) return;

    for (const i in fromNode.edges) {
      const edgeKey = fromNode.edges[i];
      const nextNode = graph.getByKey(edgeKey);
      if (nextNode.edges.includes(to)) {
        this.savedMoves.push(edgeKey);
        return;
      }
    }
  }

  update(graph: Graph, properties: PacmanProperties) {
    this.computeMove(graph, properties.position);
    // console.error("DEBUG:", "MOVE [", this.savedMoves.join(","), "]");
    this.abilityCooldown = properties.abilityCooldown;
    this.position = properties.position;
  }

  getPosition(): Position {
    return this.position;
  }

  abilityAvailable(): boolean {
    return this.abilityCooldown === 0;
  }
}
