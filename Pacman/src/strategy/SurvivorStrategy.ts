import { PlayType, Play, EStrategyType, AStrategy } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph, Danger } from "../board/PacmanGraph";
import { getCounter } from "../utils/Weapon";
import { Goal } from "./Goal";
import { AMovementStrategy } from "./AMovementStrategy";

export class SurvivorStrategy extends AStrategy {
  // public hasEscaped: boolean = false;
  private danger: Danger | null = null;
  public type: EStrategyType = EStrategyType.SURVIVOR;

  update(target: Danger) {
    this.danger = target;
  }

  escape(pacman: Pacman, graph: PacmanGraph): Play {
    if (!this.danger) throw "No danger on survivor";

    const position = graph.findSafePosition(pacman, this.danger);
    pacman.radar.setEscapeFrom(pacman.getPosition());

    return { type: PlayType.MOVE, param: { id: pacman.id, to: position, opt: "HELP" } } as Play;
  }

  switch(pacman: Pacman, graph: PacmanGraph): Play {
    if (!this.danger) throw "No danger on survivor";

    const weapon = getCounter(this.danger.weapon);

    return { type: PlayType.SWITCH, param: { id: pacman.id, weapon, opt: "SWITCH" } } as Play;
  }

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    if (!this.danger) throw "No danger on survivor";

    if (pacman.abilityAvailable()) {
      return this.switch(pacman, graph);
    }
    return this.escape(pacman, graph);
  }
}
