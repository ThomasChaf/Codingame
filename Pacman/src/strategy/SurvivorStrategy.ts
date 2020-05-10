import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { PacmanGraph, PacmanMeta } from "../board/PacmanGraph";

type Danger = PacmanMeta | null;

export class SurvivorStrategy extends AStrategy {
  private danger: Danger = null;
  public type: EStrategyType = EStrategyType.SURVIVOR;

  hasDanger(): boolean {
    return this.danger !== null;
  }

  update(pacman: Pacman, graph: PacmanGraph) {
    this.danger = null;

    const currentNode = graph.get(pacman.getPosition());

    for (const i in currentNode.edges) {
      const nextNode = graph.getByKey(currentNode.edges[i]);

      if (!pacman.faceWeakerOpponent(nextNode.meta)) {
        this.danger = nextNode.meta;
        return;
      }

      for (const j in nextNode.edges) {
        const newNextNode = graph.getByKey(nextNode.edges[j]);

        if (!pacman.faceWeakerOpponent(newNextNode.meta)) {
          this.danger = newNextNode.meta;
          return;
        }
      }
    }
  }

  willPlay(pacman: Pacman, graph: PacmanGraph) {}

  play(pacman: Pacman, graph: PacmanGraph, facilitator: Facilitator): Play {
    if (!this.danger) throw "No danger on survivor";

    let weapon = "";
    if (this.danger.weapon === "ROCK") {
      weapon = "PAPER";
    }
    if (this.danger.weapon === "SCISSORS") {
      weapon = "ROCK";
    }
    if (this.danger.weapon === "PAPER") {
      weapon = "SCISSORS";
    }

    return { type: PlayType.SWITCH, param: { id: pacman.id, weapon } } as Play;
  }
}
