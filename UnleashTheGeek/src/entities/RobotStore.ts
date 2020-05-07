import { Robot } from "./Robot";

interface IRobots {
  [id: number]: Robot;
}

export class RobotsStore {
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
