import { Graph } from "../board/Graph";
import { Position } from "../Position";
import { AStrategy, ActionType, Action, EStrategyAvancement } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";

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

export class CollectorStrategy extends AStrategy {
  private goal: Position;

  constructor(pacman: Pacman, graph: Graph) {
    super();
    this.goal = this.parcours(graph, pacman.getPosition());
  }

  parcours(graph: Graph, start: Position): Position {
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
          if (done[next] >= 0) return;

          const node = graph.getByKey(next);
          const total = todo.current + node.value - depth / 5;

          done[node.position.asKey()] = total;

          nextTodos.push({
            current: total,
            nexts: node.edges,
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

    console.error("DEBUG:", "NEW GOAL:", result.position.asKey(), result.value);

    return result.position;
  }

  computeRound(pacman: Pacman, graph: Graph) {
    if (pacman.getPosition().sameAs(this.goal)) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }

    if (this.avancement === EStrategyAvancement.COMPLETED) {
      this.goal = this.parcours(graph, pacman.getPosition());
      this.avancement = EStrategyAvancement.IN_PROGRESS;
    }
  }

  computeAction = (pacman: Pacman): Action => {
    return {
      type: ActionType.MOVE,
      param: {
        id: pacman.id,
        goal: this.goal,
      },
    };
  };
}
