import { Graph, GraphNode } from "./Graph";
import { Pacman } from "../pacmans/Pacman";
import { Enemy } from "../pacmans/Enemy";
import { Store } from "../pacmans/Store";
import { Position } from "../Position";
import { Goal } from "../strategy/GoalStrategy";
import { EWeapon } from "../utils/Weapon";

export type PacmanMeta = {
  mine: boolean;
  id: number;
  weapon: EWeapon;
} | null;

export type Danger = PacmanMeta;

export class PacmanGraph extends Graph<PacmanMeta> {
  addEntities(myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    myPacman.forEach((pacman) => {
      this.nodes[pacman.getPosition().asKey()].setMeta(pacman.toMeta());
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].setMeta(enemy.toMeta());
    });
  }

  cleanEntities(myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    myPacman.forEach((pacman) => {
      this.nodes[pacman.getPosition().asKey()].setMeta(null);
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].setMeta(null);
    });
  }

  findBestGoal(pacman: Pacman): Goal {
    let result: Goal = {
      score: 0,
      path: [],
      position: new Position(17, 5),
    };

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (node.hasObstacle()) return { end: true };
      const { score: prevScore = 0 } = keep || {};

      const score = Math.max(prevScore - 10 * depth, 0) + (20 - depth) * node.value;

      if (result.score < score) {
        result = {
          score,
          path: [...path, node.key],
          position: node.position,
        };
      }
      // console.error("DEBUG:", "DONE:", pacman.id, node.position.asKey(), total);

      return {
        keep: { score },
        end: false,
      };
    };

    this.traverse(pacman.getPosition(), 20, callback);

    console.error("DEBUG:", "NEW GOAL:", pacman.id, result.position.asKey(), result.score);
    // console.error("DEBUG:", "NEW PATH", result.path.join("|"));
    return result;
  }

  findDangerAround(pacman: Pacman): Danger[] {
    let dangers: Danger[] = [];

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (!pacman.faceWeakerOpponent(node.meta)) {
        dangers.push(node.meta);
      }

      return { end: false };
    };

    this.traverse(pacman.getPosition(), 2, callback);

    return dangers;
  }
}
