


enum EEntityType {
  ROBOT = 0,
  ENNEMY_ROBOT,
  RADAR,
  TRAP
}

abstract class AEntity {
  id: number;
  protected position: IPosition;
  protected type: EEntityType;

  constructor(type: EEntityType, id: number) {
    this.type = type;
    this.id = id;
  }

  setPosition = (position: IPosition) => (this.position = position);
  getPosition = (): IPosition => this.position;
}

abstract class ARobot extends AEntity {
  protected item: EItem = EItem.NONE;

  constructor(type: EEntityType, id: number) {
    super(type, id);
  }

  setItem = (item: EItem) => (this.item = item);
  getItem = (): EItem => this.item;
}





class EnemyRobot extends ARobot {
  private hasItemLoaded: boolean = false;

  constructor(type: EEntityType, id: number) {
    super(type, id);
  }

  newRound = (position: IPosition, item: EItem) => {
    if (position.x === 0 && this.position && this.position.x === 0) {
      this.hasItemLoaded = true;
    }
    if (this.hasItemLoaded && position.x !== 0 && PositionUtils.equal(position, this.position)) {
      this.hasItemLoaded = false;

      getBoard().addDoubt(position);
      getBoard().addDoubt(PositionUtils.top(position));
      getBoard().addDoubt(PositionUtils.bottom(position));
      getBoard().addDoubt(PositionUtils.left(position));
      getBoard().addDoubt(PositionUtils.right(position));
    }
    this.position = position;
    this.item = item;
  };
}







class Robot extends ARobot {
  private strategy: AStrategy = null;
  private strategyDefiner: StrategyDefiner = new StrategyDefiner();

  constructor(type: EEntityType, id: number) {
    super(type, id);
  }

  init = (initialPosition: IPosition, gameContext: TGameContext) => {
    this.position = initialPosition;
    this.strategy = this.strategyDefiner.select(this, gameContext);
  };
  getStrategy = (): AStrategy => this.strategy;

  newRound = (item: EItem, gameContext: TGameContext) => {
    this.item = item;
    this.strategy.computeRound(this);
    if (this.strategy.getAvancement() === EStrategyAvancement.COMPLETED) {
      this.strategy = this.strategyDefiner.select(this, gameContext);
    }
  };

  play = () => {
    // console.error("ROBOT:", this.id, "PLAY:", this.strategy.constructor.name);
    const actionDescriptor: ActionDescriptor = this.strategy.computeAction();

    ACTIONS[actionDescriptor.type](actionDescriptor.param);
  };
}


interface IRobots {
  [id: number]: Robot;
}

class RobotsStore {
  private robots: IRobots = {};
  private ids: number[] = [];

  add = (id: number, robot: Robot) => {
    this.robots[id] = robot;
    this.ids = [...this.ids, id].sort((id1, id2) => id1 - id2);
  };

  getById = (id: number): Robot => {
    return this.robots[id];
  };

  getByOrder = (order: number): Robot => {
    return this.getById(this.ids[order]);
  };
}



enum EStrategyType {
  UNDEFINED,
  RADAR_REQUESTOR,
  RADAR_INSTALLOR,
  COLLECTOR,
  DELIVEROR,
  WAITOR,
  FOLLOWER
}

enum EStrategyAvancement {
  IN_PROGRESS,
  COMPLETED
}

enum EObject {
  RADAR = "RADAR",
  TRAP = "TRAP"
}

enum EActions {
  WAIT = "WAIT",
  MOVE = "MOVE",
  DIG = "DIG",
  REQUEST = "REQUEST"
}

type ActionDescriptor = {
  type: EActions;
  param: any;
};

const ACTIONS = {
  [EActions.WAIT]: () => console.log(EActions.WAIT),
  [EActions.MOVE]: (position: IPosition) => console.log(`${EActions.MOVE} ${position.x} ${position.y}`),
  [EActions.DIG]: (position: IPosition) => console.log(`${EActions.DIG} ${position.x} ${position.y}`),
  [EActions.REQUEST]: (obj: EObject) => console.log(`${EActions.REQUEST} ${obj}`)
};

abstract class AStrategy {
  protected avancement: EStrategyAvancement = EStrategyAvancement.IN_PROGRESS;
  abstract computeAction(): ActionDescriptor;
  abstract computeRound(robot: Robot): void;

  getAvancement = (): EStrategyAvancement => this.avancement;
}




let oreOrchestrator: OreOrchestrator;

interface Goal {
  amount: number;
  position: IPosition;
}
interface IOresGoals {
  [id: string]: Goal;
}

interface IRobotGoals {
  [id: string]: IPosition;
}

class OreOrchestrator {
  private goals: IRobotGoals = {};

  getGoalPositions = (): IPosition[] => {
    const board = getBoard();
    const oreGoals: IOresGoals = {};
    Object.values(this.goals).forEach((goal: IPosition) => {
      const id = `${goal.x}-${goal.y}`;

      if (!oreGoals[id]) {
        oreGoals[id] = { amount: board.getCase(goal).getOre() - 1, position: goal };
      } else {
        oreGoals[id].amount -= 1;
      }
    });

    return Object.values(oreGoals)
      .filter((goal: Goal) => goal.amount <= 0)
      .map((goal: Goal) => goal.position);
  };

  addGoal = (robot: Robot, goal: IPosition) => {
    this.goals[robot.id] = goal;
  };

  removeGoal = (robot: Robot) => {
    delete this.goals[robot.id];
  };
}

const getOreOrchestrator = (): OreOrchestrator => {
  if (!oreOrchestrator) {
    oreOrchestrator = new OreOrchestrator();
  }

  return oreOrchestrator;
};



let radarOrchestrator: RadarOrchestrator;

let inc = 0;
const LAST_GOAL: IPosition = { x: 4, y: 13 };
const GOALS: IPosition[] = [
  { x: 5, y: 7 },
  { x: 10, y: 11 },
  { x: 9, y: 4 },
  { x: 15, y: 7 },
  { x: 19, y: 3 },
  { x: 19, y: 11 },
  { x: 24, y: 7 },
  { x: 26, y: 3 },
  { x: 26, y: 12 },
  { x: 13, y: 1 },
  { x: 3, y: 13 },
  { x: 3, y: 1 },
  LAST_GOAL
];

const nextGoal = (): IPosition => {
  const res: IPosition = GOALS[inc];
  inc += 1;

  return res;
};

class Radar {
  private position: IPosition;
  private installed: boolean = false;

  constructor(position: IPosition) {
    this.position = position;
  }

  getPosition = (): IPosition => this.position;
  incrementPosition = () => {
    this.position.x += 1;
  };

  install = () => (this.installed = true);
  isInstalled = (): boolean => this.installed;
}

class RadarOrchestrator {
  private allInstalled = false;
  private radar: Radar = null;

  install = () => {
    this.radar = null;
  };

  getLastRadar = (): Radar => {
    return this.radar;
  };

  willInstallRadar = (): boolean => this.radar !== null;

  addRadar = () => {
    const next: IPosition = nextGoal();

    if (PositionUtils.equal(next, LAST_GOAL)) {
      this.allInstalled = true;
    }

    this.radar = new Radar(next);
  };

  needNewRadar = (robot: Robot): boolean => {
    if (this.allInstalled || getBoard().getOreAmount() > 20) return false;

    if (robot.getPosition().x === 0 && !this.willInstallRadar()) return true;

    return getBoard().getOreAmount() < 10 && !this.willInstallRadar();
  };
}

const getRadarOrchestrator = (): RadarOrchestrator => {
  if (!radarOrchestrator) {
    radarOrchestrator = new RadarOrchestrator();
  }

  return radarOrchestrator;
};
















class StrategyDefiner {
  private state: EStrategyType = EStrategyType.UNDEFINED;

  select = (robot: Robot, gameContext: TGameContext): AStrategy => {
    const radarOrchestrator: RadarOrchestrator = getRadarOrchestrator();
    const nearest: Case | null = getBoard().findNeareastOre(
      robot.getPosition(),
      getOreOrchestrator().getGoalPositions()
    );

    if (this.state === EStrategyType.RADAR_REQUESTOR) {
      this.state = EStrategyType.RADAR_INSTALLOR;
      return new RadarInstallorStrategy(radarOrchestrator.getLastRadar());
    }

    if (robot.getItem() === EItem.ORE) {
      this.state = EStrategyType.DELIVEROR;
      return new DeliverorStrategy(robot);
    }

    if (radarOrchestrator.needNewRadar(robot) && gameContext.radarCd === 0) {
      radarOrchestrator.addRadar();
      this.state = EStrategyType.RADAR_REQUESTOR;
      return new RadarRequestorStrategy();
    }

    if (nearest !== null && robot.getItem() === EItem.NONE) {
      this.state = EStrategyType.COLLECTOR;
      return new CollectorStrategy(robot, nearest.getPosition());
    }

    if (radarOrchestrator.willInstallRadar()) {
      this.state = EStrategyType.FOLLOWER;
      return new FollowerStrategy(radarOrchestrator.getLastRadar());
    }

    this.state = EStrategyType.WAITOR;
    return new WaitorStrategy();
  };
}








class CollectorStrategy extends AStrategy {
  private goal: IPosition;
  private prevPosition: IPosition;

  constructor(robot: Robot, goal: IPosition) {
    super();
    this.goal = goal;
    getOreOrchestrator().addGoal(robot, goal);
  }

  computeRound = (robot: Robot) => {
    const robotPosition = robot.getPosition();
    const currentCase: Case = getBoard().getCase(this.goal);

    if (
      currentCase.getOre() === 0 ||
      robot.getItem() === EItem.ORE ||
      currentCase.hasOnlyDoubt() ||
      PositionUtils.equal(this.prevPosition, robotPosition)
    ) {
      if (!currentCase.isVisible()) {
        currentCase.collectOre();
      }
      getOreOrchestrator().removeGoal(robot);
      this.avancement = EStrategyAvancement.COMPLETED;
    }
    this.prevPosition = robotPosition;
  };

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.DIG,
      param: this.goal
    };
  };
}




class DeliverorStrategy extends AStrategy {
  private goal: IPosition;

  constructor(robot: Robot) {
    super();
    this.goal = { x: 0, y: robot.getPosition().y };
  }

  computeRound(robot: Robot): void {
    if (robot.getPosition().x === 0) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  }

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.MOVE,
      param: this.goal
    };
  };
}



class FollowerStrategy extends AStrategy {
  private radar: Radar;

  constructor(radar: Radar) {
    super();
    this.radar = radar;
  }

  computeRound = () => {
    if (this.radar.isInstalled()) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  };

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.MOVE,
      param: this.radar.getPosition()
    };
  };
}






class RadarInstallorStrategy extends AStrategy {
  radar: Radar;

  constructor(radar: Radar) {
    super();
    this.radar = radar;
  }

  computeRound = (robot: Robot) => {
    if (
      getBoard()
        .getCase(this.radar.getPosition())
        .hasOnlyDoubt()
    ) {
      this.radar.incrementPosition();
    }

    if (robot.getItem() !== EItem.RADAR) {
      this.radar.install();
      getRadarOrchestrator().install();
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  };

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.DIG,
      param: this.radar.getPosition()
    };
  };
}




class RadarRequestorStrategy extends AStrategy {
  hasRadar: boolean = false;

  computeRound(robot: Robot): void {
    if (robot.getItem() === EItem.RADAR) {
      this.hasRadar === true;
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  }

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.REQUEST,
      param: EObject.RADAR
    };
  };
}


class WaitorStrategy extends AStrategy {
  private hasWaited: boolean = false;

  computeRound(): void {
    if (this.hasWaited) {
      this.avancement = EStrategyAvancement.COMPLETED;
    } else {
      this.hasWaited = true;
    }
  }

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.WAIT,
      param: null
    };
  };
}


enum ECaseType {
  UNKOWN,
  KNOWN
}

enum ECaseState {
  EMPTY = 0,
  DIG = 1
}

class Case {
  private doubt: boolean = false;
  private position: IPosition;
  private type: ECaseType = ECaseType.UNKOWN;
  private ore: number;
  private hole: ECaseState;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  getPosition = (): IPosition => this.position;
  getType = (): ECaseType => this.type;
  getOre = (): number => this.ore;
  getHole = (): ECaseState => this.hole;

  addDoubt = () => (this.doubt = true);
  hasDoubt = (): boolean => this.doubt || this.type === ECaseType.UNKOWN;
  hasOnlyDoubt = (): boolean => this.doubt;
  isVisible = (): boolean => this.type === ECaseType.KNOWN;

  setCaseType = (ore: string) => {
    this.type = ore === "?" ? ECaseType.UNKOWN : ECaseType.KNOWN;
  };

  update = (ore: string, hole: ECaseState) => {
    this.ore = ore === "?" ? 0 : parseInt(ore);
    this.hole = hole;
  };

  collectOre = () => {
    this.ore -= 1;
  };

  isDigged = (): boolean => this.hole === ECaseState.DIG;

  hasOre = (): boolean => this.ore >= 1;
}
enum EItem {
  NONE = -1,
  RADAR = 2,
  TRAP = 3,
  ORE = 4
}
class PositionUtils {
  static isInMap = (p: IPosition): boolean => 0 <= p.x && p.x < 30 && 0 <= p.y && p.y < 15;

  static isInMapOrNull = (p: IPosition): IPosition => (PositionUtils.isInMap(p) ? p : null);

  static right = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x + 1, y: p.y });

  static left = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x - 1, y: p.y });

  static bottom = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x, y: p.y + 1 });

  static top = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x, y: p.y - 1 });

  static equal = (p1: IPosition, p2: IPosition): boolean => {
    if (!p1 || !p2) return false;

    return p1.x === p2.x && p1.y === p2.y;
  };

  static distanceTo = (p1: IPosition, p2: IPosition): number => {
    return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
  };
}

interface IPosition {
  x: number;
  y: number;
}



class Board {
  private width: number;
  private height: number;
  private cases: Case[][];
  private oreCases: Case[] = [];
  private oreAmount: number = 0;

  init = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    this.cases = [];

    for (let y = 0; y < height; y++) {
      const rowCases: Case[] = [];

      for (let x = 0; x < width; x++) {
        rowCases.push(new Case(x, y));
      }
      this.cases.push(rowCases);
    }
  };

  addDoubt = (position: IPosition | null) => {
    if (!position) return;

    this.getCase(position).addDoubt();
  };

  updateMap = (mapBlob: string[]) => {
    this.oreCases = [];
    this.oreAmount = 0;
    for (let y = 0; y < this.height; y++) {
      const rowBlob: string[] = mapBlob[y].split(" ");

      for (let x = 0; x < this.width; x++) {
        const currentCase: Case = this.getCase({ x, y });
        const ore: string = rowBlob[2 * x]; // amount of ore or "?" if unknown
        const hole: ECaseState = parseInt(rowBlob[2 * x + 1]); // 1 if cell has a hole

        currentCase.setCaseType(ore);
        if (ore !== "?") currentCase.update(ore, hole);

        if (currentCase.hasOre() && !currentCase.hasOnlyDoubt()) {
          this.oreCases.push(currentCase);
          if (currentCase.isVisible()) this.oreAmount += parseInt(ore);
        }
      }
    }
  };

  getCase = ({ x, y }: IPosition): Case | null => {
    if (x < 0 || x >= this.width) return null;
    if (y < 0 || y >= this.height) return null;

    return this.cases[y][x];
  };

  findNeareast = (from: IPosition, goalCases: Case[], toAvoid: IPosition[]): Case | null => {
    let closest: Case | null = null;
    let distance: number;

    console.error("FIND NEAREST:", goalCases.map(c => c.getPosition()));
    console.error("TO AVOID:", toAvoid);

    goalCases
      .filter((currentCase: Case) => !toAvoid.find(p1 => PositionUtils.equal(p1, currentCase.getPosition())))
      .forEach((currentCase: Case) => {
        const tmpDistance: number = PositionUtils.distanceTo(from, currentCase.getPosition());
        if (closest === null || tmpDistance < distance) {
          closest = currentCase;
          distance = tmpDistance;
        }
      });

    return closest;
  };

  findNeareastOre = (from: IPosition, toAvoid: IPosition[]): Case | null =>
    this.findNeareast(from, this.oreCases, toAvoid);

  getOreAmount = (): number => this.oreAmount;
}

let board: Board = null;

const getBoard = (): Board => {
  if (!board) {
    board = new Board();
  }

  return board;
};


interface IEnemyRobots {
  [id: number]: EnemyRobot;
}

class EnemyRobotsStore {
  private robots: IEnemyRobots = {};

  add = (id: number, robot: EnemyRobot) => {
    this.robots[id] = robot;
  };

  getById = (id: number): EnemyRobot => {
    return this.robots[id];
  };
}








type TGameContext = {
  radarCd: number;
};

class Game {
  width: number;
  height: number;
  gameContext: TGameContext = { radarCd: 0 };
  myRobots: RobotsStore = new RobotsStore();
  enemyRobots: EnemyRobotsStore = new EnemyRobotsStore();

  constructor(width: number, height: number) {
    getBoard().init(width, height);
  }

  setRadarCd = (radarCd: number) => (this.gameContext.radarCd = radarCd);

  updateMap = (mapBlob: string[]) => getBoard().updateMap(mapBlob);

  addEntity = (entityBlob: string[]) => {
    const id: number = parseInt(entityBlob[0]); // unique id of the entity
    const entityType: EEntityType = parseInt(entityBlob[1]);
    const x: number = parseInt(entityBlob[2]);
    const y: number = parseInt(entityBlob[3]);
    const item: EItem = parseInt(entityBlob[4]);

    if (entityType === EEntityType.ROBOT) {
      let robot: Robot = this.myRobots.getById(id);
      if (!robot) {
        robot = new Robot(EEntityType.ROBOT, id);
        robot.init({ x, y }, this.gameContext);
        this.myRobots.add(id, robot);
      } else {
        robot.setPosition({ x, y });
      }
      robot.newRound(item, this.gameContext);
    }
    if (entityType === EEntityType.ENNEMY_ROBOT) {
      let enemyRobot: EnemyRobot = this.enemyRobots.getById(id);
      if (!enemyRobot) {
        enemyRobot = new EnemyRobot(EEntityType.ENNEMY_ROBOT, id);
        this.enemyRobots.add(id, enemyRobot);
      }
      enemyRobot.newRound({ x, y }, item);
    }
  };

  play = (order: number) => {
    this.myRobots.getByOrder(order).play();
  };
}

/**
 * Deliver more ore to hq (left side of the map) than your opponent. Use radars to find ore but beware of traps!
 **/
const ROBOT_AMOUNT: number = 5;

const mReadline = (): string => {
  const line = readline();

  // console.error(line);
  return line;
};



var inputs: string[] = mReadline().split(" ");
const width: number = parseInt(inputs[0]);
const height: number = parseInt(inputs[1]); // size of the map

const game = new Game(width, height);

// game loop
while (true) {
  var inputs: string[] = mReadline().split(" ");
  // const myScore: number = parseInt(inputs[0]); // Amount of ore delivered
  // const opponentScore: number = parseInt(inputs[1]);

  const mapBlob: string[] = [];
  for (let i = 0; i < height; i++) {
    mapBlob.push(mReadline());
  }
  game.updateMap(mapBlob);

  var inputs: string[] = mReadline().split(" ");

  const entityCount: number = parseInt(inputs[0]); // number of entities visible to you
  game.setRadarCd(parseInt(inputs[1])); // turns left until a new radar can be requested
  // const trapCooldown: number = parseInt(inputs[2]); // turns left until a new trap can be requested
  for (let i = 0; i < entityCount; i++) {
    game.addEntity(mReadline().split(" "));
  }
  for (let i = 0; i < ROBOT_AMOUNT; i++) {
    game.play(i);
  }
}
