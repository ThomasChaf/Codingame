import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";
import { Facilitator } from "../Facilitator";

type Danger = {} | null;

export class SurvivorStrategy extends AStrategy {
  private danger: Danger = null;
  public type: EStrategyType = EStrategyType.SURVIVOR;

  hasDanger(): boolean {
    return this.danger !== null;
  }

  update(pacman: Pacman, graph: Graph) {
    this.danger = null;

    // TODO HORRIBLE
    // if (!pacman.abilityAvailable()) return;

    // const currentKey = pacman.getPosition().asKey();
    // const currentNode = graph.getByKey(currentKey);
    // currentNode.edges.forEach((edgeKey: string) => {
    //   const nextNode = graph.getByKey(edgeKey);
    //   if (nextNode)
    // })
  }

  willPlay(pacman: Pacman, graph: Graph) {}

  play(pacman: Pacman, graph: Graph, facilitator: Facilitator): Play {
    return { type: PlayType.MOVE, param: { id: pacman.id, to: pacman.getPosition() } } as Play;
  }
}
