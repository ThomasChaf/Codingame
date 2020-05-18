import { Graph, GraphNode } from "./Graph";
import { Pacman } from "../pacmans/Pacman";
import { Enemy } from "../pacmans/Enemy";
import { Store } from "../pacmans/Store";
import { Position, DIRECTIONS, sameDirection } from "../Position";
import { Goal } from "../strategy/Goal";
import { EWeapon, isEatable } from "../utils/Weapon";
import { Facilitator } from "../Facilitator";
import { PelletManager } from "../utils/PelletManager";

export type PacmanMeta = {
  mine: boolean;
  id: number;
  weapon: EWeapon;
  position: Position;
  isFast: boolean;
  abilityCooldown: number;
  abilityAvailable: boolean;
};

export type Danger = PacmanMeta;

export type AnalyseResult = {
  goal: Goal;
  target: Danger | null;
};

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

  analyse(pacman: Pacman, facilitator: Facilitator, pelletManager: PelletManager, complete: number): AnalyseResult {
    let goal: Goal = new Goal([], 0, pacman.getPosition());
    let target: Danger | null = null;
    const pacmanNode = this.get(pacman.getPosition());

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (depth <= 2 && pacman.radar.fearDanger(pacman, node, pacmanNode)) {
        return { end: true };
      }
      const meta = node.getMeta();
      if (meta) {
        if (isEatable(pacman, meta, this)) {
          console.error("DEBUG:", "FIND AN EATABLE TARGET on:", meta.id);
          target = meta;
        } else if (meta.mine || !pacman.faceWeakerOpponent(meta)) {
          return { end: true };
        }
      }
      const { score: prevScore = 0 } = keep || {};

      const value = facilitator.isAvailable(pacman, node.key) ? node.value : node.value / 2;
      const visibleBonus = pelletManager.isVisible(node.key) ? 3 : 1;

      const score =
        complete > 70
          ? Math.min(prevScore, 110) + (20 - depth) * value * visibleBonus
          : Math.min(prevScore, 150) + (20 - depth - node.leaveMalus) * value;

      if (pacman.id === 0) {
        console.error("DEBUG DONE:", node.key, score, complete, prevScore);
      }

      if (goal.score < score) {
        goal = new Goal([...path, node.key], score, node.position);
      }

      return {
        keep: { score },
        end: false,
      };
    };

    this.traverse(pacman.getPosition(), 20, callback);

    console.error("DEBUG:", "NEW GOAL:", pacman.id, goal.position.asKey(), goal.score, goal.path.join("|"));
    return { goal, target };
  }

  findEnemiesAround(pacman: Pacman): Danger[] {
    const dangers: Danger[] = [];

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (node.meta && !node.meta.mine) {
        if (depth < 3 || node.meta.isFast) dangers.push(node.meta);
        return { end: true };
      }

      return { end: false };
    };

    this.traverse(pacman.getPosition(), 4, callback);

    return dangers;
  }

  findSafePosition(pacman: Pacman, danger: Danger): Position {
    let safePosition = pacman.getPosition();

    const callback = (depth: number, node: GraphNode<PacmanMeta>, keep: any, path: string[]) => {
      if (node.meta && !node.meta.mine) return { end: true };

      if (sameDirection(node.position, danger.position, pacman.getPosition())) {
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
