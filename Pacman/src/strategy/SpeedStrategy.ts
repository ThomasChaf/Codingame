import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Graph } from "../board/Graph";

export class SpeedStrategy extends AStrategy {
  public type: EStrategyType = EStrategyType.SPEED;

  play(pacman: Pacman): Play {
    return { type: PlayType.SPEED, param: { id: pacman.id } } as Play;
  }

  willPlay(pacman: Pacman, graph: Graph) {}
}
