import { Graph } from "./Graph";
import { Pacman } from "../pacmans/Pacman";
import { Enemy } from "../pacmans/Enemy";
import { Store } from "../pacmans/Store";

export type PacmanMeta = {
  mine: boolean;
  id: number;
  weapon: string;
} | null;

export class PacmanGraph extends Graph<PacmanMeta> {
  addEntities(myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    myPacman.forEach((pacman) => {
      this.nodes[pacman.getPosition().asKey()].setMeta(pacman.toMeta());
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].setMeta(enemy.toMeta());
    });
  }

  cleanEntities(myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    myPacman.forEach((pacman) => {
      this.nodes[pacman.getPosition().asKey()].setMeta(null);
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].setMeta(null);
    });
  }
}
