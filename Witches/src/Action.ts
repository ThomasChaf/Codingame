import { ReceiptNullable } from "./Receipts";
import { IActionnable } from "./interfaces/IActionnable";
import { ActionAvailable } from "./interfaces/ActionAvailable";
import { Book } from "./Book";
import { Receipt } from "./Receipt";
import { ALL_COLOR, BLUE_COLOR } from "./utils";

export class Action {
  public gpt: number = 0;
  public z: number;
  public waitTime: number;
  public repeat: number;
  public bookAvailable: ActionAvailable;
  public castAvailable: ActionAvailable;
  public gems: number[];
  public actionnables: IActionnable[];
  public receipt: ReceiptNullable;
  public isTakingBook: boolean;

  constructor(
    castAvailable: ActionAvailable,
    bookAvailable: ActionAvailable,
    gems: number[],
    gpt: number = 1000,
    receipt: ReceiptNullable = null,
    actionnables: IActionnable[] = [],
    z: number = -1,
    waitTime = 0,
    isTakingBook = false,
    repeat = 1
  ) {
    this.gpt = gpt;
    this.z = z;
    this.castAvailable = castAvailable;
    this.bookAvailable = bookAvailable;
    this.gems = gems;
    this.actionnables = actionnables;
    this.receipt = receipt;
    this.waitTime = waitTime;
    this.repeat = repeat;
    this.isTakingBook = isTakingBook;
  }

  getNbRound(): number {
    return this.actionnables.length + this.waitTime;
  }

  computeNextAction(
    actionnable: IActionnable,
    nextReceipt: Receipt,
    nextZ: number,
    nextGems: number[],
    round: number
  ): Action {
    let repeat = this.repeat;
    let waitTime = this.waitTime;
    let isTakingBook = this.isTakingBook;
    const bookAvailable = { ...this.bookAvailable };
    const castAvailable = { ...this.castAvailable };
    const actionnables = [...this.actionnables, actionnable];

    if (actionnable.type === "BOOK") {
      // 1) I took book
      isTakingBook = true;
      if (bookAvailable[actionnable.id] && !castAvailable[actionnable.id]) {
        if (round > 20 && !isTakingBook) {
          waitTime += 1;
        }
        bookAvailable[actionnable.id] = false;
        castAvailable[actionnable.id] = true;
        nextGems[BLUE_COLOR] = nextGems[BLUE_COLOR] - (actionnable as Book).tomeIndex;
      }
      // 2) Book taken I cast
      else if (!bookAvailable[actionnable.id] && castAvailable[actionnable.id]) {
        castAvailable[actionnable.id] = false;
      }
      // 3) Book taken spell casted I rest
      else if (!bookAvailable[actionnable.id] && !castAvailable[actionnable.id]) {
        waitTime += 1;
        Object.keys(castAvailable).forEach((actionId) => {
          castAvailable[actionId] = true;
        });
      }
    }

    if (actionnable.type === "CAST") {
      const lastAction = this.actionnables[this.actionnables.length - 1];
      const isCastAvailable = castAvailable[actionnable.id];

      // 1) Le cast est disponible
      if (isCastAvailable) {
        castAvailable[actionnable.id] = false;
      }
      // 2) Le cast est repetable
      else if (!isCastAvailable && lastAction && lastAction.id === actionnable.id && actionnable.repeatable) {
        actionnables.pop();
        if (actionnables.length === 1) {
          repeat += 1;
        }
      }
      // 3) Le cast n'est pas disponible
      else if (!isCastAvailable) {
        waitTime += 1;
        castAvailable[actionnable.id] = true;
      }
    }

    const gpt = (nextReceipt.price * 3) / (actionnables.length + waitTime);

    return new Action(
      castAvailable,
      bookAvailable,
      nextGems,
      gpt,
      nextReceipt,
      actionnables,
      nextZ,
      waitTime,
      isTakingBook,
      repeat
    );
  }
}
