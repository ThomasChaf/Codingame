import { Position } from "../Position";

class GraphNode<T> {
  public position: Position;
  public edges: string[] = [];
  public value: number = 1;
  public meta: T | null = null;

  constructor(position: Position) {
    this.position = position;
  }

  setMeta(meta: T | null) {
    this.meta = meta;
  }

  hasObstacle() {
    return this.meta !== null;
  }
}

type NodeStore<T> = {
  [k: string]: GraphNode<T>;
};

export class Graph<T> {
  protected nodes: NodeStore<T> = {};

  addNode(pos: Position) {
    this.nodes[pos.asKey()] = new GraphNode(pos);
  }

  get = (pos: Position): GraphNode<T> => {
    return this.nodes[pos.asKey()];
  };

  getByKey = (key: string): GraphNode<T> => {
    return this.nodes[key];
  };

  updateNode(key: string, value: number) {
    this.nodes[key].value = value;
  }

  addEdge(from: Position, to: Position) {
    this.nodes[from.asKey()].edges.push(to.asKey());
  }
}
