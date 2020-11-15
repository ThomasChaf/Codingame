import { CastNullable, Casts } from "./Casts";
import { Receipts } from "./Receipts";
import { BookNullable, Books } from "./Books";
import { Store } from "./Store";
import { BLUE_COLOR, GET_BLUE_CAST_ID } from "./utils";
import { IActionnable } from "./interfaces/IActionnable";
import { Action } from "./Action";
import { Book } from "./Book";

const compareAction = (a: Action, b: Action) => {
  const zDiff = a.z - b.z;
  if (zDiff !== 0) return zDiff;

  const gptDiff = b.gpt - a.gpt;
  if (gptDiff !== 0) return gptDiff;

  if (b.actionnables[0] && a.actionnables[0]) {
    return b.actionnables[0].actionable ? 1 : -1;
  }
  return 0;
};

const logActionnables = (actionnables: IActionnable[]) => {
  return actionnables.map(({ id, type }) => `${type === "BOOK" ? "BK" : "CA"}:${id}`).join("|");
};

const logAction = (action: Action) => {
  const { z, actionnables, gpt, receipt, waitTime } = action;

  return `Z: ${z} [${Math.round(gpt)}] [WT: ${waitTime}]=> ${receipt && receipt.id} Acts: ${logActionnables(
    actionnables
  )}`;
};

export class Game {
  public round: number = 0;
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

  _computeBestActions(action: Action, deep: number): Action {
    if (deep === 4 || action.z === 0 || action.gpt < 11) return action;

    let bestAction = action;

    [...this.myCasts.casts, ...this.books.books].forEach((actionnable: IActionnable) => {
      const nextGems = actionnable.computeNextGems(action.gems, action.bookAvailable, action.castAvailable);
      if (!nextGems) return;

      const [nextReceipt, nextZ] = this.receipts.findFastestReceipt(nextGems, action.z);
      if (!nextReceipt) return;

      const nextAction = action.computeNextAction(actionnable, nextReceipt, nextZ, nextGems, this.round);

      const bestNextAction = this._computeBestActions(nextAction, deep + 1);
      if (bestAction.z === -1 || compareAction(bestAction, bestNextAction) > 0) {
        bestAction = bestNextAction;
      }
    });

    return bestAction;
  }

  computeBestActions(): Action {
    const defaultAction: Action = new Action(
      this.myCasts.getCastAvailable(),
      this.books.getBookAvailable(),
      this.myStore.getGems()
    );

    return this._computeBestActions(defaultAction, 0);
  }

  computeDefaultAction(): [BookNullable, CastNullable] {
    const amountBlue = this.myStore.at(BLUE_COLOR);
    if (amountBlue < 4) {
      return [null, this.myCasts.getById(GET_BLUE_CAST_ID)];
    }
    return [this.books.first(), null];
  }

  play() {
    const book13 = this.books.getById("13");
    if (book13 && book13.tomeIndex <= this.myStore.at(BLUE_COLOR)) {
      console.log("LEARN 13");
      return;
    }

    const receiptReady = this.receipts.prePlay(this.myStore);

    const bestAction = this.computeBestActions();
    const { gpt, actionnables, receipt, z, waitTime, repeat } = bestAction;

    console.error("===================");
    console.error(
      "FINAL Z:",
      z,
      "FINAL GPT:",
      Math.round(gpt),
      "WT:",
      waitTime,
      "RPT:",
      repeat,
      logActionnables(actionnables)
    );
    console.error("RECEIPT:", receipt && receipt.id);

    if (receiptReady && receiptReady.isBetterReceipt(receipt, bestAction.getNbRound())) {
      console.log(`BREW ${receiptReady.id}`);
      return;
    }

    if (actionnables.length === 0) {
      const [book, cast] = this.computeDefaultAction();

      if (book) {
        console.log(`LEARN ${book.id}`);
      } else if (cast && cast.actionable) {
        console.log(`CAST ${cast.id}`);
      } else {
        console.log("REST");
      }
      return;
    }

    const book = actionnables.find((action) => {
      return action.type === "BOOK" && (action as Book).tomeIndex <= this.myStore.at(BLUE_COLOR);
    });

    if (book) {
      console.log(`LEARN ${book.id}`);
      return;
    }

    const cast = actionnables.find((action) => {
      return action.type === "CAST";
    });

    if (cast && cast.actionable) {
      console.log(`CAST ${cast.id} ${repeat}`);
    } else {
      console.log("REST");
    }
  }

  afterPlay() {
    this.round += 1;
  }
}
