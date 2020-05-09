import { Graph } from "../board/Graph";
import { Position } from "../Position";
import { AStrategy, PlayType, Play, EStrategyAvancement } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";

type Result = {
  path: string[];
  value: number;
  position: Position;
};

type Done = {
  [key: string]: boolean;
};

type Todo = {
  path: string[];
  current: number;
  nexts: string[];
};

export class CollectorStrategy extends AStrategy {
  private goal: Result;

  constructor(pacman: Pacman, graph: Graph) {
    super();
    this.goal = this.parcours(graph, pacman.getPosition(), pacman);
  }

  ensureTravel(pacman: Pacman, graph: Graph): boolean {
    if (pacman.getPosition().asKey() === this.goal.path[0]) {
      this.goal.path.shift();
    }

    // console.error("DEBUG:", "PATH:", pacman.id, this.goal.path.join("|"));

    for (const i in this.goal.path) {
      if (graph.getByKey(this.goal.path[i]).hasPacman) {
        console.error("DEBUG:", "HAS TROUBLE", pacman.id, this.goal.path[i]);

        return true;
      }
    }

    return false;
  }

  parcours(graph: Graph, start: Position, pacman: Pacman): Result {
    const done: Done = {};
    let result: Result = {
      path: [],
      position: new Position(17, 5),
      value: 0,
    };

    let todos: Todo[] = [
      {
        path: [],
        current: 0,
        nexts: graph.get(start).edges,
      },
    ];
    let depth = 1;

    while (depth < 20) {
      let nextTodos: Todo[] = [];
      todos.forEach((todo: Todo) => {
        todo.nexts.forEach((nextKey: string) => {
          if (done[nextKey]) return;

          const node = graph.getByKey(nextKey);
          if (node.hasPacman) return;

          const total = Math.max(todo.current - 10 * depth, 0) + (20 - depth) * node.value;

          done[node.position.asKey()] = true;
          if (result.value < total) {
            result = {
              path: [...todo.path, nextKey],
              value: total,
              position: node.position,
            };
          }
          console.error("DEBUG:", "DONE:", pacman.id, node.position.asKey(), total);

          nextTodos.push({
            path: [...todo.path, nextKey],
            current: total,
            nexts: node.edges,
          });
        });
      });
      todos = nextTodos;
      depth += 1;
    }

    console.error("DEBUG:", "NEW GOAL:", pacman.id, result.position.asKey(), result.value);

    return result;
  }

  willPlay(pacman: Pacman, graph: Graph) {
    if (!this.goal || pacman.getPosition().sameAs(this.goal.position)) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }

    if (this.avancement === EStrategyAvancement.COMPLETED) {
      this.goal = this.parcours(graph, pacman.getPosition(), pacman);
      this.avancement = EStrategyAvancement.IN_PROGRESS;
    } else if (this.avancement === EStrategyAvancement.IN_PROGRESS) {
      const hasTrouble = this.ensureTravel(pacman, graph);
      if (hasTrouble) {
        this.avancement = EStrategyAvancement.COMPLETED;
      }
    }
  }

  play(pacman: Pacman): Play {
    return {
      type: PlayType.MOVE,
      param: {
        id: pacman.id,
        goal: this.goal.position,
      },
    };
  }
}
