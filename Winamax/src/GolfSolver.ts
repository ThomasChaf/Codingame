import { Graph } from "./Graph";
import { DIRECTIONS, asKey } from "./Position";

type Done = {
  [key: string]: boolean;
};

export class Results {
  public results: { [key: string]: string[][] } = {};
  public answers: { [key: string]: number } = {};
  public done: Done = {};
  public undecided: string[] = [];

  add(key: string, paths: string[][] | null) {
    if (paths) this.results[key] = paths;
  }

  at(key: string): string[] | undefined {
    const answer = this.answers[key];
    return this.results[key][answer];
  }

  prepareFlatten() {
    Object.keys(this.results).forEach((key: string) => {
      this.answers[key] = 0;
      if (this.results[key].length === 1) {
        this.results[key][0].forEach((path: string) => {
          this.done[path] = true;
        });
      }
      if (this.results[key].length > 1) {
        this.undecided.push(key);
      }
    });
  }

  cleanPath(path: string[], max: number) {
    for (let i = 0; i < max; i++) {
      this.done[path[i]] = false;
    }
  }

  try(keyToDecide: string): boolean {
    const possiblePath = this.at(keyToDecide);
    if (!possiblePath) {
      return false;
    }

    for (let j = 0; j < possiblePath.length; j++) {
      let key = possiblePath[j];
      if (this.done[key]) {
        this.cleanPath(possiblePath, j);
        return false;
      }
      this.done[key] = true;
    }
    return true;
  }

  invalidateAnswer(i: number): boolean {
    const key = this.undecided[i];
    const lastKey = this.undecided[i - 1];
    const numberOfPossibility = this.results[key].length;

    if (this.answers[key] >= numberOfPossibility) {
      const lastPath = this.at(lastKey);
      if (lastPath) this.cleanPath(lastPath, lastPath.length);
      this.answers[key] = 0;
      this.answers[lastKey] += 1;
      return true;
    }
    this.answers[key] += 1;
    return false;
  }

  flatten() {
    let i = 0;
    while (i < this.undecided.length) {
      const keyToDecide = this.undecided[i];

      const success = this.try(keyToDecide);

      if (success) {
        i += 1;
      } else {
        if (this.invalidateAnswer(i)) {
          i -= 1;
        }
      }
    }
  }
}

export class GolfSolver extends Graph {
  public solveBall(key: string, amount: number, prevPath: string[]): string[][] | null {
    if (amount === 0) return null;

    const fromNode = this.get(key);
    const paths: string[][] = [];

    DIRECTIONS.forEach(([incX, incY]) => {
      const nextPath = [];
      let node;
      for (let i = 1; i <= amount; i++) {
        const nextKey = asKey(fromNode.position.x + i * incX, fromNode.position.y + i * incY);

        node = this.get(nextKey);
        if (!node || prevPath.includes(nextKey)) return;

        nextPath.push(nextKey);
      }
      if (!node) return;

      const path = [...prevPath, ...nextPath];

      if (node.meta.type === "H") {
        paths.push(path);
        return;
      }
      if (node.meta.type === ".") {
        const nextPath = this.solveBall(node.key, amount - 1, path);
        if (nextPath === null) return;
        else paths.push(...nextPath);
      }
    });

    return paths;
  }

  public exec(): Results {
    const results = new Results();

    Object.keys(this.ballsPosition).forEach((key: string) => {
      results.add(key, this.solveBall(key, this.ballsPosition[key], [key]));
    });

    results.prepareFlatten();

    results.flatten();

    return results;
  }
}
