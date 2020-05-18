import { APacman } from "./APacman";
import { PacmanGraph, PacmanMeta } from "../board/PacmanGraph";
import { Play, PlayType, AStrategy, EStrategyType } from "../strategy/AStrategy";
import { CollectorStrategy } from "../strategy/CollectorStrategy";
import { SpeedStrategy } from "../strategy/SpeedStrategy";
import { RandomStrategy } from "../strategy/RandomStrategy";
import { Facilitator } from "../Facilitator";
import { ChompStrategy } from "../strategy/ChompStrategy";
import { isBestWeapon } from "../utils/Weapon";
import { Radar } from "../utils/Radar";
import { WarnStrategy } from "../strategy/WarnStrategy";
import { PelletManager } from "../utils/PelletManager";
import { Enemy } from "./Enemy";
import { Store } from "./Store";

export const PLAYS = {
  [PlayType.MOVE]: ({ id, to, opt }: any) => `${PlayType.MOVE} ${id} ${to.x} ${to.y} ${opt}`,
  [PlayType.SPEED]: ({ id, opt }: any) => `${PlayType.SPEED} ${id} ${opt}`,
  [PlayType.SWITCH]: ({ id, weapon, opt }: any) => `${PlayType.SWITCH} ${id} ${weapon} ${opt}`,
};

export class Pacman extends APacman {
  public readonly radar = new Radar();
  private strategy: AStrategy = new RandomStrategy();
  private strategies = {
    SPEED: new SpeedStrategy(),
    WARN: new WarnStrategy(),
    COLLECTOR: new CollectorStrategy(),
    CHOMP: new ChompStrategy(),
  };

  toMeta(): PacmanMeta {
    return {
      mine: true,
      id: this.id,
      weapon: this.weapon,
      position: this.getPosition(),
      isFast: this.fast > 0,
      abilityCooldown: this.abilityCooldown,
      abilityAvailable: this.abilityAvailable,
    };
  }

  faceStrongerOpponent = (other: PacmanMeta): boolean => {
    return isBestWeapon(other.weapon, this.weapon);
  };

  faceWeakerOpponent = (other: PacmanMeta): boolean => {
    return isBestWeapon(this.weapon, other.weapon);
  };

  willPlay(
    graph: PacmanGraph,
    facilitator: Facilitator,
    pelletManager: PelletManager,
    complete: number,
    enemies: Store<Enemy>
  ) {
    this.radar.update(this, graph);
    const { goal, target } = graph.analyse(this, facilitator, pelletManager, complete);

    this.strategies.COLLECTOR.update(goal);

    facilitator.updateGoal(this, goal);

    if (this.strategy.type === EStrategyType.CHOMP) {
      this.strategies.CHOMP.refresh(enemies);

      if (this.strategies.CHOMP.needToChomp(this)) return;
    }

    if (target) {
      this.strategies.CHOMP.update(target);
      this.strategy = this.strategies.CHOMP;
      return;
    }

    if (this.abilityAvailable) {
      const danger = this.radar.findUnevitableDanger(this, graph);
      if (danger) {
        this.strategies.WARN.update(danger);
        this.strategy = this.strategies.WARN;
        return;
      } else if (!this.radar.findDirectDanger(this, graph)) {
        this.strategy = this.strategies.SPEED;
        return;
      }
    }

    this.strategy = this.strategies.COLLECTOR;
    return;
  }

  play(graph: PacmanGraph, facilitator: Facilitator): string {
    const action: Play = this.strategy.play(this, graph, facilitator);

    return PLAYS[action.type](action.param);
  }
}
