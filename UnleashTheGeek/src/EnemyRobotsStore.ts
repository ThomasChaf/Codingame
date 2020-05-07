import { EnemyRobot } from "./entities/EnemyRobot";

interface IEnemyRobots {
  [id: number]: EnemyRobot;
}

export class EnemyRobotsStore {
  private robots: IEnemyRobots = {};

  add = (id: number, robot: EnemyRobot) => {
    this.robots[id] = robot;
  };

  getById = (id: number): EnemyRobot => {
    return this.robots[id];
  };
}
