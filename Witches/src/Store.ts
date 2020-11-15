import { IGemmable } from "./interfaces/IGemmable";
import { Receipt } from "./Receipt";
import { ALL_COLOR } from "./utils";

export class Store extends IGemmable {
  add(gems: number[], score: number) {
    this.set(gems);
  }

  hasEnoughGems(receipt: Receipt): boolean {
    for (const color of ALL_COLOR) {
      if (this.at(color) + receipt.at(color) < 0) return false;
    }
    return true;
  }
}
