import { ActionAvailable } from "./interfaces/ActionAvailable";
import { IActionnable } from "./interfaces/IActionnable";
import { ALL_COLOR } from "./utils";

export class Cast extends IActionnable {
  public id: string;
  public type: string = "CAST";
  public actionable: boolean;
  public repeatable: boolean;

  constructor(id: string, gems: number[], actionable: boolean, repeatable: boolean) {
    super();
    this.id = id;
    this.actionable = actionable;
    this.repeatable = repeatable;
    this.set(gems);
  }

  computeNextGems(storeGems: number[]): number[] | null {
    const nextGems = ALL_COLOR.map((color) => storeGems[color] + this.at(color));

    if (nextGems.every((sum) => sum >= 0) && nextGems.reduce((acc, value) => acc + value, 0) <= 10) {
      return nextGems;
    }
    return null;
  }
}
