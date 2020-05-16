import { APacman } from "./APacman";
import { PacmanGraph, PacmanMeta } from "../board/PacmanGraph";
import { Play, PlayType, AStrategy, EStrategyType } from "../strategy/AStrategy";
import { CollectorStrategy } from "../strategy/CollectorStrategy";
import { SpeedStrategy } from "../strategy/SpeedStrategy";
import { RandomStrategy } from "../strategy/RandomStrategy";
import { Facilitator } from "../Facilitator";
import { Position } from "../Position";
import { SurvivorStrategy } from "../strategy/SurvivorStrategy";
import { ChompStrategy } from "../strategy/ChompStrategy";
import { isBestWeapon } from "../utils/Weapon";
import { Radar } from "../utils/Radar";
import { WarnStrategy } from "../strategy/WarnStrategy";
import { PelletManager } from "../utils/PelletManager";

export const PLAYS = {
  [PlayType.MOVE]: ({ id, to, opt }: any) => `${PlayType.MOVE} ${id} ${to.x} ${to.y} ${opt}`,
  [PlayType.SPEED]: ({ id, opt }: any) => `${PlayType.SPEED} ${id} ${opt}`,
  [PlayType.SWITCH]: ({ id, weapon, opt }: any) => `${PlayType.SWITCH} ${id} ${weapon} ${opt}`,
};

export class Pacman extends APacman {
  public readonly radar = new Radar();
  private prevPostion: Position = new Position(-1, -1);
  private strategy: AStrategy = new RandomStrategy();
  private strategies = {
    SPEED: new SpeedStrategy(),
    WARN: new WarnStrategy(),
    COLLECTOR: new CollectorStrategy(),
    SURVIVOR: new SurvivorStrategy(),
    CHOMP: new ChompStrategy(),
  };

  toMeta(): PacmanMeta {
    return {
      mine: true,
      id: this.id,
      weapon: this.weapon,
      position: this.getPosition(),
      abilityAvailable: this.abilityAvailable(),
    };
  }

  faceStrongerOpponent = (other: PacmanMeta): boolean => {
    return isBestWeapon(other.weapon, this.weapon);
  };

  faceWeakerOpponent = (other: PacmanMeta): boolean => {
    return isBestWeapon(this.weapon, other.weapon) && !other.abilityAvailable;
  };

  selectStrategy(): AStrategy {
    // const target = this.radar.findDanger();

    if (this.prevPostion.sameAs(this.position)) {
      return this.strategies.SURVIVOR;
    }
    // if (target) {
    // if (this.faceWeakerOpponent(target)) {
    //   this.strategies.CHOMP.update(target);
    //   return this.strategies.CHOMP;
    // } else if (this.faceStrongerOpponent(target)) {
    //   this.strategies.SURVIVOR.update(target);
    //   return this.strategies.SURVIVOR;
    // }
    // }

    // 1) Si je spot un ennemy dans une feuille
    // - si je suis meilleur et qu il est sans cc => CHOMP

    // 1) Si j'ai le CC dispo
    // - si j'ai un gars a cote avec le CC dispo mais je suis meilleur => COLLECTOR
    // - si j'ai un gars a cote sans le CC dispo mais que je suis even => WARN
    // - speed

    // 1) Collector

    if (this.abilityAvailable()) {
      const danger = this.radar.spotCloseMysteriousEnnemy(this);
      if (danger) {
        if (!this.faceStrongerOpponent(danger)) {
          return this.strategies.COLLECTOR;
        } else {
          this.strategies.WARN.update(danger);
          return this.strategies.WARN;
        }
      }
      return this.strategies.SPEED;
    } else {
      return this.strategies.COLLECTOR;
    }
  }

  willPlay(graph: PacmanGraph, facilitator: Facilitator, pelletManager: PelletManager, complete: number) {
    this.radar.update(this, graph);

    this.strategies.COLLECTOR.update(this, graph, facilitator, pelletManager, complete);

    this.strategy = this.selectStrategy();
  }

  play(graph: PacmanGraph, facilitator: Facilitator): string {
    const action: Play = this.strategy.play(this, graph, facilitator);

    if (action.type === PlayType.MOVE && action.param.to.sameAs(this.position)) {
      this.prevPostion = this.position;
    } else {
      this.prevPostion = new Position(-1, -1);
    }

    return PLAYS[action.type](action.param);
  }
}
