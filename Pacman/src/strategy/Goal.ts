import { Position } from "../Position";
import { Pacman } from "../pacmans/Pacman";
import { PacmanGraph } from "../board/PacmanGraph";

export class Goal {
  constructor(public path: string[], public score: number, public position: Position) {}

  public updatePath(pacman: Pacman) {
    this.path = this.path.filter((path: string) => !pacman.savedMoves.includes(path));
  }

  public isPathDangerous(pacman: Pacman, graph: PacmanGraph): boolean {
    for (const i in this.path) {
      const meta = graph.getByKey(this.path[i]).getMeta();
      if (meta && !meta.mine) {
        // console.error("DEBUG:", "HAS TROUBLE", pacman.id, this.path[i]);
        return true;
      }
    }

    return false;
  }
}
