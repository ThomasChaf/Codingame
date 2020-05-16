import { PlayType, Play, EStrategyType, AStrategy } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph, Danger } from "../board/PacmanGraph";
import { getCounter } from "../utils/Weapon";

export class WarnStrategy extends AStrategy {
  type: EStrategyType = EStrategyType.WARN;
  danger?: Danger;

  update(danger: Danger) {
    this.danger = danger;
  }

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    if (!this.danger) throw "Warn has no danger";

    const weapon = getCounter(this.danger.weapon);

    return { type: PlayType.SWITCH, param: { id: pacman.id, weapon, opt: "WARN" } } as Play;
  }
}
