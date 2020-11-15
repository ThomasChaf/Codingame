import { ActionAvailable } from "./interfaces/ActionAvailable";
import { IActionnable } from "./interfaces/IActionnable";
import { ALL_COLOR, BLUE_COLOR } from "./utils";

export class Book extends IActionnable {
  public id: string;
  public type: string = "BOOK";
  public taxCount: number;
  public tomeIndex: number;
  public actionable: boolean = true;
  public repeatable: boolean = false;

  constructor(id: string, gems: number[], tomeIndex: number, taxCount: number) {
    super();
    this.id = id;
    this.taxCount = taxCount;
    this.tomeIndex = tomeIndex;
    this.set(gems);
  }

  computeNextGems(
    storeGems: number[],
    bookAvailable: ActionAvailable,
    castAvailable: ActionAvailable
  ): number[] | null {
    if (storeGems[BLUE_COLOR] < this.tomeIndex) return null;

    const nextGems = ALL_COLOR.map((color) => storeGems[color] + this.at(color));

    // 1) I took book
    if (bookAvailable[this.id] && !castAvailable[this.id]) {
      nextGems[BLUE_COLOR] -= this.tomeIndex;
      nextGems[BLUE_COLOR] += this.taxCount;
    }

    return nextGems.every((sum) => sum >= 0) ? nextGems : null;
  }
}
