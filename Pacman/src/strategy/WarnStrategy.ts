import { PlayType, Play, EStrategyType, AStrategy } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph } from "../board/PacmanGraph";
import { getCounter } from "../utils/Weapon";
import { PotentialDanger } from "../utils/Radar";

export class WarnStrategy extends AStrategy {
  type: EStrategyType = EStrategyType.WARN;

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    const target = (pacman.radar.history as PotentialDanger).danger;
    const weapon = getCounter(target.weapon);

    return { type: PlayType.SWITCH, param: { id: pacman.id, weapon, opt: "WARN" } } as Play;
  }
}
