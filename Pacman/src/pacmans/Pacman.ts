import { APacman } from "./APacman";
import { Graph } from "../Board/Graph";
import { Position } from "../Position";

type Result = {
  value: number;
  position: Position;
} | null;

type Done = {
  [key: string]: number;
};

type Todo = {
  current: number;
  nexts: string[];
};

const parcours = (graph: Graph, start: Position): Position => {
  const done: Done = {};
  let todos: Todo[] = [
    {
      current: 0,
      nexts: graph.get(start).edges,
    },
  ];
  let depth = 1;

  while (depth < 15) {
    let nextTodos: Todo[] = [];
    todos.forEach((todo) => {
      todo.nexts.forEach((next) => {
        const node = graph.getByKey(next);
        const total = todo.current + node.value;

        done[node.position.asKey()] = total;

        nextTodos.push({
          current: total,
          nexts: node.edges.filter((edge) => !done[edge]),
        });
      });
    });
    todos = nextTodos;
    depth += 1;
  }

  const result = Object.keys(done).reduce((acc, key): Result => {
    if (!acc || done[key] > acc.value) {
      return {
        value: done[key],
        position: graph.getByKey(key).position,
      };
    }
    return acc;
  }, null as Result);
  if (!result) return new Position(10, 15);
  return result.position;
};

export class Pacman extends APacman {
  play(graph: Graph) {
    const bestPosition = parcours(graph, this.position);

    console.log(`MOVE ${this.id} ${bestPosition.x} ${bestPosition.y}`);
  }
}
