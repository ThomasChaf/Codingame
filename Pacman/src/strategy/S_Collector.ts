import { Graph } from "../board/Graph";
import { Position } from "../Position";
import { AStrategy, PlayType, Play, EStrategyAvancement } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Store } from "../pacmans/APacman";
import { Enemy } from "../pacmans/Enemy";

type Result = {
  path: string[];
  value: number;
  position: Position;
};

type Done = {
  [key: string]: boolean;
};

type Todo = {
  prev: string[];
  current: number;
  nexts: string[];
};

export class CollectorStrategy extends AStrategy {
  private goal: Result;

  constructor(pacman: Pacman, graph: Graph, myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    super();
    this.goal = this.parcours(graph, pacman.getPosition(), myPacman, enemies);
  }

  parcours(graph: Graph, start: Position, myPacman: Store<Pacman>, enemies: Store<Enemy>): Result {
    const done: Done = {};
    let result: Result = {
      path: [],
      position: new Position(17, 5),
      value: 0,
    };

    let todos: Todo[] = [
      {
        prev: [start.asKey()],
        current: 0,
        nexts: graph.get(start).edges,
      },
    ];
    let depth = 1;

    while (depth < 20) {
      let nextTodos: Todo[] = [];
      todos.forEach((todo) => {
        todo.nexts.forEach((next) => {
          if (done[next]) return;

          const node = graph.getByKey(next);
          if (node.hasPacman) return;

          const total = todo.current + (20 - depth) * node.value;

          done[node.position.asKey()] = true;
          if (result.value < total) {
            result = {
              path: todo.prev,
              value: total,
              position: node.position,
            };
            console.error("DEBUG:", "DONE:", node.position.asKey(), total);
            console.error("DEBUG:", "PATH", result.path.join("|"));
          }

          nextTodos.push({
            prev: [...todo.prev, next],
            current: total,
            nexts: node.edges,
          });
        });
      });
      todos = nextTodos;
      depth += 1;
    }

    console.error("DEBUG:", "NEW GOAL:", result.position.asKey(), result.value);

    return result;
  }

  willPlay(pacman: Pacman, graph: Graph, myPacman: Store<Pacman>, enemies: Store<Enemy>) {
    if (!this.goal || pacman.getPosition().sameAs(this.goal.position)) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }

    if (this.avancement === EStrategyAvancement.COMPLETED) {
      this.goal = this.parcours(graph, pacman.getPosition(), myPacman, enemies);
      this.avancement = EStrategyAvancement.IN_PROGRESS;
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
