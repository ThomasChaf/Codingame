import { Position } from "../Position";

export abstract class APacman {
  constructor(public id: number, protected position: Position) {}

  setPosition = (position: Position) => (this.position = position);
  getPosition = (): Position => this.position;
}
