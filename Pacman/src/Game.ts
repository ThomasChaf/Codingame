import { PacmanGraph } from "./board/PacmanGraph";
import { Position, asKey } from "./Position";
import { Store } from "./pacmans/Store";
import { Pacman } from "./pacmans/Pacman";
import { Enemy } from "./pacmans/Enemy";
import { Facilitator } from "./Facilitator";
import { parseWeapon } from "./utils/Weapon";
import { PelletManager } from "./utils/PelletManager";
import { Score } from "./Score";

export class Game {
  private graph: PacmanGraph;
  private score: Score = new Score();
  private facilitator: Facilitator = new Facilitator();
  private myPacman: Store<Pacman> = new Store<Pacman>(Pacman);
  private enemies: Store<Enemy> = new Store<Enemy>(Enemy);
  private pelletManager: PelletManager = new PelletManager();

  constructor(graph: PacmanGraph) {
    this.graph = graph;
  }

  public willUpdatePac() {
    this.myPacman.inventory();
    this.enemies.inventory();
  }

  public updatePac = (
    pacId: number,
    mine: boolean,
    position: Position,
    type: string,
    fast: number,
    abilityCooldown: number
  ) => {
    if (type === "DEAD") {
      if (!mine) {
        this.myPacman.forEach((pacman: Pacman) => pacman.radar.reset(pacId));
      }
      return;
    }

    const weapon = parseWeapon(type);
    const store = mine ? this.myPacman : this.enemies;

    if (!store.exist(pacId)) {
      store.add(pacId, { position, abilityCooldown, weapon, fast });
    } else {
      store.get(pacId).update(this.graph, { position, abilityCooldown, weapon, fast });
    }

    store.isAlive(pacId);
  };

  public didUpdatePac() {
    this.myPacman.removeDiedPac();
    this.enemies.removeDiedPac();
  }

  public wllUpdatePellet() {
    this.pelletManager.newRound();
  }

  public updatePellet(x: number, y: number, value: number) {
    this.pelletManager.add(asKey(x, y), value);
  }

  public didUpdatePellet() {
    this.pelletManager.updateGraph(this.myPacman, this.graph);
  }

  refreshScore(myScore: number, opponentScore: number) {
    if (this.score.total === 0) this.score.init(this.graph, this.pelletManager, this.myPacman);

    this.score.refresh(myScore, opponentScore);
  }

  public willPlay() {
    this.facilitator.reset();
    this.graph.addEntities(this.myPacman, this.enemies);

    this.enemies.forEach((pac) => pac.willPlay(this.graph));

    this.myPacman.forEach((pac) =>
      pac.willPlay(this.graph, this.facilitator, this.pelletManager, this.score.complete(), this.enemies)
    );
  }

  public play() {
    console.log(this.myPacman.map((pac) => pac.play(this.graph, this.facilitator)).join("|"));
  }

  public didPlay() {
    this.graph.cleanEntities(this.myPacman, this.enemies);
  }
}
