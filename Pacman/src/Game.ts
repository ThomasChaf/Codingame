import { Graph } from "./board/Graph";
import { Position, asKey } from "./Position";
import { Store } from "./pacmans/Store";
import { Pacman } from "./pacmans/Pacman";
import { Enemy } from "./pacmans/Enemy";
import { Facilitator } from "./Facilitator";

export class Game {
  private graph: Graph;
  private facilitator: Facilitator = new Facilitator();
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
    weapon: string,
    fast: number,
    abilityCooldown: number
  ) => {
    const store = mine ? this.myPacman : this.enemies;

    if (!store.exist(pacId)) {
      store.add(pacId, { position, abilityCooldown, weapon, fast });
    } else {
      store.get(pacId).update(this.graph, { position, abilityCooldown, weapon, fast });
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
    this.facilitator.reset();
    this.graph.addEntities(this.myPacman, this.enemies);

    this.enemies.forEach((pac) => pac.willPlay(this.graph));

    this.myPacman.forEach((pac) => pac.willPlay(this.graph));
  }

  public play() {
    console.log(this.myPacman.map((pac) => pac.play(this.graph, this.facilitator)).join("|"));
  }

  public didPlay() {
    this.graph.cleanEntities(this.myPacman, this.enemies);
  }
}
