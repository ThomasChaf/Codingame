import { IActionnable } from "./interfaces/IActionnable";
import { Store } from "./Store";
import { BLUE_COLOR } from "./utils";

export class Book extends IActionnable {
  public id: string;
  public type: string = "BOOK";
  public tomeIndex: number;
  public actionable: boolean = true;

  constructor(id: string, gems: number[], tomeIndex: number) {
    super();
    this.id = id;
    this.tomeIndex = tomeIndex;
    this.set(gems);
  }

  isActionnable(store: Store): boolean {
    if (store.at(BLUE_COLOR) < this.tomeIndex) return false;

    return true;
  }
}
