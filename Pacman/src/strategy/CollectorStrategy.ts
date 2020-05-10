import { Graph } from "../board/Graph";
import { Position } from "../Position";
import { PlayType, Play, EStrategyAvancement, EStrategyType } from "./AStrategy";
import { Pacman } from "../pacmans/Pacman";
import { Facilitator } from "../Facilitator";
import { GoalStrategy, Goal } from "./GoalStrategy";

type Done = {
  [key: string]: boolean;
};

type Todo = {
  path: string[];
  current: number;
  nexts: string[];
};

export class CollectorStrategy extends GoalStrategy {
  public type: EStrategyType = EStrategyType.COLLECTOR;

  parcours(graph: Graph, start: Position, pacman: Pacman): Goal {
    const done: Done = {};
    let result: Goal = {
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
          // console.error("DEBUG:", "DONE:", pacman.id, node.position.asKey(), total);

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
    console.error("DEBUG:", "NEW PATH", result.path.join("|"));

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
      this.updateGoal(pacman);

      const hasTrouble = this.isGoalDangerous(pacman, graph);
      if (hasTrouble) {
        this.goal = this.parcours(graph, pacman.getPosition(), pacman);
      }
    }
  }

  play(pacman: Pacman, graph: Graph, facilitator: Facilitator): Play {
    if (!this.goal) throw new Error("No goal set on willPlay");

    let to = this.goal.path[2] ? graph.getByKey(this.goal.path[2]).position : this.goal.position;
    let opt = "";

    if (!facilitator.shouldWait(this.goal.path[0])) {
      facilitator.addMove(this.goal.path[0]);
    } else {
      to = pacman.getPosition();
      opt = " WAIT";
    }

    return {
      type: PlayType.MOVE,
      param: {
        id: pacman.id,
        to,
        opt,
      },
    };
  }
}
