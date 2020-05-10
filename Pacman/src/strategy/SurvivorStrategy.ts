import { AStrategy, PlayType, Play, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Graph, PacmanMeta } from "../board/Graph";
import { Facilitator } from "../Facilitator";

type Danger = PacmanMeta | null;

export class SurvivorStrategy extends AStrategy {
  private danger: Danger = null;
  public type: EStrategyType = EStrategyType.SURVIVOR;

  hasDanger(): boolean {
    return this.danger !== null;
  }

  update(pacman: Pacman, graph: Graph) {
    this.danger = null;

    const currentNode = graph.get(pacman.getPosition());

    for (const i in currentNode.edges) {
      const nextNode = graph.getByKey(currentNode.edges[i]);

      if (!pacman.faceWeakerOpponent(nextNode.pacmanMeta)) {
        this.danger = nextNode.pacmanMeta;
        return;
      }

      for (const j in nextNode.edges) {
        const newNextNode = graph.getByKey(nextNode.edges[j]);

        if (!pacman.faceWeakerOpponent(newNextNode.pacmanMeta)) {
          this.danger = newNextNode.pacmanMeta;
          return;
        }
      }
    }
  }

  willPlay(pacman: Pacman, graph: Graph) {}

  play(pacman: Pacman, graph: Graph, facilitator: Facilitator): Play {
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
