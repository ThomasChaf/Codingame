import { PacmanProperties } from "./APacman";

export type InternalStore<T> = {
  [key: string]: T;
};

export class Store<T> {
  private ids: string[] = [];
  private store: InternalStore<T> = {};

  constructor(protected Ctor: any) {}

  get length(): number {
    return Object.keys(this.store).length;
  }

  add(id: number, properties: PacmanProperties) {
    this.store[id] = new this.Ctor(id, properties);
  }

  get(id: number): T {
    return this.store[id];
  }

  exist(id: number): boolean {
    return !!this.store[id];
  }

  forEach(cb: (t: T) => void) {
    Object.values(this.store).forEach(cb);
  }

  map<U>(cb: (t: T) => U): U[] {
    return Object.values(this.store).map(cb);
  }

  inventory() {
    this.ids = Object.keys(this.store);
  }

  isAlive(id: number) {
    this.ids = this.ids.filter((_id: string) => _id !== id.toString());
  }

  removeDiedPac() {
    this.ids.forEach((id) => {
      delete this.store[id];
    });
  }
}
