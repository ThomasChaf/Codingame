import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph, Danger } from "../board/PacmanGraph";

export class ChompStrategy extends AStrategy {
  private target: Danger | null = null;
  public type: EStrategyType = EStrategyType.CHOMP;

  update(target: Danger) {
    this.target = target;
  }

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    if (!this.target) throw "No target for chomp";

    return { type: PlayType.MOVE, param: { id: pacman.id, to: this.target.position, opt: "CHOMP" } } as Play;
  }
}
