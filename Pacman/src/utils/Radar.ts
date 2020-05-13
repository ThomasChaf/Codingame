import { Pacman } from "../pacmans/Pacman";
import { Position } from "../Position";
import { PacmanGraph, Danger, PacmanMeta } from "../board/PacmanGraph";

export type PotentialDanger = {
  danger: Danger;
  seenAt: number;
};

export class Radar {
  escapeFrom: Position | null = null;
  danger: Danger | null = null;
  history: PotentialDanger | null = null;

  findDanger(): Danger | null {
    return this.danger;
  }

  setEscapeFrom(escapeFrom: Position) {
    this.escapeFrom = escapeFrom;
  }

  update(pacman: Pacman, graph: PacmanGraph) {
    const danger = graph.findEnemiesAround(pacman);

    if (danger) {
      this.history = {
        danger,
        seenAt: 7,
      };
    } else if (this.history) {
      this.history.seenAt -= 1;
      if (this.history.seenAt == 0) {
        this.escapeFrom = null;
        this.history = null;
      }
    }

    this.danger = danger;
  }
}
