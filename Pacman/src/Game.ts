import { Graph } from "./Board/Graph";
import { Position, asKey } from "./Position";
import { Store } from "./pacmans/APacman";
import { Pacman } from "./pacmans/Pacman";
import { Enemy } from "./pacmans/Enemy";

export class Game {
  private graph: Graph;
  private myPacman: Store<Pacman> = {};
  private enemies: Store<Enemy> = {};

  constructor(graph: Graph) {
    this.graph = graph;
  }

  public roundInput = (
    pacId: number,
    mine: boolean,
    position: Position,
    typeId: string,
    speedTurnsLeft: number,
    abilityCooldown: number
  ) => {
    if (mine) {
      if (!this.myPacman[pacId]) {
        this.myPacman[pacId] = new Pacman(pacId, position);
      } else {
        this.myPacman[pacId].setPosition(position);
      }
    } else {
      if (!this.enemies[pacId]) {
        this.enemies[pacId] = new Enemy(pacId, position);
      } else {
        this.enemies[pacId].setPosition(position);
      }
    }
  };

  public updatePellet(x: number, y: number, value: number) {
    this.graph.updateNode(asKey(x, y), value);
  }

  public play() {
    Object.values(this.myPacman).forEach((pac) => pac.play(this.graph));
  }
}
