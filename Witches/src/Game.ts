import { Cast } from "./Cast";
import { Casts, CastNullable } from "./Casts";
import { Receipts, ReceiptNullable } from "./Receipts";
import { Store } from "./Store";
import { ALL_COLOR } from "./utils";

export class Game {
  public receipts: Receipts = new Receipts();
  public myStore: Store = new Store();
  public enemyStore: Store = new Store();
  public myCasts: Casts = new Casts();
  public enemyCasts: Casts = new Casts();

  reset() {
    this.receipts.reset();
    this.myStore.reset();
    this.enemyStore.reset();
    this.myCasts.reset();
    this.enemyCasts.reset();
  }

  computeNextGems(cast: Cast): number[] {
    return ALL_COLOR.map((color) => this.myStore.at(color) + cast.at(color));
  }

  findFastestCast(): CastNullable {
    let fastestZ = 0;
    let fastestReceipt: ReceiptNullable = null;
    let fastestCast: CastNullable = null;

    this.myCasts.casts.forEach((cast) => {
      if (!cast.isCastable(this.myStore)) return;

      const nextGems = this.computeNextGems(cast);
      const [nextReceipt, nextZ] = this.receipts.findFastestReceipt(nextGems);
      if (!nextReceipt) return;

      if (
        !fastestReceipt ||
        nextZ < fastestZ ||
        (nextZ === fastestZ && nextReceipt.price > fastestReceipt.price)
      ) {
        fastestZ = nextZ;
        fastestReceipt = nextReceipt;
        fastestCast = cast;
      }
    });
    return fastestCast;
  }

  play() {
    const receipt = this.receipts.findMoreExpensiveReceipt(this.myStore);

    if (!receipt) {
      this.receipts.prePlay(this.myStore);
      const spell = this.findFastestCast();

      if (!spell || !spell.castable) {
        console.log("REST");
      } else {
        console.log(`CAST ${spell.id}`);
      }
    } else {
      console.log(`BREW ${receipt.id}`);
    }
  }
}
