import { Casts } from "./Casts";
import { Receipts, ReceiptNullable } from "./Receipts";
import { Books } from "./Books";
import { Store } from "./Store";
import { ALL_COLOR } from "./utils";
import { IGemmable } from "./interfaces/IGemmable";
import { ActionNullable, IActionnable } from "./interfaces/IActionnable";

export class Game {
  public receipts: Receipts = new Receipts();
  public myStore: Store = new Store();
  public enemyStore: Store = new Store();
  public myCasts: Casts = new Casts();
  public enemyCasts: Casts = new Casts();
  public books: Books = new Books();

  reset() {
    this.receipts.reset();
    this.myStore.reset();
    this.enemyStore.reset();
    this.myCasts.reset();
    this.enemyCasts.reset();
    this.books.reset();
  }

  computeNextGems(cast: IGemmable): number[] {
    return ALL_COLOR.map((color) => this.myStore.at(color) + cast.at(color));
  }

  computePlay(path = [], deep = 0): [number, ActionNullable, ReceiptNullable] {
    let fastestZ = 0;
    let fastestReceipt: ReceiptNullable = null;
    let fastestAction: ActionNullable = null;

    [...this.myCasts.casts, ...this.books.books].forEach((action: IActionnable) => {
      if (!action.isActionnable(this.myStore)) return;

      const nextGems = this.computeNextGems(action);
      const [nextReceipt, nextZ] = this.receipts.findFastestReceipt(nextGems);
      if (!nextReceipt) return;

      if (
        !fastestReceipt ||
        nextZ < fastestZ ||
        (nextZ === fastestZ && nextReceipt.price > fastestReceipt.price)
      ) {
        fastestZ = nextZ;
        fastestReceipt = nextReceipt;
        fastestAction = action;
      }
    });

    return [fastestZ, fastestAction, fastestReceipt];
  }

  play() {
    const receipt = this.receipts.findMoreExpensiveReceipt(this.myStore);

    if (!receipt) {
      this.receipts.prePlay(this.myStore);
      const [z, action, r2] = this.computePlay();

      if (!action) {
        console.log("REST");
        return;
      }

      if (action.type === "BOOK") {
        console.log(`LEARN ${action.id}`);
      } else if (action.type === "CAST" && action.actionable) {
        console.log(`CAST ${action.id}`);
      } else {
        console.log("REST");
      }
    } else {
      console.log(`BREW ${receipt.id}`);
    }
  }
}
