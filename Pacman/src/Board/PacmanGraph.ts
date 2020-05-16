import { Graph, GraphNode } from "./Graph";
import { Pacman } from "../pacmans/Pacman";
import { Enemy } from "../pacmans/Enemy";
import { Store } from "../pacmans/Store";
import { Position, DIRECTIONS, sameDirection } from "../Position";
import { Goal } from "../strategy/Goal";
import { EWeapon } from "../utils/Weapon";
import { Facilitator } from "../Facilitator";
import { PelletManager } from "../utils/PelletManager";

export type PacmanMeta = {
  mine: boolean;
  id: number;
  weapon: EWeapon;
  position: Position;
  abilityAvailable: boolean;
};

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

  findBestGoal(pacman: Pacman, facilitator: Facilitator, pelletManager: PelletManager, complete: number): Goal {
    let result: Goal = new Goal([], 0, new Position(17, 5));

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (depth === 2) {
        if (pacman.radar.fearDanger(pacman, node.position)) return { end: true };
      }
      if (node.getMeta()) return { end: true };
      const { score: prevScore = 0 } = keep || {};

      const value = facilitator.isAvailable(pacman, node.key) ? node.value : 0;
      const visibleBonus = pelletManager.isVisible(node.key) ? 3 : 1;

      const score =
        complete > 73
          ? Math.min(prevScore, 40) + (20 - depth) * value * visibleBonus
          : Math.min(prevScore, 110) + (20 - depth - node.leaveMalus) * value;

      // if (score > 50) console.error("DEBUG:", "DONE:", pacman.id, node.key, score);

      if (result.score < score) {
        result = new Goal([...path, node.key], score, node.position);
      }

      return {
        keep: { score },
        end: false,
      };
    };

    this.traverse(pacman.getPosition(), 20, callback);

    console.error("DEBUG:", "NEW GOAL:", pacman.id, result.position.asKey(), result.score, result.path.join("|"));
    return result;
  }

  findEnemiesAround(pacman: Pacman): Danger[] {
    const dangers: Danger[] = [];

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (node.meta && !node.meta.mine) {
        dangers.push(node.meta);
        return { end: true };
      }

      return { end: false };
    };

    this.traverse(pacman.getPosition(), 3, callback);

    return dangers;
  }

  findSafePosition(pacman: Pacman, danger: Danger): Position {
    let safePosition = pacman.getPosition();

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (node.meta && !node.meta.mine) return { end: true };

      if (sameDirection(node.position, danger.position, pacman.getPosition())) {
        console.error("DEBUG:", "HELP SAME DIRECTION FOR NODE", node.key, "AS DANGER:", danger.position.asKey());
        return { end: true };
      }

      if (depth === 4 && !node.meta) {
        safePosition = node.position;
      }

      return { end: false };
    };

    this.traverse(pacman.getPosition(), 5, callback);

    return safePosition;
  }

  getVisibility(pacman: Pacman): string[] {
    const visibility: { [key: string]: boolean } = {};

    DIRECTIONS.forEach(([incX, incY]) => {
      this.straightTraverse(pacman.getPosition(), incX, incY, (depth, node) => {
        visibility[node.key] = true;

        return { end: false };
      });
    });

    return Object.keys(visibility);
  }
}
