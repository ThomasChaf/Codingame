import { IGemmable } from "./interfaces/IGemmable";
import { Store } from "./Store";
import { ALL_COLOR } from "./utils";

export class Cast extends IGemmable {
  public id: string;
  public castable: boolean;

  constructor(id: string, castable: boolean, costs: number[]) {
    super();
    this.id = id;
    this.castable = castable;
    this.set(costs);
  }

  isCastable(store: Store): boolean {
    for (const color of ALL_COLOR) {
      if (store.at(color) + this.at(color) < 0) return false;
    }

    return true;
  }
}
