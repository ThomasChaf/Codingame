import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { PacmanGraph } from "../board/PacmanGraph";
import { Facilitator } from "../Facilitator";

export class RandomStrategy extends AStrategy {
  public type: EStrategyType = EStrategyType.RANDOM;

  update(pacman: Pacman, graph: PacmanGraph) {}

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    return { type: PlayType.MOVE, param: { id: pacman.id, to: pacman.getPosition() } } as Play;
  }
}
