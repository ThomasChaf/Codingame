import { Graph } from "./board/Graph";
import { Position, asKey } from "./Position";
import { Store } from "./pacmans/Store";
import { Pacman } from "./pacmans/Pacman";
import { Enemy } from "./pacmans/Enemy";

export class Game {
  private graph: Graph;
  private myPacman: Store<Pacman> = new Store<Pacman>(Pacman);
  private enemies: Store<Enemy> = new Store<Enemy>(Enemy);

  constructor(graph: Graph) {
    this.graph = graph;
  }

  public willUpdatePac() {
    this.myPacman.inventory();
  }

  public updatePac = (
    pacId: number,
    mine: boolean,
    position: Position,
    typeId: string,
    speedTurnsLeft: number,
    abilityCooldown: number
  ) => {
    const store = mine ? this.myPacman : this.enemies;

    if (!store.exist(pacId)) {
      store.add(pacId, { position, abilityCooldown });
    } else {
      store.get(pacId).update({ position, abilityCooldown });
    }

    if (mine) store.isAlive(pacId);
  };

  public didUpdatePac() {
    this.myPacman.removeDiedPac();
  }

  public updatePellet(x: number, y: number, value: number) {
    this.graph.updateNode(asKey(x, y), value);
  }

  public willPlay() {
    this.graph.addEntities(this.myPacman, this.enemies);

    this.enemies.forEach((pac) => pac.willPlay(this.graph));

    this.myPacman.forEach((pac) => pac.willPlay(this.graph));
  }

  public play() {
    console.log(this.myPacman.map((pac) => pac.play()).join("|"));
  }

  public didPlay() {
    this.graph.cleanEntities(this.myPacman, this.enemies);
  }
}
