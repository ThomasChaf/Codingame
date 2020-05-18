import { Position } from "../Position";
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
    const danger: Danger = this.danger as Danger;

    let res: Position = pacman.getPosition();
    let dist = graph.getDistance(pacman.getPosition(), danger.position);

    graph.traverse(pacman.getPosition(), 5, (depth, node) => {
      const nextDist = graph.getDistance(node.position, danger.position);
      if (node.meta) {
        return { end: true };
      }
      if (nextDist > dist) {
        res = node.position;
        dist = nextDist;
      }
      return { end: false };
    });

    const safeDist = danger.isFast ? 2 : 1;

    if (dist > safeDist) {
      return { type: PlayType.MOVE, param: { id: pacman.id, to: res, opt: "WARN" } } as Play;
    }

    const weapon = getCounter(danger.weapon);

    return { type: PlayType.SWITCH, param: { id: pacman.id, weapon, opt: "WARN" } } as Play;
  }
}
