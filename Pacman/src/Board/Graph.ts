import { Position, asKey } from "../Position";

export class GraphNode<T> {
  public key: string;
  public position: Position;
  public edges: string[] = [];
  public value: number = 1;
  public meta: T | null = null;

  constructor(key: string, position: Position) {
    this.key = key;
    this.position = position;
  }

  setMeta(meta: T | null) {
    this.meta = meta;
  }

  hasObstacle() {
    return this.meta !== null;
  }

  getMeta() {
    return this.meta;
  }
}

type Done = {
  [key: string]: boolean;
};

type Todo = {
  keep?: any;
  path: string[];
  nexts: string[];
};

type NodeStore<T> = {
  [k: string]: GraphNode<T>;
};

type TraverseStep = {
  end: boolean;
  keep?: any;
};

type TraverseCallback<T> = (depth: number, node: GraphNode<T>, keep: any, path: string[]) => TraverseStep;

export class Graph<T> {
  protected nodes: NodeStore<T> = {};

  addNode(pos: Position) {
    const key = pos.asKey();
    this.nodes[key] = new GraphNode(key, pos);
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

  traverse(start: Position, maxDepth: number, cb: TraverseCallback<T>) {
    const done: Done = {};
    let todos: Todo[] = [
      {
        path: [],
        nexts: this.get(start).edges,
      },
    ];
    let depth = 1;

    while (depth < maxDepth) {
      let nextTodos: Todo[] = [];
      todos.forEach((todo: Todo) => {
        todo.nexts.forEach((nextKey: string) => {
          if (done[nextKey]) return;

          const node = this.getByKey(nextKey);

          const { end, keep } = cb(depth, node, todo.keep, todo.path);
          if (end) return;

          done[node.position.asKey()] = true;

          nextTodos.push({
            keep,
            path: [...todo.path, nextKey],
            nexts: node.edges,
          });
        });
      });
      todos = nextTodos;
      depth += 1;
    }
  }

  straightTraverse(start: Position, xInc: number, yInc: number, cb: TraverseCallback<T>) {
    let pos;
    const todo: Position[] = [start];
    let depth = 1;

    while ((pos = todo.shift())) {
      const node = this.get(pos);
      const nextKey = asKey(pos.x + xInc, pos.y + yInc);

      if (node.edges.includes(nextKey)) {
        const nextNode = this.getByKey(nextKey);

        const { end } = cb(depth, nextNode, null, []);
        if (end) return;

        depth += 1;
        todo.push(nextNode.position);
      }
    }
  }
}
