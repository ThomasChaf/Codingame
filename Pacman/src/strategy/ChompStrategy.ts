import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph, Danger } from "../board/PacmanGraph";
import { getCounter } from "../utils/Weapon";
import { Store } from "../pacmans/Store";
import { Enemy } from "../pacmans/Enemy";

export class ChompStrategy extends AStrategy {
  private target: Danger | null = null;
  private isWaiting: boolean = false;
  public type: EStrategyType = EStrategyType.CHOMP;

  update(target: Danger) {
    this.target = target;
  }

  public needToChomp(pacman: Pacman) {
    if (!this.target) throw "No target for chomp";

    return !this.target.position.sameAs(pacman.getPosition());
  }

  refresh(ennemies: Store<Enemy>) {
    if (!this.target) throw "No target for chomp";

    const enemy = ennemies.get(this.target.id);

    if (enemy) {
      this.target = enemy.toMeta();
    }
  }

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    if (!this.target) throw "No target for chomp";

    if (this.isWaiting && !pacman.faceWeakerOpponent(this.target)) {
      const weapon = getCounter(this.target.weapon);

      this.isWaiting = false;

      return { type: PlayType.SWITCH, param: { id: pacman.id, weapon, opt: "CHOMP" } } as Play;
    }

    if (this.target.abilityAvailable) {
      this.isWaiting = true;
      return { type: PlayType.MOVE, param: { id: pacman.id, to: pacman.getPosition(), opt: "CHOMP" } } as Play;
    }

    this.isWaiting = false;
    return { type: PlayType.MOVE, param: { id: pacman.id, to: this.target.position, opt: "CHOMP" } } as Play;
  }
}
