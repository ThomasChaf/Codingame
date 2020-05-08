


const DIRECTIONS = [
  [+1, 0],
  [0, +1],
  [-1, 0],
  [0, -1],
];

class CoarseBoard {
  private rows: string[];

  constructor(width: number, height: number) {
    this.rows = [];
  }

  addRow(row: string) {
    this.rows.push(row);
  }

  at(x: number, y: number) {
    return this.rows[y][x];
  }
}

class Factory {
  private width: number;
  private height: number;
  private board: CoarseBoard;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.board = new CoarseBoard(width, height);
  }

  addRow(row: string) {
    this.board.addRow(row);
  }

  constructGraph = (): Graph => {
    const mod = (n: number, m: number) => ((n % m) + m) % m;

    const graph = new Graph();
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.board.at(x, y) === " ") {
          const position = new Position(x, y);
          graph.addNode(position);

          DIRECTIONS.forEach(([incX, incY]) => {
            const _x = mod(x + incX, this.width);
            const _y = mod(y + incY, this.height);

            if (this.board.at(_x, _y) === " ") {
              graph.addEdge(position, new Position(_x, _y));
            }
          });
        }
      }
    }
    return graph;
  };
}


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

class Graph {
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



enum EStrategyType {
  UNDEFINED,
  COLLECTOR,
  WAITOR,
}

enum EStrategyAvancement {
  IN_PROGRESS,
  COMPLETED,
}

enum ActionType {
  MOVE = "MOVE",
}

type Action = {
  type: ActionType;
  param: any;
};

abstract class AStrategy {
  protected avancement: EStrategyAvancement = EStrategyAvancement.IN_PROGRESS;

  abstract computeAction(pacman: Pacman): Action;

  abstract computeRound(pacman: Pacman, graph: Graph): void;
}






class StrategyDefiner {
  private state: EStrategyType = EStrategyType.UNDEFINED;

  select = (pacman: Pacman, graph: Graph): AStrategy => {
    this.state = EStrategyType.COLLECTOR;
    return new CollectorStrategy(pacman, graph);
  };
}





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

class CollectorStrategy extends AStrategy {
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


abstract class APacman {
  constructor(public id: number, protected position: Position) {}

  setPosition = (position: Position) => (this.position = position);
  getPosition = (): Position => this.position;
}

type Store<T> = {
  [key: string]: T;
};


class Enemy extends APacman {
  willPlay(graph: Graph) {
    graph.updateNode(this.getPosition().asKey(), 0);
  }
}






const ACTIONS = {
  [ActionType.MOVE]: ({ id, goal }: any) => console.log(`${ActionType.MOVE} ${id} ${goal.x} ${goal.y}`),
};

class Pacman extends APacman {
  private strategy: AStrategy | null = null;
  private strategyDefiner: StrategyDefiner = new StrategyDefiner();

  willPlay(graph: Graph) {
    graph.updateNode(this.getPosition().asKey(), 0);

    if (!this.strategy) {
      this.strategy = this.strategyDefiner.select(this, graph);
    }
    this.strategy.computeRound(this, graph);
  }

  play() {
    if (!this.strategy) throw new Error("No strategy defined");

    const action: Action = this.strategy.computeAction(this);

    ACTIONS[action.type](action.param);
  }
}






class Game {
  private graph: Graph;
  private myPacman: Store<Pacman> = {};
  private enemies: Store<Enemy> = {};

  constructor(graph: Graph) {
    this.graph = graph;
  }

  public roundInput = (
    pacId: number,
    mine: boolean,
    position: Position,
    typeId: string,
    speedTurnsLeft: number,
    abilityCooldown: number
  ) => {
    if (mine) {
      if (!this.myPacman[pacId]) {
        this.myPacman[pacId] = new Pacman(pacId, position);
      } else {
        this.myPacman[pacId].setPosition(position);
      }
    } else {
      if (!this.enemies[pacId]) {
        this.enemies[pacId] = new Enemy(pacId, position);
      } else {
        this.enemies[pacId].setPosition(position);
      }
    }
  };

  public updatePellet(x: number, y: number, value: number) {
    this.graph.updateNode(asKey(x, y), value);
  }

  public play() {
    Object.values(this.enemies).forEach((pac) => pac.willPlay(this.graph));

    Object.values(this.myPacman).forEach((pac) => pac.willPlay(this.graph));

    Object.values(this.myPacman).forEach((pac) => pac.play());
  }
}
enum EItem {
  NONE = -1,
  RADAR = 2,
  TRAP = 3,
  ORE = 4
}
const asKey = (x: number, y: number) => `${x}-${y}`;

class Position {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  asKey(): string {
    return asKey(this.x, this.y);
  }

  sameAs(p: Position | null): boolean {
    if (!p) return false;

    return p.x === this.x && p.y === this.y;
  }
}
// ======================================================================================================

const debugreadline = (): string => {
  const line = readline();

  // console.error(line);
  return line;
};





var inputs: string[] = debugreadline().split(" ");
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]);
const board = new Factory(width, height);

for (let y = 0; y < height; y++) {
  board.addRow(debugreadline());
}

const graph = board.constructGraph();

// graph.print();

const game = new Game(graph);

while (true) {
  var inputs: string[] = debugreadline().split(" ");
  const myScore: number = parseInt(inputs[0]);
  const opponentScore: number = parseInt(inputs[1]);
  const visiblePacCount: number = parseInt(debugreadline()); // all your pacs and enemy pacs in sight

  for (let i = 0; i < visiblePacCount; i++) {
    var inputs: string[] = debugreadline().split(" ");
    const pacId: number = parseInt(inputs[0]); // pac number (unique within a team)
    const mine: boolean = inputs[1] !== "0"; // true if this pac is yours
    const x: number = parseInt(inputs[2]); // position in the grid
    const y: number = parseInt(inputs[3]); // position in the grid
    const typeId: string = inputs[4]; // unused in wood leagues
    const speedTurnsLeft: number = parseInt(inputs[5]); // unused in wood leagues
    const abilityCooldown: number = parseInt(inputs[6]); // unused in wood leagues

    game.roundInput(pacId, mine, new Position(x, y), typeId, speedTurnsLeft, abilityCooldown);
  }

  const visiblePelletCount: number = parseInt(debugreadline()); // all pellets in sight

  for (let i = 0; i < visiblePelletCount; i++) {
    var inputs: string[] = debugreadline().split(" ");
    const x: number = parseInt(inputs[0]);
    const y: number = parseInt(inputs[1]);
    const value: number = parseInt(inputs[2]); // amount of points this pellet is worth
    game.updatePellet(x, y, value);
  }

  game.play();
}
