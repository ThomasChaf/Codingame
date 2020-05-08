import { Position } from "../Position";

export abstract class APacman {
  constructor(protected id: number, protected position: Position) {}

  setPosition = (position: Position) => (this.position = position);
  getPosition = (): Position => this.position;
}

export type Store<T> = {
  [key: string]: T;
};
