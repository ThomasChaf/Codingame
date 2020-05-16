import { Pacman } from "../pacmans/Pacman";
import { Position } from "../Position";
import { PacmanGraph, Danger, PacmanMeta } from "../board/PacmanGraph";

export type PotentialDanger = {
  [pacId: string]: {
    danger: Danger;
    seenAt: number;
    around: string[];
  };
};

export class Radar {
  dangers: PotentialDanger = {};

  spotCloseMysteriousEnnemy(pacman: Pacman): Danger | null {
    const ids = Object.keys(this.dangers);
    const posKey = pacman.getPosition().asKey();

    for (const i in ids) {
      const danger = this.dangers[ids[i]];
      if (danger.around.includes(posKey) && danger.danger.abilityAvailable) {
        console.error("DEBUG SPOT MYSTERIOUS ENNEMY", ids[i], "ON", posKey);
        return danger.danger;
      }
    }

    return null;
  }

  fearDanger(pacman: Pacman, position: Position): boolean {
    const ids = Object.keys(this.dangers);

    for (const i in ids) {
      const id = ids[i];
      if (pacman.faceStrongerOpponent(this.dangers[id].danger) && this.dangers[id].around.includes(position.asKey())) {
        console.error("DEBUG FEAR DANGER FROM", id, "ON", position.asKey());
        return true;
      }
    }

    return false;
  }

  update(pacman: Pacman, graph: PacmanGraph) {
    Object.keys(this.dangers).forEach((pacId: string) => {
      this.dangers[pacId].seenAt += 1;

      if (this.dangers[pacId].seenAt > 5) delete this.dangers[pacId];
    });

    graph.findEnemiesAround(pacman).forEach((danger: Danger) => {
      const around: string[] = [];

      graph.get(danger.position).edges.forEach((key: string) => {
        around.push(key, ...graph.getByKey(key).edges);
      });

      this.dangers[danger.id] = {
        danger,
        seenAt: 0,
        around,
      };
    });
  }
}
