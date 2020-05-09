import { Graph } from "./board/Graph";
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

  public willPlay() {
    this.graph.addEntities(this.myPacman, this.enemies);

    Object.values(this.enemies).forEach((pac) => pac.willPlay(this.graph));

    Object.values(this.myPacman).forEach((pac) => pac.willPlay(this.graph, this.myPacman, this.enemies));
  }

  public play() {
    console.log(
      Object.values(this.myPacman)
        .map((pac) => pac.play())
        .join("|")
    );
  }

  public didPlay() {
    this.graph.cleanEntities(this.myPacman, this.enemies);
  }
}
