import { NodeStore, GraphNode } from "./Graph";
import { Position } from "../Position";

export const distKey = (p1: Position, p2: Position): string => {
  if (p1.x < p2.x || (p1.x === p2.x && p1.y < p2.y)) {
    return `${p1.asKey()}|${p2.asKey()}`;
  }
  return `${p2.asKey()}|${p1.asKey()}`;
};

type Result = {
  [key: string]: number;
};

export class Distance {
  private res: Result = {};

  get(p1: Position, p2: Position): number {
    return this.res[distKey(p1, p2)];
  }

  precomputeValues<T>(nodes: NodeStore<T>) {
    Object.values(nodes).forEach((node: GraphNode<T>) => {
      let todo = [...node.edges];
      let depth = 1;
      while (todo.length > 0) {
        let nextTodo = [];
        for (let i = 0; i < todo.length; i++) {
          const k1 = todo[i];
          const nNode = nodes[k1];
          const dKey = distKey(node.position, nNode.position);

          if (!this.res[dKey] && nNode.key !== node.key) {
            this.res[dKey] = depth;
            nextTodo.push(...nNode.edges);
          }
        }
        depth += 1;
        todo = nextTodo;
      }
    });
  }
}
