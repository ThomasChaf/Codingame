import { IActionnable } from "./interfaces/IActionnable";
import { Store } from "./Store";
import { ALL_COLOR } from "./utils";

export class Cast extends IActionnable {
  public id: string;
  public type: string = "CAST";
  public actionable: boolean;

  constructor(id: string, actionable: boolean, costs: number[]) {
    super();
    this.id = id;
    this.actionable = actionable;
    this.set(costs);
  }

  isActionnable(store: Store): boolean {
    for (const color of ALL_COLOR) {
      if (store.at(color) + this.at(color) < 0) return false;
    }

    return true;
  }
}
