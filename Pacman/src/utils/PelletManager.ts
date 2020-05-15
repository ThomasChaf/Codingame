import { PacmanGraph } from "../board/PacmanGraph";
import { Pacman } from "../pacmans/Pacman";
import { Store } from "../pacmans/Store";

type Pellets = {
  [key: string]: number;
};

export class PelletManager {
  private pellets: Pellets = {};
  private hasSuper: boolean = false;
  public readonly superPellets: Pellets = {};

  isVisible(key: string): boolean {
    return !!this.pellets[key];
  }

  newRound() {
    this.pellets = {};
    if (!this.hasSuper) {
      this.hasSuper = true;
    } else {
      Object.keys(this.superPellets).forEach((key: string) => {
        this.superPellets[key] = 0;
      });
    }
  }

  add(key: string, value: number) {
    this.pellets[key] = value;

    if (value === 10) this.superPellets[key] = 20;
  }

  updateGraph(myPacman: Store<Pacman>, graph: PacmanGraph) {
    myPacman.forEach((pacman: Pacman) => {
      const visibility = graph.getVisibility(pacman);

      visibility.forEach((key: string) => {
        const value = this.pellets[key] || 0;

        graph.updateNode(key, value);
      });
      pacman.savedMoves.forEach((key: string) => graph.updateNode(key, 0));
    });
    Object.keys(this.superPellets).forEach((key: string) => {
      graph.updateNode(key, this.superPellets[key]);
    });
  }
}
