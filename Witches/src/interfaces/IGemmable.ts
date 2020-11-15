import { ALL_COLOR } from "../utils";

type GemStorage = number[];

export abstract class IGemmable {
  public store: GemStorage = [0, 0, 0, 0];

  getGems = (): number[] => {
    return [...this.store];
  };

  forEachGem(cb: (v: number, k: number) => any) {
    this.store.forEach(cb);
  }

  reduceGem<T>(cb: (acc: T, v: number, k: number) => T, initial: T): T {
    return this.store.reduce<T>(cb, initial);
  }

  at(index: number): number {
    return this.store[index];
  }

  setAt(index: number, value: number): void {
    this.store[index] = value;
  }

  set(gems: number[]): void {
    for (const color of ALL_COLOR) {
      this.setAt(color, gems[color]);
    }
  }

  reset(): void {
    this.store = [];
  }
}
