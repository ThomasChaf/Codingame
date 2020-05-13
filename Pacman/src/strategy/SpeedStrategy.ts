import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { PacmanGraph } from "../board/PacmanGraph";
import { Facilitator } from "../Facilitator";

export class SpeedStrategy extends AStrategy {
  public type: EStrategyType = EStrategyType.SPEED;

  update(pacman: Pacman, graph: PacmanGraph) {}

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    return { type: PlayType.SPEED, param: { id: pacman.id, opt: "SPEED" } } as Play;
  }
}
