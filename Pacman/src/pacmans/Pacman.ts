import { APacman } from "./APacman";
import { PacmanGraph, PacmanMeta, Danger } from "../board/PacmanGraph";
import { Play, PlayType, AStrategy, EStrategyType, EStrategyAvancement } from "../strategy/AStrategy";
import { CollectorStrategy } from "../strategy/CollectorStrategy";
import { SpeedStrategy } from "../strategy/SpeedStrategy";
import { RandomStrategy } from "../strategy/RandomStrategy";
import { Facilitator } from "../Facilitator";
import { SurvivorStrategy } from "../strategy/SurvivorStrategy";
import { ChompStrategy } from "../strategy/ChompStrategy";
import { isBestWeapon, getCounter } from "../utils/Weapon";
import { Radar } from "../utils/Radar";
import { Goal } from "../strategy/Goal";
import { WarnStrategy } from "../strategy/WarnStrategy";

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
    SURVIVOR: new SurvivorStrategy(),
    CHOMP: new ChompStrategy(),
  };

  toMeta(): PacmanMeta {
    return { mine: true, id: this.id, weapon: this.weapon, position: this.getPosition() };
  }

  faceStrongerOpponent = (other: PacmanMeta): boolean => {
    return isBestWeapon(other.weapon, this.weapon);
  };

  faceWeakerOpponent = (other: PacmanMeta): boolean => {
    return isBestWeapon(this.weapon, other.weapon);
  };

  selectStrategy(): AStrategy {
    const target = this.radar.findDanger();

    if (target) {
      if (this.faceWeakerOpponent(target)) {
        this.strategies.CHOMP.update(target);
        return this.strategies.CHOMP;
      } else if (this.faceStrongerOpponent(target)) {
        this.strategies.SURVIVOR.update(target);
        return this.strategies.SURVIVOR;
      }
    }

    if (this.abilityAvailable()) {
      if (this.radar.history && getCounter(this.radar.history.danger.weapon) !== this.weapon) {
        return this.strategies.WARN;
      }

      return this.strategies.SPEED;
    } else {
      return this.strategies.COLLECTOR;
    }
  }

  willPlay(graph: PacmanGraph, facilitator: Facilitator) {
    this.radar.update(this, graph);

    this.strategies.COLLECTOR.update(this, graph, facilitator);

    this.strategy = this.selectStrategy();
  }

  play(graph: PacmanGraph, facilitator: Facilitator): string {
    const action: Play = this.strategy.play(this, graph, facilitator);

    return PLAYS[action.type](action.param);
  }

  didPlay() {
    // if (this.strategy.type === EStrategyType.SURVIVOR && this.strategies.SURVIVOR.hasEscaped) {
    //   this.strategies.COLLECTOR.avancement = EStrategyAvancement.COMPLETED;
    // }
  }
}
