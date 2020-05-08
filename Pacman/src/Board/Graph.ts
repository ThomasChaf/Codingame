import { Position } from "../Position";

class GraphNode {
  position: Position;
  edges: string[] = [];
  value: number = 0;

  constructor(position: Position) {
    this.position = position;
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

  print() {
    Object.values(this.nodes).forEach((node) => {
      console.log("NODE:", node.position.x, node.position.y);
      node.edges.map((e) => {
        console.log("    ", e);
      });
    });
  }
}
