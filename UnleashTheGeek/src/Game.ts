import { getBoard } from "./Board";
import { EnemyRobot } from "./entities/EnemyRobot";
import { Robot } from "./entities/Robot";
import { RobotsStore } from "./entities/RobotStore";
import { EItem } from "./utils/Item";
import { EEntityType } from "./entities/Types";
import { EnemyRobotsStore } from "./EnemyRobotsStore";

export type TGameContext = {
  radarCd: number;
};

export class Game {
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
