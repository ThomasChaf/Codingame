import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";
import { Facilitator } from "../Facilitator";

export class RandomStrategy extends AStrategy {
  public type: EStrategyType = EStrategyType.RANDOM;

  update(pacman: Pacman, graph: Graph) {}

  willPlay(pacman: Pacman, graph: Graph) {}

  play(pacman: Pacman, graph: Graph, facilitator: Facilitator): Play {
    return { type: PlayType.MOVE, param: { id: pacman.id, to: pacman.getPosition() } } as Play;
  }
}
