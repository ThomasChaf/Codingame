import { Position } from "../Position";
import { PacmanGraph, PacmanMeta } from "../board/PacmanGraph";
import { EWeapon } from "../utils/Weapon";

export interface PacmanProperties {
  fast: number;
  position: Position;
  abilityCooldown: number;
  weapon: EWeapon;
}

export abstract class APacman {
  protected position: Position;
  protected weapon: EWeapon;
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

  computeMove(graph: PacmanGraph, newPostion: Position) {
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

  update(graph: PacmanGraph, properties: PacmanProperties) {
    this.computeMove(graph, properties.position);
    this.abilityCooldown = properties.abilityCooldown;
    this.position = properties.position;
    this.fast = properties.fast;
    this.weapon = properties.weapon;
  }

  getPosition(): Position {
    return this.position;
  }

  abilityAvailable(): boolean {
    return this.abilityCooldown === 0;
  }
}
