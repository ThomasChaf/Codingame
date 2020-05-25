import { Position } from "./Position";

type Meta = {
  type: string;
};

export class GraphNode {
  public key: string;
  public position: Position;
  public edges: string[] = [];
  public meta: Meta;

  constructor(key: string, position: Position, meta: Meta) {
    this.key = key;
    this.position = position;
    this.meta = meta;
  }
}

export type NodeStore = {
  [k: string]: GraphNode;
};

export class Graph {
  protected nodes: NodeStore = {};
  protected ballsPosition: { [key: string]: number } = {};

  addNode(pos: Position, type: string) {
    const key = pos.asKey();

    const num = parseInt(type);
    if (!isNaN(num)) {
      this.ballsPosition[key] = num;
    }

    this.nodes[key] = new GraphNode(key, pos, { type });
  }

  get = (key: string): GraphNode => {
    return this.nodes[key];
  };

  addEdge(from: Position, to: string) {
    this.nodes[from.asKey()].edges.push(to);
  }

  print() {
    Object.keys(this.nodes).forEach((key: string) => {
      const node = this.get(key);
      console.log(node.key, node.meta.type, JSON.stringify(node.edges));
    });
  }
}
