import { APacman } from "./APacman";
import { PacmanGraph, PacmanMeta } from "../board/PacmanGraph";
import { Play, PlayType, AStrategy } from "../strategy/AStrategy";
import { CollectorStrategy } from "../strategy/CollectorStrategy";
import { SpeedStrategy } from "../strategy/SpeedStrategy";
import { RandomStrategy } from "../strategy/RandomStrategy";
import { Facilitator } from "../Facilitator";
import { SurvivorStrategy } from "../strategy/SurvivorStrategy";
import { isBestWeapon } from "../utils/Weapon";

export const PLAYS = {
  [PlayType.MOVE]: ({ id, to, opt = "" }: any) => `${PlayType.MOVE} ${id} ${to.x} ${to.y}${opt}`,
  [PlayType.SPEED]: ({ id }: any) => `${PlayType.SPEED} ${id}`,
  [PlayType.SWITCH]: ({ id, weapon }: any) => `${PlayType.SWITCH} ${id} ${weapon} SWITCH`,
};

export class Pacman extends APacman {
  private strategy: AStrategy = new RandomStrategy();
  private strategies = {
    SPEED: new SpeedStrategy(),
    COLLECTOR: new CollectorStrategy(),
    SURVIVOR: new SurvivorStrategy(),
  };

  toMeta(): PacmanMeta {
    return { mine: true, id: this.id, weapon: this.weapon };
  }

  faceWeakerOpponent = (other: PacmanMeta): boolean => {
    if (!other || other.mine) return true;

    return isBestWeapon(this.weapon, other.weapon);
  };

  selectStrategy(): AStrategy {
    if (this.abilityAvailable()) {
      if (this.strategies.SURVIVOR.hasDanger()) {
        console.error("DEBUG:", "SURVIVOR ON", this.id);
        return this.strategies.SURVIVOR;
      }
      return this.strategies.SPEED;
    } else {
      return this.strategies.COLLECTOR;
    }
  }

  willPlay(graph: PacmanGraph) {
    this.savedMoves.forEach((move) => graph.updateNode(move, 0));

    this.strategies.COLLECTOR.update(this, graph);
    this.strategies.SURVIVOR.update(this, graph);

    this.strategy = this.selectStrategy();

    this.strategy.willPlay(this, graph);
  }

  play(graph: PacmanGraph, facilitator: Facilitator): string {
    const action: Play = this.strategy.play(this, graph, facilitator);

    return PLAYS[action.type](action.param);
  }
}
