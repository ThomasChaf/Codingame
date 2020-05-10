import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph, Danger } from "../board/PacmanGraph";
import { getCounter } from "../utils/Weapon";

export class SurvivorStrategy extends AStrategy {
  private dangers: Danger[] = [];
  public type: EStrategyType = EStrategyType.SURVIVOR;

  hasDanger(): boolean {
    return this.dangers.length > 0;
  }

  update(pacman: Pacman, graph: PacmanGraph) {
    this.dangers = graph.findDangerAround(pacman);
  }

  willPlay(pacman: Pacman, graph: PacmanGraph) {}

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    const danger = this.dangers[0];
    if (!danger) throw "No danger on survivor";

    const weapon = getCounter(danger.weapon);

    return { type: PlayType.SWITCH, param: { id: pacman.id, weapon } } as Play;
  }
}
