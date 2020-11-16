import { Cast } from "./Cast";
import { Casts, CastNullable } from "./Casts";
import { Receipts, ReceiptNullable } from "./Receipts";
import { Books, BookNullable } from "./Books";
import { Store } from "./Store";
import { ALL_COLOR } from "./utils";
import { IGemmable } from "./interfaces/IGemmable";

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

  findFastestBook(): BookNullable {
    let fastestY = 0;
    let fastestReceipt: ReceiptNullable = null;
    let fastestBook: BookNullable = null;

    this.books.books.forEach((book) => {
      if (!book.isLearnable(this.myStore)) return;

      const nextGems = this.computeNextGems(book);
      const [nextReceipt, nextY] = this.receipts.findFastestReceipt(nextGems);
      if (!nextReceipt) return;

      if (
        !fastestReceipt ||
        nextY < fastestY ||
        (nextY === fastestY && nextReceipt.price > fastestReceipt.price)
      ) {
        fastestY = nextY;
        fastestReceipt = nextReceipt;
        fastestBook = book;
      }
    });
    return fastestBook;
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
      const book = this.findFastestBook();
      if (!book) {
        const spell = this.findFastestCast();

        if (!spell || !spell.castable) {
          console.log("REST");
        } else {
          console.log(`CAST ${spell.id}`);
        }
      } else {
        console.log(`LEARN ${book.id}`);
      }
    } else {
      console.log(`BREW ${receipt.id}`);
    }
  }
}
