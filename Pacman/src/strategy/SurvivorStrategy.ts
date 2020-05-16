import { PlayType, Play, EStrategyType, AStrategy } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph, Danger } from "../board/PacmanGraph";
import { getCounter } from "../utils/Weapon";

export class SurvivorStrategy extends AStrategy {
  public type: EStrategyType = EStrategyType.SURVIVOR;

  // switch(pacman: Pacman, graph: PacmanGraph): Play {
  //   if (!this.danger) throw "No danger on survivor";

  //   const weapon = getCounter(this.danger.weapon);

  //   return { type: PlayType.SWITCH, param: { id: pacman.id, weapon, opt: "SWITCH" } } as Play;
  // }

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    return { type: PlayType.MOVE, param: { id: pacman.id, to: pacman.getPosition(), opt: "WTF?" } } as Play;
  }
}
