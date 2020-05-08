


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


abstract class APacman {
  constructor(protected id: number, protected position: Position) {}

  setPosition = (position: Position) => (this.position = position);
  getPosition = (): Position => this.position;
}

type Store<T> = {
  [key: string]: T;
};


class Enemy extends APacman {}




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

class Pacman extends APacman {
  play(graph: Graph) {
    const bestPosition = parcours(graph, this.position);

    console.log(`MOVE ${this.id} ${bestPosition.x} ${bestPosition.y}`);
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
    Object.values(this.myPacman).forEach((pac) => pac.play(this.graph));
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

  asKey() {
    return asKey(this.x, this.y);
  }
}
// ======================================================================================================





var inputs: string[] = readline().split(" ");
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]);
const board = new Factory(width, height);

for (let y = 0; y < height; y++) {
  board.addRow(readline());
}

const graph = board.constructGraph();

// graph.print();

const game = new Game(graph);

while (true) {
  var inputs: string[] = readline().split(" ");
  const myScore: number = parseInt(inputs[0]);
  const opponentScore: number = parseInt(inputs[1]);
  const visiblePacCount: number = parseInt(readline()); // all your pacs and enemy pacs in sight

  for (let i = 0; i < visiblePacCount; i++) {
    var inputs: string[] = readline().split(" ");
    const pacId: number = parseInt(inputs[0]); // pac number (unique within a team)
    const mine: boolean = inputs[1] !== "0"; // true if this pac is yours
    const x: number = parseInt(inputs[2]); // position in the grid
    const y: number = parseInt(inputs[3]); // position in the grid
    const typeId: string = inputs[4]; // unused in wood leagues
    const speedTurnsLeft: number = parseInt(inputs[5]); // unused in wood leagues
    const abilityCooldown: number = parseInt(inputs[6]); // unused in wood leagues

    game.roundInput(pacId, mine, new Position(x, y), typeId, speedTurnsLeft, abilityCooldown);
  }

  const visiblePelletCount: number = parseInt(readline()); // all pellets in sight

  for (let i = 0; i < visiblePelletCount; i++) {
    var inputs: string[] = readline().split(" ");
    const x: number = parseInt(inputs[0]);
    const y: number = parseInt(inputs[1]);
    const value: number = parseInt(inputs[2]); // amount of points this pellet is worth
    game.updatePellet(x, y, value);
  }

  game.play();
}
