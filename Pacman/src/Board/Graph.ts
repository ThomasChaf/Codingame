import { Position } from "../Position";
import { Pacman } from "../pacmans/Pacman";
import { Enemy } from "../pacmans/Enemy";
import { Store } from "../pacmans/Store";

class GraphNode {
  public position: Position;
  public edges: string[] = [];
  public value: number = 1;
  public hasPacman = false;

  constructor(position: Position) {
    this.position = position;
  }

  hasObstacle() {
    return this.hasPacman;
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
      this.nodes[pacman.getPosition().asKey()].hasPacman = true;
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].hasPacman = true;
    });
  }

  cleanEntities(myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    myPacman.forEach((pacman) => {
      this.nodes[pacman.getPosition().asKey()].hasPacman = false;
    });
    enemies.forEach((enemy) => {
      this.nodes[enemy.getPosition().asKey()].hasPacman = false;
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
