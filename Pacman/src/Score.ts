import { GraphNode } from "./board/Graph";
import { PelletManager } from "./utils/PelletManager";
import { PacmanGraph } from "./board/PacmanGraph";
import { Store } from "./pacmans/Store";
import { Pacman } from "./pacmans/Pacman";

export class Score {
  private myScore: number = 0;
  private opponentScore: number = 0;
  public total: number = 0;

  init(graph: PacmanGraph, pelletManager: PelletManager, myPacman: Store<Pacman>) {
    this.total = graph.length - 2 * myPacman.length + 9 * Object.keys(pelletManager.superPellets).length;
  }

  refresh(myScore: number, opponentScore: number) {
    this.myScore = myScore;
    this.opponentScore = opponentScore;
  }

  complete(): number {
    return ((this.myScore + this.opponentScore) / this.total) * 100;
  }
}
