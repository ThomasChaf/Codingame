import { Position } from "../Position";
import { Pacman } from "../pacmans/Pacman";
import { Enemy } from "../pacmans/Enemy";
import { Store } from "../pacmans/Store";

export type PacmanMeta = {
  mine: boolean;
  id: number;
  weapon: string;
} | null;

class GraphNode {
  public position: Position;
  public edges: string[] = [];
  public value: number = 1;
  public pacmanMeta: PacmanMeta = null;

  constructor(position: Position) {
    this.position = position;
  }

  setPacmanMeta(pacmanMeta: PacmanMeta) {
    this.pacmanMeta = pacmanMeta;
  }

  hasObstacle() {
    return this.pacmanMeta !== null;
  }
}

type NodeStore = {
  [k: string]: GraphNode;
};

export class Graph {
  private nodes: NodeStore;

  constructor() {
    this.nodes = {};
  }

  addNode(pos: Position) {
    this.nodes[pos.asKey()] = new GraphNode(pos);
  }

  get = (pos: Position): GraphNode => {
    return this.nodes[pos.asKey()];
  };

  getByKey = (key: string): GraphNode => {
    return this.nodes[key];
  };

  updateNode(key: string, value: number) {
    this.nodes[key].value = value;
  }

  addEdge(from: Position, to: Position) {
    this.nodes[from.asKey()].edges.push(to.asKey());
  }

  addEntities(myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    myPacman.forEach((pacman) => {
      this.nodes[pacman.getPosition().asKey()].setPacmanMeta(pacman.toMeta());
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].setPacmanMeta(enemy.toMeta());
    });
  }

  cleanEntities(myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    myPacman.forEach((pacman) => {
      this.nodes[pacman.getPosition().asKey()].setPacmanMeta(null);
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].setPacmanMeta(null);
    });
  }

  print() {
    Object.values(this.nodes).forEach((node) => {
      console.log("NODE:", node.position.x, node.position.y);
      node.edges.map((e) => {
        console.log("    ", e);
      });
    });
  }
}
