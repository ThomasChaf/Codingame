import { Pacman } from "../pacmans/Pacman";
import { PacmanGraph, Danger } from "../board/PacmanGraph";
import { GraphNode } from "../board/Graph";

export type PotentialDanger = {
  [pacId: string]: {
    danger: Danger;
    seenAt: number;
    around: string[];
  };
};

export class Radar {
  dangers: PotentialDanger = {};

  reset(pacId: number) {
    delete this.dangers[pacId];
  }

  isPacmanTrap(pacman: Pacman, graph: PacmanGraph, danger: Danger): boolean {
    const pacmanNode = graph.get(pacman.getPosition());

    if (pacmanNode.leaveMalus > 0) {
      const trapEnter = graph.getByKey(pacmanNode.closestNode as string);

      const d1 = graph.getDistance(pacman.getPosition(), trapEnter.position);
      const d2 = graph.getDistance(danger.position, trapEnter.position);

      if (d1 >= d2) return true;
    }
    return false;
  }

  findUnevitableDanger(pacman: Pacman, graph: PacmanGraph): Danger | null {
    const ids = Object.keys(this.dangers);

    for (const i in ids) {
      const { danger, seenAt } = this.dangers[ids[i]];
      if (this.isPacmanTrap(pacman, graph, danger)) {
        console.error("DEBUG SPOT BETTER ENNEMY", ids[i], "ON", danger.position.asKey());
        return danger;
      }
      if (
        pacman.faceStrongerOpponent(danger) &&
        danger.isFast &&
        !pacman.isFast &&
        seenAt < 3 &&
        graph.getDistance(pacman.getPosition(), danger.position) < 3
      ) {
        console.error("DEBUG SPOT BETTER ENNEMY", ids[i], "ON", danger.position.asKey());
        return danger;
      }
    }

    return null;
  }

  findDirectDanger(pacman: Pacman, graph: PacmanGraph) {
    const ids = Object.keys(this.dangers);

    for (const i in ids) {
      const { danger, seenAt } = this.dangers[ids[i]];
      if (pacman.faceStrongerOpponent(danger)) {
        if (this.isPacmanTrap(pacman, graph, danger)) {
          console.error("DEBUG SPOT DIRECT DANGER", ids[i], "ON", danger.position.asKey());
          return danger;
        }

        const distNeed = danger.isFast || (seenAt > 0 && danger.abilityAvailable) ? 2 : 1;

        if (graph.getDistance(pacman.getPosition(), danger.position) <= distNeed) {
          console.error("DEBUG SPOT DIRECT DANGER", ids[i], "ON", danger.position.asKey());
          return danger;
        }
      }
    }

    return null;
  }

  fearDanger<T>(pacman: Pacman, node: GraphNode<T>, pacmanNode: GraphNode<T>): boolean {
    const ids = Object.keys(this.dangers);

    for (const i in ids) {
      const { around, danger } = this.dangers[ids[i]];

      if (pacman.id === 0) {
        console.error(
          "DEBUG:",
          "FEAR DANGER:",
          pacman.faceStrongerOpponent(danger),
          around.includes(node.position.asKey()),
          ![node.position.asKey(), danger.position.asKey()].every((p: string) => pacmanNode.edges.includes(p))
        );
      }

      if (
        pacman.faceStrongerOpponent(danger) &&
        around.includes(node.position.asKey()) &&
        // Ensure PACMAN is not between danger and node else node is available to escape.
        ![node.position.asKey(), danger.position.asKey()].every((p: string) => pacmanNode.edges.includes(p))
      ) {
        console.error("DEBUG FEAR DANGER FROM", danger.id, "ON", node.position.asKey());
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
